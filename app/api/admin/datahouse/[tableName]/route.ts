import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { tableName: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tableName } = params;
  const body = await req.json();

  const columns = Object.keys(body);
  const values = Object.values(body);

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const columnNames = columns.map((col) => `"${col}"`).join(", ");

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`,
      ...values
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

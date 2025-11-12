import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(
  req: NextRequest,
  context: { params: { tableName: string; id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tableName, id } = context.params;

  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM "${tableName}" WHERE id = $1`,
      id
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { tableName:string; id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tableName, id } = context.params;
  const body = await req.json();

  if (tableName === "User" && body.password) {
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
  }

  const columns = Object.keys(body).filter(
    (col) => col !== "id" && col !== "createdAt" && col !== "updatedAt"
  );
  const values = columns.map((col) => body[col]);

  const setClause = columns
    .map((col, i) => `"${col}" = $${i + 2}`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "${tableName}" SET ${setClause} WHERE id = $1`,
      id,
      ...values
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

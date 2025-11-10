import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TableViewClient from "./TableViewClient";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Button

// Function to fetch all data from a given table
async function getTableData(tableName: string) {
  // Prevent SQL injection by validating the table name
  const allowedTables = ["User", "Account", "Session", "Job", "Application", "VerificationToken"];
  if (!allowedTables.includes(tableName)) {
    throw new Error("Access to this table is not allowed.");
  }

  const data = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
  return data;
}

export default async function TableViewPage(props: {
  params: Promise<{ tableName: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // ✅ FIX: Await the params Promise
  const { tableName } = await props.params;

  // ✅ Make sure tableName exists
  if (!tableName) {
    throw new Error("No table name provided in route.");
  }

  const data = await getTableData(tableName);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Button asChild variant="outline" className="hover:bg-gray-100">
          <Link href="/admin/datahouse">Back to Datahouse</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-red-900 mb-8 text-center">
        Table: {tableName}
      </h1>
      <TableViewClient tableName={tableName} data={data as any[]} />
    </div>
  );
}

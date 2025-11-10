import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getTableNames() {
  const tables: Array<{ tablename: string }> = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public';
  `;
  return tables.map((table) => table.tablename);
}

export default async function DatahousePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const tableNames = await getTableNames();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-red-900 mb-8 text-center">
        Datahouse
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tableNames.map((tableName) => (
          <Link href={`/admin/datahouse/${tableName}`} key={tableName}>
            <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <h2 className="text-xl font-bold text-red-900">{tableName}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

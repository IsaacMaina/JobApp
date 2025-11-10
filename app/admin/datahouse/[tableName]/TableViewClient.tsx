"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";

type TableViewClientProps = {
  tableName: string;
  data: any[];
};

export default function TableViewClient({ tableName, data }: TableViewClientProps) {
  const router = useRouter();

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<any>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);

  // Pagination, sorting, and searching
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Dynamic itemsPerPage
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Sorting handler
  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Filtered, sorted, and paginated data
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Date sorting
      const isDate = !isNaN(new Date(valA).getTime()) && !isNaN(new Date(valB).getTime());
      if (isDate) {
        return sortDirection === "asc"
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]); // Added itemsPerPage to dependencies

  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // totalPages based on filteredData length

  // CRUD handlers
  const handleDelete = async () => {
    if (!itemToDelete) return;
    await fetch(`/api/admin/datahouse/${tableName}/${itemToDelete.id}`, { method: "DELETE" });
    setShowDeleteDialog(false);
    router.refresh();
  };

  const handleAddNew = async () => {
    await fetch(`/api/admin/datahouse/${tableName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setShowAddDialog(false);
    router.refresh();
  };

  const handleUpdate = async () => {
    if (!itemToEdit) return;
    await fetch(`/api/admin/datahouse/${tableName}/${itemToEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemToEdit),
    });
    setShowEditDialog(false);
    router.refresh();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setItemToEdit({ ...itemToEdit, [name]: type === "checkbox" ? checked : value });
  };

  if (!data || data.length === 0)
    return (
      <>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
        <p className="text-center mt-4">No data found in this table.</p>
      </>
    );

  return (
    <>
      <div className="flex justify-center mb-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span>no: of rows</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset to first page
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="hover:bg-gray-100">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="cursor-pointer"
                  onClick={() => handleSort(col)}
                >
                  {col} {sortColumn === col ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {typeof row[col] === "boolean"
                      ? row[col]
                        ? "true"
                        : "false"
                      : String(row[col])}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 hover:bg-gray-100"
                    onClick={() => {
                      setItemToEdit(row);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setItemToDelete(row);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>

      {/* Dialogs for Add/Edit/Delete */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item to {tableName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns
              .filter((col) => !["id", "createdAt", "updatedAt"].includes(col))
              .map((col) => (
                <div className="grid grid-cols-4 items-center gap-4" key={col}>
                  <Label htmlFor={col} className="text-right">
                    {col}
                  </Label>
                  {typeof data[0][col] === "boolean" ? (
                    <Checkbox
                      id={col}
                      name={col}
                      checked={newItem[col] || false}
                      onCheckedChange={(checked) =>
                        setNewItem({ ...newItem, [col]: checked })
                      }
                      className="col-span-3"
                    />
                  ) : typeof data[0][col] === "number" ? (
                    <Input
                      id={col}
                      name={col}
                      type="number"
                      value={newItem[col] || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  ) : (
                    <Input
                      id={col}
                      name={col}
                      value={newItem[col] || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNew}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item in {tableName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns
              .filter(
                (col) =>
                  !["id", "createdAt", "updatedAt"].includes(col) &&
                  (tableName === "User" ? col !== "password" : true)
              )
              .map((col) => (
                <div className="grid grid-cols-4 items-center gap-4" key={col}>
                  <Label htmlFor={col} className="text-right">
                    {col}
                  </Label>
                  {typeof itemToEdit?.[col] === "boolean" ? (
                    <Checkbox
                      id={col}
                      name={col}
                      checked={itemToEdit[col]}
                      onCheckedChange={(checked) =>
                        setItemToEdit({ ...itemToEdit, [col]: checked })
                      }
                      className="col-span-3"
                    />
                  ) : typeof itemToEdit?.[col] === "number" ? (
                    <Input
                      id={col}
                      name={col}
                      type="number"
                      value={itemToEdit[col] || ""}
                      onChange={handleEditInputChange}
                      className="col-span-3"
                    />
                  ) : (
                    <Input
                      id={col}
                      name={col}
                      value={itemToEdit?.[col] || ""}
                      onChange={handleEditInputChange}
                      className="col-span-3"
                    />
                  )}
                </div>
              ))}
            {tableName === "User" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  onChange={(e) =>
                    setItemToEdit({ ...itemToEdit, password: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

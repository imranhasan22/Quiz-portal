import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {SAMPLE_ROLES} from "../lib/dummy-data";

type myrole = {
  id: number;
  name: string;
  createdAt: string;
};

const Role: React.FC = () => {
  const [query, setQuery] = useState("");
  const [roles] = useState<myrole[]>(SAMPLE_ROLES); 
  const [deleteUser, setDeleteUser] = useState<myrole | null>(null);
  const navigate = useNavigate();

  // Filter logic
  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDelete = () => {
    if (deleteUser) {
      console.log("Deleted:", deleteUser);
      setDeleteUser(null);
    }
  };

  // Edit handler — navigate with data
  const handleEdit = (role: myrole) => {
    navigate(`/role/editrole/${role.id}`, { state: { role } });
  };

  return (
    <div className="flex-1 min-h-screen p-6">
      <div className="max-w-[1200px] mx-auto">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">All Roles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage application roles
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10 w-64"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              <Button
                className="bg-[#5670F7] hover:bg-blue-600 cursor-pointer"
                onClick={() => navigate("/role/addrole")}
              >
                <Plus className="w-4 h-4" />
                <span className="ml-2">Add Role</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border bg-gray-100">
                  <TableRow>
                    <TableHead className="w-16">SL</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Created At</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((role, idx) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell className="text-center">{role.name}</TableCell>
                      <TableCell className="text-center">
                        {role.createdAt}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            className="p-2 border bg-gray-100 text-blue-500 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleEdit(role)} 
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            className="p-2 border bg-gray-100 text-red-500 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setDeleteUser(role)} // open confirm
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Page 1 of 1 | Total Items: {filtered.length}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="cursor-pointer rounded-xm bg-[#5670F7] text-white hover:bg-blue-600"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  className="cursor-pointer rounded-xm bg-[#5670F7] text-white hover:bg-blue-600"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Confirm delete */}
      <ConfirmDialog
        open={!!deleteUser}
        title="Delete role?"
        message={
          deleteUser
            ? `Are you sure you want to delete “${deleteUser.name}”? This action cannot be undone.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => setDeleteUser(null)}
      />
    </div>
  );
};

export default Role;

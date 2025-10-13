import React, { useState } from "react";
import { Search, Columns, Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// shadcn/ui table components - adapt import path to your project structure
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

type myrole = {
  id: number;
  name: string;
  createdAt: string;
};

const SAMPLE_ROLES: myrole[] = [
  { id: 1, name: "Agent", createdAt: "October 8, 2025 12:42 PM" },
  { id: 2, name: "User", createdAt: "October 8, 2025 12:42 PM" },
  { id: 3, name: "Admin", createdAt: "October 8, 2025 12:42 PM" },
  { id: 4, name: "Super Admin", createdAt: "October 8, 2025 12:42 PM" },
];

const Role: React.FC = () => {
  const [query, setQuery] = useState("");
  const [roles] = useState<myrole[]>(SAMPLE_ROLES);

   const navigate = useNavigate();

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen p-6">
      <div className="max-w-[1200px] mx-auto">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">All Roles</CardTitle>
              <p className="text-sm text-muted-foreground">Manage application roles</p>
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

              <Button variant="outline" className="gap-2">
                <Columns className="w-4 h-4" />
                Columns
              </Button>

              <Button 
              onClick={() => navigate("/role/addrole")}
              >
                <Plus className="w-4 h-4" />
                <span className="ml-2">Add Role</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">SL</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((role, idx) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="p-2">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" className="p-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">Page 1 of 1 | Total Items: {filtered.length}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Role;

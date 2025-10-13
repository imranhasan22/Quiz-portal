import React, { useState } from "react";
import { Search, Columns, LogOut, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "./ui/table";
import { Input } from "./ui/input"; 
import { Button } from "./ui/button"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card"; 

const Sessions: React.FC = () => {
  const [search, setSearch] = useState("");

  const sessions = [
    { id: "superadmin", name: "Super Admin", email: "superadmin@example.com" },
    { id: "emp101", name: "John Doe", email: "john@example.com" },
    { id: "emp102", name: "Jane Smith", email: "jane@example.com" },
  ];

  const filtered = sessions.filter(
    (session) =>
      session.name.toLowerCase().includes(search.toLowerCase()) ||
      session.email.toLowerCase().includes(search.toLowerCase()) ||
      session.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-sm border">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Sessions</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Search */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <Input
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="flex items-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>{session.name}</TableCell>
                    <TableCell>{session.email}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 rounded-xm border bg-gray-50 cursor-pointer hover:text-red-700 flex items-center"
                      >
                        <Trash2  size={16} /> 
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sessions;

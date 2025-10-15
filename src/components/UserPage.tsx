import React, { useMemo, useState } from "react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import ConfirmDialog from "./ConfirmDialog";
import { TableBody, Table, TableCell, TableHeader, TableRow } from "./ui/table";
import {

  ChevronDown,
  CalendarDays,
  Search,
  UserPlus,
  Upload,
  Pencil,
  Trash2,
  
} from "lucide-react";

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
}> = ({ value, onChange, options, placeholder, className, leftIcon }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className ?? ""}`}>
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {leftIcon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={[
          // ⬇️ pill look + soft gray border (tweak 200–600 for lighter/darker)
          "appearance-none rounded-2xl border border-gray-400 bg-white",
          "px-4 py-2 pr-9 text-sm text-gray-900",
          leftIcon ? "pl-9" : "",
          // subtle interactions to feel like the sample
          // "hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
          // "transition-colors"
        ].join(" ")}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown
        className={`pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
          }`}
      />
    </div>
  );
};


const StatusPill: React.FC<{ value: "Active" | "Inactive" }> = ({ value }) => {
  const isActive = value === "Active";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isActive
          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
          : "bg-red-50 text-red-700 ring-1 ring-red-200",
      ].join(" ")}
    >
      {value}
    </span>
  );
};

// ----- Mock data -----
type UserRow = {
  id: number;
  sl: string;
  process: string;

  name: string;
  employeeId: string;
  role: "New Joiner" | "Agent" | "Admin";
  phone: string;
  status: "Active" | "Inactive";
};

const PROCESSES = [
  "Nagad",
  "Bexcom",
  "SBL",
  "LG",
  "BTCL",
  "UML",
  "Linde",
  "Coca-Cola",
  "CTGWASA",
] as const;

const ROLES: UserRow["role"][] = ["New Joiner", "Agent", "Admin"];

const makeRows = (n = 97): UserRow[] =>
  Array.from({ length: n }, (_, i) => {
    const proc = PROCESSES[i % PROCESSES.length];
    const role = ROLES[i % ROLES.length];
    const active = i % 7 !== 5;
    return {
      id: i + 1,
      sl: (i + 1).toString().padStart(2, "0"),
      process: proc,
      name:
        [
          "Anik Hasan",
          "Sifat Ahmed",
          "Kazi Sakib",
          "Susmoy Biswas",
          "Liton Mia",
          "Mohamad Yeasin",
          "Jahid Hasan",
          "Abir Roy",
          "Rofik Ahmed",
          "Pias Hasan",
        ][i % 10] || `User ${i + 1}`,
      employeeId: (12500 + i).toString(),
      role,
      phone: `+880170000000${i % 10}`,
      status: active ? "Active" : "Inactive",
    };
  });

const ALL_ROWS = makeRows();



// ----- The page proper -----
const UserPage: React.FC = () => {

  const [editUser, setEditUser] = useState<UserRow | null>(null); // Track the selected user for editing
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);//for deleting the user

  // delete er state
  // const [rows, setRows] = useState<UserRow[]>(ALL_ROWS);
  const handleEditUser = (user: UserRow) => {
    setEditUser(user); // Set the user to edit
  };






  // filters
  const [q, setQ] = useState("");
  const [process, setProcess] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [empId, setEmpId] = useState<string>("");
  const [month, setMonth] = useState<string>("January");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addOpen, setAddOpen] = useState(false);
  // derived
  const filtered = useMemo(() => {
    const rx = q.trim().toLowerCase();
    return ALL_ROWS.filter((r) => {
      const matchesQ =
        !rx ||
        r.name.toLowerCase().includes(rx) ||
        r.employeeId.includes(rx) ||
        r.phone.includes(rx) ||
        r.process.toLowerCase().includes(rx);
      const matchesProcess = !process || r.process === process;
      const matchesRole = !role || r.role === role;
      const matchesEmp = !empId || r.employeeId === empId;
      return matchesQ && matchesProcess && matchesRole && matchesEmp;
    });
  }, [q, process, role, empId]);

  // Handle select/deselect individual rows
  const handleSelectRow = (id: number) => {
    const updatedSelectedRows = new Set(selectedRows);
    if (updatedSelectedRows.has(id)) {
      updatedSelectedRows.delete(id);
    } else {
      updatedSelectedRows.add(id); 
    }
    setSelectedRows(updatedSelectedRows);
  };

  // Handle select/deselect all rows
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRowIds = pageRows.map((r) => r.id);
      setSelectedRows(new Set(allRowIds)); // Select all rows
    } else {
      setSelectedRows(new Set()); // Deselect all rows
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="flex min-h-screen text-gray-900">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <Topbar
          title="User"
          userName="Imran Hasan"
          icon={<UserCircle2 />}
          onSettings={() => { }}
          onChangePassword={() => { }}
          onLogout={() => { }}
        /> */}

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Search..."
                className="rounded-xl border border-gray-400 bg-white px-9 py-2 text-sm text-black outline-none placeholder:text-gray-900"

              />
            </div>

            <SelectField
              value={process}
              onChange={(v) => {
                setProcess(v);
                setPage(1);
              }}
              options={["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"]}
              placeholder="Process Name"
              className="min-w-30  "
            />

            <SelectField
              value={empId}
              onChange={(v) => {
                setEmpId(v);
                setPage(1);
              }}
              options={ALL_ROWS.slice(0, 50).map((r) => r.employeeId)}
              placeholder="Employee ID"
              className="min-w-30"
            />

            <SelectField
              value={role}
              onChange={(v) => {
                setRole(v);
                setPage(1);
              }}
              options={["New Joiner", "Agent", "Admin"]}
              placeholder="Role"
              className="min-w-30"
            />

            <SelectField
              value={month}
              onChange={setMonth}
              options={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              className="min-w-30"
              leftIcon={<CalendarDays className="h-4 w-4" />}
            />

            <button
              onClick={() => setAddOpen(true)}
              className="ml-auto inline-flex items-center cursor-pointer gap-2 rounded-xl border border bg-[#5670F7] px-4 py-2 text-sm font-medium text-[#FDFFFF] hover:bg-blue-600"
            >
              <UserPlus className="h-4 w-4 " /> Add User
            </button>


            <button className="ml-auto inline-flex items-center cursor-pointer gap-2 rounded-xl border bg-[#5670F7] px-4 py-2 text-sm font-medium text-[#FDFFFF] hover:bg-blue-600">
              <Upload className="h-4 w-5" /> Upload User
            </button>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-hidden rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Select All Checkbox */}
                  <TableCell>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.size === pageRows.length}
                    />
                  </TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Process Name</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    {/* Individual Checkbox */}
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(r.id)}
                        onChange={() => handleSelectRow(r.id)}
                      />
                    </TableCell>
                    <TableCell>{r.sl}</TableCell>
                    <TableCell>{r.process}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.employeeId}</TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>
                      <StatusPill value={r.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-500 cursor-pointer rounded -2xl border-2 bg-gray-100 hover:text-blue-700"
                          onClick={() => handleEditUser(r)}>

                          <Pencil className="h-4 w-4 " />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer rounded -2xl border-2 bg-gray-100 hover:text-red-700"
                          onClick={() => setDeleteUser(r)}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing {filtered.length === 0 ? 0 : startIdx + 1}-{Math.min(
                startIdx + rowsPerPage,
                filtered.length
              )}{" "}
              of {filtered.length} results
            </div>

            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <SelectField
                value={String(rowsPerPage)}
                onChange={(v) => {
                  const n = Number(v);
                  setRowsPerPage(n);
                  setPage(1);
                }}
                options={["10", "20", "30", "50"]}
                className="min-w-20"
              />

              <button
                className="ml-2 rounded-md border px-2 py-1 hover:bg-gray-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                ‹
              </button>
              <span className="px-1">
                {safePage}/{totalPages}
              </span>
              <button
                className="rounded-md border px-2 py-1 hover:bg-gray-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </main>
      </div>


      {/* confirm delete */}

      <ConfirmDialog
        open={!!deleteUser}
        title="Delete user?"
        message={
          deleteUser
            ? `Are you sure you want to delete “${deleteUser.name}” (ID: ${deleteUser.employeeId})? This action cannot be undone.`
            : undefined
        }

        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteUser) {

          // delete er logic
            // setRows((prev) => prev.filter((r) => r.id !== deleteUser.id));
            console.log("User confirmed delete for:", deleteUser);
            setDeleteUser(null);
          }
        }}
        onClose={() => setDeleteUser(null)}
      />


      <EditUserModal
        open={!!editUser} // Show modal if there is an editUser
        user={editUser} // Pass the selected user to edit
        onClose={() => setEditUser(null)} // Close the modal
        onSubmit={(data) => {
          console.log("update user:", data);
        
        }} // Handle the submit action
      />


      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(data) => {
          console.log("new user:", data);
          // TODO: push to backend or update table state
        }}
      />

    </div>

  );
};

export default UserPage;

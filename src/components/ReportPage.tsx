// ReportPage.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Search, CalendarDays, Trash2, FileDown, ChevronDown } from "lucide-react";

/* ---------- Your tiny SelectField ---------- */
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
    <div className={`relative inline-block ${className ?? ""}`}>
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
          "appearance-none w-full rounded-2xl border border-gray-400 bg-white",
          "px-4 py-2 text-sm text-gray-900",
          leftIcon ? "pl-9" : "",
        ].join(" ")}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${
          open ? "rotate-180" : "rotate-0"
        }`}
      />
    </div>
  );
};

/* ---------- Types & mock ---------- */
type ReportRow = {
  id: number;
  process: string;
  quizTitle: string;
  publisherName: string;
  startDate: string;
  endDate: string;
  role: string;
  appearedDate: string;
  totalQuestions: number;
  rightAnswerCount: number;
  scorePct: number;
  employeeId: string;
  quizId: string;
};

const PROCESSES = ["Nagad","Bexcom","SBL","LG","BTCL","UML","Linde","Coca-Cola","CTGWASA"] as const;
const ROLES = ["Admin","Supervisor","Agent"];

const makeRows = (n = 97): ReportRow[] =>
  Array.from({ length: n }, (_, i) => {
    const proc = PROCESSES[i % PROCESSES.length];
    const total = 25;
    const right = 20;
    return {
      id: i + 1,
      process: proc,
      quizTitle: "Lorem ipsum...",
      publisherName: "Loren ipsum",
      startDate: "10 Sep 24",
      endDate: "10 Sep 24",
      role: ROLES[i % ROLES.length],
      appearedDate: "10 Sep 24",
      totalQuestions: total,
      rightAnswerCount: right,
      scorePct: Math.round((right / total) * 100),
      employeeId: (15000 + (i % 9000)).toString(),
      quizId: (54000 + (i % 8000)).toString(),
    };
  });

const ALL_ROWS = makeRows();

/* ---------- Page ---------- */
export default function ReportPage() {
  const [rows] = useState<ReportRow[]>(ALL_ROWS);

  // filters
  const [q, setQ] = useState("");
  const [process, setProcess] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [month, setMonth] = useState("January");

  // selection (native checkbox)
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    const rx = q.trim().toLowerCase();
    return rows.filter((r) => {
      const s =
        !rx ||
        r.quizTitle.toLowerCase().includes(rx) ||
        r.publisherName.toLowerCase().includes(rx) ||
        r.role.toLowerCase().includes(rx) ||
        r.process.toLowerCase().includes(rx) ||
        r.employeeId.includes(rx) ||
        r.quizId.includes(rx);
      const p = !process || r.process === process;
      const e = !employeeId || r.employeeId.includes(employeeId);
      const qz = !quizId || r.quizId.includes(quizId);
      return s && p && e && qz;
    });
  }, [rows, q, process, employeeId, quizId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);

  // selection helpers
  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pageRows.map((r) => r.id)) : new Set());
  };
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen text-gray-900">
      <div className="flex-1">
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
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
              options={[...PROCESSES] as unknown as string[]}
              placeholder="Process Name"
              className="min-w-36"
            />

            <input
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setPage(1);
              }}
              placeholder="Employee ID"
              className="rounded-2xl border border-gray-400 bg-white px-4 py-2 text-sm text-black outline-none placeholder:text-gray-900 min-w-36"
            />

            <input
              value={quizId}
              onChange={(e) => {
                setQuizId(e.target.value);
                setPage(1);
              }}
              placeholder="Quiz ID"
              className="rounded-2xl border border-gray-400 bg-white px-4 py-2 text-sm text-black outline-none placeholder:text-gray-900 min-w-32"
            />

            <SelectField
              value={month}
              onChange={setMonth}
              options={[
                "January","February","March","April","May","June",
                "July","August","September","October","November","December",
              ]}
              className="min-w-32"
              leftIcon={<CalendarDays className="h-4 w-4" />}
            />

            <button
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border bg-[#5670F7] px-4 py-2 text-sm font-medium text-[#FDFFFF] hover:bg-blue-600 cursor-pointer"
              onClick={() => console.log("export report")}
            >
              <FileDown className="h-4 w-4" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      checked={allOnPage}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Select all rows"
                    />
                  </TableCell>
                  <TableCell className="w-16">SL</TableCell>
                  <TableCell className="min-w-[140px]">Process Name</TableCell>

                  <TableCell className="min-w-[160px]">Quiz Title</TableCell>
                  <TableCell className="min-w-[160px]">Publisher Name</TableCell>
                  <TableCell className="min-w-[120px]">Start Date</TableCell>
                  <TableCell className="min-w-[120px]">End Date</TableCell>
                  <TableCell className="min-w-[100px]">Role</TableCell>
                  <TableCell className="min-w-[140px]">Appaired Date</TableCell>
                  <TableCell className="min-w-[120px]">Total Questions</TableCell>
                  <TableCell className="min-w-[160px]">Right Answer Count</TableCell>
                  <TableCell className="min-w-[90px]">Score</TableCell>
                  <TableCell className="min-w-[80px]">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-gray-50/60">
                    {/* checkbox */}
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Select ${r.id}`}
                      />
                    </TableCell>

                    {/* SL (page-based, 2 digits) */}
                    <TableCell>{String(startIdx + idx + 1).padStart(2, "0")}</TableCell>

                    {/* Process Name */}
                    <TableCell>{r.process}</TableCell>

                    <TableCell className="truncate">{r.quizTitle}</TableCell>
                    <TableCell className="truncate">{r.publisherName}</TableCell>
                    <TableCell>{r.startDate}</TableCell>
                    <TableCell>{r.endDate}</TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell>{r.appearedDate}</TableCell>
                    <TableCell>{r.totalQuestions}</TableCell>
                    <TableCell>{r.rightAnswerCount}</TableCell>
                    <TableCell>{r.scorePct}%</TableCell>
                    <TableCell>
                      <button
                        className="text-red-500 cursor-pointer rounded -2xl border-2 bg-gray-100 hover:text-red-700"
                        aria-label="Delete"
                        onClick={() => {
                          if (confirm(`Delete report row for Quiz ${r.quizId}?`)) {
                            console.log("delete", r.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center text-sm text-gray-500">
                      No report data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing {filtered.length === 0 ? 0 : startIdx + 1}–
              {Math.min(startIdx + rowsPerPage, filtered.length)} of {filtered.length} results
            </div>

            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <SelectField
                value={String(rowsPerPage)}
                onChange={(v) => {
                  const n = Number(v);
                  setRowsPerPage(n);
                  setPage(1);
                  setSelected(new Set());
                }}
                options={["10","20","30","50"]}
                className="min-w-20"
              />

              <button
                className="ml-2 rounded-md border px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setSelected(new Set());
                }}
                disabled={safePage === 1}
              >
                ‹
              </button>
              <span className="px-1">{safePage}/{totalPages}</span>
              <button
                className="rounded-md border px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  setSelected(new Set());
                }}
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


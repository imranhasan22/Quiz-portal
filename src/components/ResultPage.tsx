
"use client";

import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Search, CalendarDays, Eye, Trash2, FileDown, ChevronDown } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

import ViewResultModal, { type QuestionItem, type ResultRowForView } from "./ViewResultModal";
import DownloadResultModal from "./DownloadResultModal";

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
          leftIcon ? "pl-4" : "",
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
        className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
          }`}
      />
    </div>
  );
};

const ResultStatus: React.FC<{ value: "Pass" | "Fail" }> = ({ value }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      value === "Pass" ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-red-200",
    ].join(" ")}
  >
    {value}
  </span>
);

/* ---------- data ---------- */
type Row = {
  id: number;
  sl: string;
  process: string;
  employeeId: string;
  quizId: string;
  quizTitle: string;
  questionTitle: string;
  finishedTime: string;
  status: "Pass" | "Fail";
  result: string;
};

const PROCESSES = ["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"] as const;

const makeRows = (n = 97): Row[] =>
  Array.from({ length: n }, (_, i) => {
    const proc = PROCESSES[i % PROCESSES.length];
    const pass = i % 4 !== 3;
    const score = String((i * 7) % 20).padStart(2, "0");
    return {
      id: i + 1,
      sl: (i + 1).toString().padStart(2, "0"),
      process: proc,
      employeeId: (15000 + (i % 9000)).toString(),
      quizId: (54000 + (i % 8000)).toString(),
      quizTitle: "Lorem ipsum...",
      questionTitle: "Lorem ipsum...",
      finishedTime: "10 Sep, 24 at 10:41 AM",
      status: pass ? "Pass" : "Fail",
      result: `${score}/20`,
    };
  });

const ALL_ROWS = makeRows();

/* ---------- page ---------- */
export default function ResultPage() {
  const [rows] = useState<Row[]>(ALL_ROWS);

  // filters
  const [q, setQ] = useState("");
  const [process, setProcess] = useState("");
  const [empId, setEmpId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("January");


  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<ResultRowForView | null>(null);
  const [viewQuestions, setViewQuestions] = useState<QuestionItem[]>([]);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadRow, setDownloadRow] = useState<any | null>(null);
  // demo generator (replace with API data later)
  function buildQuestions(seed = 0): QuestionItem[] {
    const items: QuestionItem[] = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        id: 3450 + seed * 10 + i,
        title: "Lorem Ipsum is simply dummy text?",
        options: ["A. lorem ipsum", "B. lorem ipsum", "C. lorem ipsum", "D. lorem ipsum"],
        chosenIndex: i % 4,
        correctIndex: (i + 1) % 4,
      });
    }
    return items;
  }

  // delete
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);

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
        r.process.toLowerCase().includes(rx) ||
        r.quizTitle.toLowerCase().includes(rx) ||
        r.questionTitle.toLowerCase().includes(rx) ||
        r.employeeId.includes(rx) ||
        r.quizId.includes(rx);
      const p = !process || r.process === process;
      const e = !empId || r.employeeId.includes(empId);
      const qz = !quizId || r.quizId.includes(quizId);
      const st = !status || r.status.toLowerCase() === status.toLowerCase();
      return s && p && e && qz && st;
    });
  }, [rows, q, process, empId, quizId, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);

  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(pageRows.map((r) => r.id)) : new Set());
  const toggleOne = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className="flex-1">
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
          {/* filters */}
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
              leftIcon={<CalendarDays className="h-4 w-4 opacity-0" />}
            />

            <input
              value={empId}
              onChange={(e) => {
                setEmpId(e.target.value);
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
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={["Pass", "Fail"]}
              placeholder="Result"
              className="min-w-28"
            />

            <SelectField
              value={month}
              onChange={setMonth}
              options={[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ]}
              className="min-w-32"
              leftIcon={<CalendarDays className="h-4 w-4" />}
            />


            <button
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
              onClick={() => console.log("export")}
            >
              <FileDown className="h-4 w-4" /> Export
            </button>
          </div>

          {/* table */}
          <div className="mt-5 overflow-hidden rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      checked={allOnPage}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Select all"
                    />
                  </TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Process Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Quiz ID</TableCell>
                  <TableCell>Quiz Title</TableCell>
                  <TableCell>Question Title</TableCell>
                  <TableCell>Finished Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-gray-50/60">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Select ${r.sl}`}
                      />
                    </TableCell>
                    <TableCell>{r.sl}</TableCell>
                    <TableCell>{r.process}</TableCell>
                    <TableCell>{r.employeeId}</TableCell>
                    <TableCell>{r.quizId}</TableCell>
                    <TableCell className="truncate max-w-[220px]">{r.quizTitle}</TableCell>
                    <TableCell className="truncate max-w-[220px]">{r.questionTitle}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.finishedTime}</TableCell>
                    <TableCell><ResultStatus value={r.status} /></TableCell>
                    <TableCell>{r.result}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          aria-label="View"
                          onClick={() => {
                            setViewRow({
                              employeeId: r.employeeId,
                              process: r.process,
                              status: r.status,
                              result: r.result,
                              quizId: r.quizId,
                              quizTitle: r.quizTitle,
                            });
                            setViewQuestions(buildQuestions(r.id)); // or your API response
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          className="text-gray-600 hover:text-gray-800"
                          aria-label="Download"
                          onClick={() => {
                           
                            setDownloadRow({
                              id: r.id,
                              sl: r.sl,
                              process: r.process,
                              employeeId: r.employeeId,
                              quizId: r.quizId,
                              quizTitle: r.quizTitle,
                              questionTitle: r.questionTitle,
                              finishedTime: r.finishedTime,
                              status: r.status,
                              result: r.result,
                            });
                            setDownloadOpen(true);
                          }}
                        >
                          <FileDown className="h-4 w-4" />
                        </button>

                        <button
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete"
                          onClick={() => setDeleteRow(r)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-sm text-gray-500">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* footer / pagination */}
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
                options={["10", "20", "30", "50"]}
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
              <span className="px-1">
                {safePage}/{totalPages}
              </span>
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



      {/* view */}

      <ViewResultModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        row={viewRow}
        questions={viewQuestions}
      />

     {/* download */}

     <DownloadResultModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        row={downloadRow}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteRow}
        title="Delete result?"
        message={
          deleteRow
            ? `Are you sure you want to delete “${deleteRow.quizTitle}” (Quiz ID: ${deleteRow.quizId})? This action cannot be undone.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("User Confirm delete:", deleteRow);
          setDeleteRow(null);
        }}
        onClose={() => setDeleteRow(null)}
      />
    </div>
  );
}

import React, { useMemo, useState } from "react";
import Topbar from "./Topbar";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import ConfirmDialog from "./ConfirmDialog";
import AddQuestionDialog from "./AddQuestionDialog";
import EditQuestionDialog from "./EditQuestionDialog";
import ViewQuestionDialog from "./ViewQuestionDialog";
import {
  Search,
  CalendarDays,
  Eye,
  Pencil,
  Trash2,
  Upload,
  FileDown,
  Plus,
  ChevronDown,
  CircleQuestionMark
} from "lucide-react";

/* ---------- Shared tiny UI ---------- */
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
          leftIcon ? "pl-9" : "",   // space for left ,righticon

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
        className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
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

/* ---------- Types & mock data ---------- */
type QuestionRow = {
  id: number;
  sl: string;
  process: string;
  questionId: string;
  title: string;
  answerType: string;
  createdBy: string;
  createdTime: string;
  status: "Active" | "Inactive";
};

const PROCESSES = ["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"] as const;
const CREATED_BY = ["Admin", "Editor", "Moderator"];
const ANSWER_TYPES = ["Dropdown", "Multiple", "Short Answer", "Paragraph", "Checkbox", "File upload"];

const makeRows = (n = 97): QuestionRow[] =>
  Array.from({ length: n }, (_, i) => {
    const proc = PROCESSES[i % PROCESSES.length];
    const ans = ANSWER_TYPES[i % ANSWER_TYPES.length];
    const active = i % 6 !== 4;
    return {
      id: i + 1,
      sl: (i + 1).toString().padStart(2, "0"),
      process: proc,
      questionId: (15000 + i).toString(),
      title: "Lorem ipsum dolor sit amet",
      answerType: ans,
      createdBy: CREATED_BY[i % CREATED_BY.length],
      createdTime: "10 Sep, 24 at 10:41 AM",
      status: active ? "Active" : "Inactive",
    };
  });

const ALL_ROWS = makeRows();






/* ---------- Page ---------- */
const QuestionPage: React.FC = () => {
  // data/state
  const [rows] = useState<QuestionRow[]>(ALL_ROWS);
  // filters
  const [q, setQ] = useState("");
  const [process, setProcess] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [month, setMonth] = useState("January");
  // selection
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // dialogs
  const [deleteRow, setDeleteRow] = useState<QuestionRow | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<any | null>(null);
  const [EditOpen, setEditOpen] = useState(false);
  const [EditRow, setEditRow] = useState<any | null>(null);


  // filtered list
  const filtered = useMemo(() => {
    const rx = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ =
        !rx ||
        r.title.toLowerCase().includes(rx) ||
        r.questionId.includes(rx) ||
        r.process.toLowerCase().includes(rx);
      const matchesProcess = !process || r.process === process;
      const matchesCreator = !createdBy || r.createdBy === createdBy;
      return matchesQ && matchesProcess && matchesCreator;
    });
  }, [q, process, createdBy, rows]);

  // pagination math
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);

  // selection handlers
  const handleSelectRow = (id: number) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(pageRows.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className="flex-1">

        {/* topbar call here  */}
        <Topbar
          title="Question"
          userName="Imran Hasan"
          icon={<CircleQuestionMark />}
          onSettings={() => { }}
          onChangePassword={() => { }}
          onLogout={() => { }}
        />
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
              options={PROCESSES as unknown as string[]}
              placeholder="Process Name"
              className="min-w-36"
            />

            <SelectField
              value={createdBy}
              onChange={(v) => {
                setCreatedBy(v);
                setPage(1);
              }}
              options={CREATED_BY}
              placeholder="Created By"
              className="min-w-36"
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
              className="min-w-32"
              leftIcon={<CalendarDays className="h-4 w-4" />}
            />

            <button
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
              onClick={() => setOpenCreate(true)}
            >
              <Plus className="h-4 w-4" /> Question Create
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300">
              <Upload className="h-4 w-4" /> Upload
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300">
              <FileDown className="h-4 w-4" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-hidden rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={pageRows.length > 0 && selectedRows.size === pageRows.length}
                      aria-label="Select all"
                    />
                  </TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Process Name</TableCell>
                  <TableCell>Question ID</TableCell>
                  <TableCell>Question Title</TableCell>
                  <TableCell>Answer Type</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell>Created Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(r.id)}
                        onChange={() => handleSelectRow(r.id)}
                        aria-label={`Select ${r.title}`}
                      />
                    </TableCell>
                    <TableCell>{r.sl}</TableCell>
                    <TableCell>{r.process}</TableCell>
                    <TableCell>{r.questionId}</TableCell>
                    <TableCell className="truncate max-w-[220px]">{r.title}</TableCell>
                    <TableCell>{r.answerType}</TableCell>
                    <TableCell>{r.createdBy}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.createdTime}</TableCell>
                    <TableCell>
                      <StatusPill value={r.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          aria-label="View"
                          onClick={() => {
                            setViewRow({
                              process: r.process,
                              questionId: r.questionId,
                              title: r.title,
                              answerType: r.answerType,
                              question: r.title,          // or your real question field
                              description: "Lorem ipsum dolor...", // if available
                              createdBy: r.createdBy,
                              createdTime: r.createdTime,
                              required: r.status === "Active",     // or your real required flag
                            });
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          className="text-gray-600 hover:text-gray-800"
                          aria-label="View"
                          onClick={() => {
                            setEditRow({
                              process: r.process,
                              questionId: r.questionId,
                              title: r.title,
                              answerType: r.answerType,
                              question: r.title,          // or your real question field
                              description: "Lorem ipsum dolor...", // if available
                              createdBy: r.createdBy,
                              createdTime: r.createdTime,
                              required: r.status === "Active",     // or your real required flag
                            });
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {/* <button className="text-gray-600 hover:text-gray-800" aria-label="Copy link">
                          <Link2 className="h-4 w-4" />
                        </button> */}
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
                    <TableCell colSpan={10} className="text-center text-sm text-gray-500">
                      No questions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing {filtered.length === 0 ? 0 : startIdx + 1}-
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
                  setSelectedRows(new Set());
                }}
                options={["10", "20", "30", "50"]}
                className="min-w-20"
              />

              <button
                className="ml-2 rounded-md border px-2 py-1 hover:bg-gray-50"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setSelectedRows(new Set());
                }}
                disabled={safePage === 1}
              >
                ‹
              </button>
              <span className="px-1">
                {safePage}/{totalPages}
              </span>
              <button
                className="rounded-md border px-2 py-1 hover:bg-gray-50"
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  setSelectedRows(new Set());
                }}
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </main>
      </div>



      {/* add question */}
      <AddQuestionDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(data) => {
          console.log("New question created:", data);
          setOpenCreate(false);
        }}
      />

      {/* view question */}
      <ViewQuestionDialog
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewRow(null); }}
        data={viewRow}
      />


      {/* Edit Question */}
      <EditQuestionDialog
        open={EditOpen}
        onClose={() => { setEditOpen(false); setEditRow(null); }}
        initialData={EditRow}
      />

      {/* Confirm delete (message only, no removal) */}
      <ConfirmDialog
        open={!!deleteRow}
        // reusing the dialog; just show message & close
        title="Delete question?"
        message={
          deleteRow
            ? `Are you sure you want to delete “${deleteRow.title}” (ID: ${deleteRow.questionId})? This action cannot be undone.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("Confirm delete:", deleteRow);
          setDeleteRow(null); // only close
        }}
        onClose={() => setDeleteRow(null)}
      />
    </div>
  );
};

export default QuestionPage;

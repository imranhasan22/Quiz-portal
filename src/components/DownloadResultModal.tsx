"use client";

import React, { useRef } from "react";

export type ResultRowForDownload = {
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

type Props = {
  open: boolean;
  onClose: () => void;
  row: ResultRowForDownload | null;
};

const DownloadResultModal: React.FC<Props> = ({ open, onClose, row }) => {
  const printRef = useRef<HTMLDivElement>(null);
  if (!open || !row) return null;

  const handlePrint = () => {
   

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return;
   
     w.document.title = `Result Row #${row.id}`;
     w.document.body.innerHTML = printRef.current?.innerHTML ?? "";
    const link = document.createElement("link");
    w.document.head.appendChild(link);
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page { margin: 16mm; }
      }
    `;
    w.document.head.appendChild(style);
    w.focus();
    w.print();
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(row, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result-row-${row.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[50]">

      <div className="absolute inset-0 bg-black/40"  />

      {/* Dialog */}
      <div
       className="
    absolute left-1/2 top-1/2
    w-[min(700,80vw)]
    max-h-[75vh]      
    -translate-x-1/2 -translate-y-1/2
    rounded-xl bg-white shadow-2xl
    flex flex-col        /* header/body/footer vertical stacking */
  "
  onClick={(e) => e.stopPropagation()}
      >
      
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">Result Details</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body (print area) */}
        <div className="max-h-[78vh] overflow-y-auto px-5 py-5">
          <div ref={printRef}>
            {/* Header block */}
            <div className="mb-5 rounded-2xl border bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="text-sm font-semibold">{row.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Process</p>
                  <p className="text-sm font-semibold">{row.process}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      row.status === "Pass"
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : "bg-red-50 text-red-700 ring-1 ring-red-200",
                    ].join(" ")}
                  >
                    {row.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Result</p>
                  <p className="text-sm font-semibold">{row.result}</p>
                </div>
              </div>
            </div>

            {/* Form style details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="SL" value={row.sl} />
              <Field label="Row ID" value={String(row.id)} />
              <Field label="Quiz ID" value={row.quizId} />
              <Field label="Employee ID" value={row.employeeId} />
              <Field label="Process Name" value={row.process} className="sm:col-span-2" />
              <Field label="Quiz Title" value={row.quizTitle} className="sm:col-span-2" />
              <Field label="Question Title" value={row.questionTitle} className="sm:col-span-2" />
              <Field label="Finished Time" value={row.finishedTime} className="sm:col-span-2" />
              <Field label="Status" value={row.status} />
              <Field label="Result" value={row.result} />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 border-t px-5 py-3">
          <span className="text-xs text-gray-500">Ready to download or print this row as a form.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="rounded-xl bg-gray-400 border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Download JSON
            </button>
            <button
              onClick={handlePrint}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Download PDF/ Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadResultModal;


const Field: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className={`rounded-xl border p-3 ${className ?? ""}`}>
    <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

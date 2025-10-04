
"use client";


import React from "react";

export type ResultRowForView = {
  employeeId: string;
  process: string;
  status: "Pass" | "Fail";
  result: string;
  quizId: string;
  quizTitle: string;
};

export type QuestionItem = {
  id: number;
  title: string;
  options: string[];    
  chosenIndex: number;
  correctIndex: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  row: ResultRowForView | null;
  questions: QuestionItem[];
};


const parseOption = (opt: string) => {
  const m = opt.trim().match(/^([A-D])\.\s*(.*)$/i);
  return m ? { letter: m[1].toUpperCase(), text: m[2] } : { letter: "", text: opt };
};

const ViewResultModal: React.FC<Props> = ({ open, onClose, row, questions }) => {
  if (!open || !row) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* backdrop (click to close) */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      
      />

      {/* dialog */}
      <div
        className="absolute left-1/2 top-1/2 w-[min(600px,70vw)] max-h-[75vh] flex flex-col -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
      
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">Result</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="max-h-[78vh] overflow-y-auto px-5 py-4">
          {/* summary from the clicked row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <SummaryCard label="Employee ID" value={row.employeeId} />
            <SummaryCard label="Process Name" value={row.process} />
            <div className="rounded-xl border bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={[
                  "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  row.status === "Pass"
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-red-50 text-red-700 ring-1 ring-red-200",
                ].join(" ")}
              >
                {row.status}
              </span>
            </div>
            <SummaryCard label="Result" value={row.result} />
            <SummaryCard label="Quiz ID" value={row.quizId} className="md:col-span-2" />
            <SummaryCard label="Quiz Title" value={row.quizTitle} className="md:col-span-2" />
          </div>

          <div className="my-4 h-px w-full bg-gray-200" />

          {/* questions */}
          <div className="space-y-6">
            {questions.map((q, i) => (
              <QuestionBlock key={q.id} index={i} q={q} />
            ))}
          </div>
        </div>

        {/* footer (empty for now) */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3" />
      </div>
    </div>
  );
};

export default ViewResultModal;

/* ---------- tiny sub-components ---------- */
const SummaryCard: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className={`rounded-xl border bg-gray-50 p-3 ${className ?? ""}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const QuestionBlock: React.FC<{ index: number; q: QuestionItem }> = ({ index, q }) => {
  const { id, title, options, chosenIndex, correctIndex } = q;
  const correct = parseOption(options[correctIndex]);

  return (
    <div className="rounded-xl border p-4">
      <p className="mb-1 text-sm font-semibold">
        {index + 1}. Question ID- <span className="font-normal text-gray-500">{id}</span>
      </p>
      <p className="mb-3 text-sm text-gray-800">{title}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isChosen = idx === chosenIndex;
          const isCorrect = idx === correctIndex;
          return (
            <label
              key={idx}
              className={[
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                isCorrect ? "border-green-300 bg-green-50" : "border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              <input
                type="radio"
                name={`q-${id}`}
                checked={isChosen}
                readOnly
                className="h-4 w-4 accent-gray-700"
              />
              <span className={isCorrect ? "font-medium text-green-700" : ""}>{opt}</span>
            </label>
          );
        })}
      </div>

      {/* Correct Answer: show as "C lorem ipsum" */}
      <p className="mt-3 text-sm">
        <span className="text-gray-500">Correct Answer: </span>
        <span className="font-medium text-green-700">
          {correct.letter ? `${correct.letter} ${correct.text}` : correct.text}
        </span>
      </p>
    </div>
  );
};

// import { useEffect, useState } from "react";
// import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";

// const PROCESS_OPTIONS = ["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"];
// const ANSWER_TYPES = ["Multiple", "Dropdown", "Short Answer", "Paragraph", "Checkbox", "File Upload"];

export type QuestionData = {
  process: string;
  questionId: string;
  title: string;
  answerType: string;
  question: string;
  description?: string;
  createdBy: string;
  createdTime: string;
  required?: boolean;
};

export default function ViewQuestionDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: QuestionData | null;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal Panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <form className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">View Question</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="space-y-5 px-6 py-5">
            {/* Row 1: Process + Question ID */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Select Process (read-only look) */}
              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Select Process
                </label>
                <div className="relative">
                  <select
                    value={data.process}
                    disabled
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
                  >
                    <option>{data.process}</option>
                  </select>
                  
                </div>
              </div>

              {/* Question ID */}
              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Question ID
                </label>
                <input
                  value={data.questionId}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Row 2: Title + Answer Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Question Title
                </label>
                <input
                  value={data.title}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                  placeholder="Lorem ipsum dolor..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Answer Type
                </label>
                <input
                  value={data.answerType}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Question (single line in mock) */}
            <div>
              <label className="mb-2 block text-sm text-gray-700">Question</label>
              <input
                value={data.question}
                disabled
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                placeholder="Lorem ipsum dolor..."
              />
            </div>

            {/* Description (multiline) */}
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Description
              </label>
              <textarea
                value={data.description || ""}
                disabled
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                placeholder="Lorem ipsum dolor..."
              />
            </div>

            {/* Row 3: Created By + Created Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Created By
                </label>
                <input
                  value={data.createdBy}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700">
                  Created Time
                </label>
                <input
                  value={data.createdTime}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Required (disabled switch look) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Required</span>
              <label className="relative inline-flex cursor-not-allowed items-center">
                <input
                  type="checkbox"
                  checked={!!data.required}
                  readOnly
                  className="peer sr-only"
                />
                <span className="h-5 w-9 rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-gray-700" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </label>
            </div>
          </div>

          {/* Footer spacing to match mock */}
          <div className="px-6 pb-5" />
        </form>
      </div>
    </div>
  );
}
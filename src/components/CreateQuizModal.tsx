// src/pages/CreateQuizModal.tsx
import React, { useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, XCircle, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

// Types (move to shared types if you want)
type QuestionLite = { questionId: string; title: string; answerType: string };
type CreateQuizPayload = { processName: string; quizTitle: string; items: QuestionLite[] };

// Demo data (replace with API)
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
];
const ALL_QUESTIONS: QuestionLite[] = Array.from({ length: 12 }, (_, i) => ({
  questionId: String(1000 + i),
  title: `Sample Question ${i + 1}`,
  answerType: i % 2 ? "Multiple" : "Dropdown",
}));

const CreateQuizModal: React.FC = () => {
  // form state
  const [processName, setProcessName] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questionKey, setQuestionKey] = useState("");
  const [items, setItems] = useState<QuestionLite[]>([]);

  // inline (non-popup) feedback
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // popups
  const [showFailure, setShowFailure] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const options = useMemo(
    () =>
      ALL_QUESTIONS.map((q) => ({
        value: q.questionId,
        label: `${q.questionId} — ${q.title}`,
      })),
    []
  );

  // reset all fields/messages
  const resetForm = () => {
    setProcessName("");
    setQuizTitle("");
    setQuestionKey("");
    setItems([]);
    setError(null);
    setOk(null);
  };

  const addItem = () => {
    setOk(null);
    setError(null);
    if (!questionKey) return;

    const src = ALL_QUESTIONS.find((q) => q.questionId === questionKey);
    if (!src) return;

    if (items.some((i) => i.questionId === src.questionId)) {
      // already added
      setOk("Please choose a unique question.");
      return;
    }
    setItems((prev) => [...prev, src]);
    setQuestionKey("");
  };

  const removeItem = (qid: string) => {
    setOk(null);
    setError(null);
    setItems((prev) => prev.filter((i) => i.questionId !== qid));
  };

  const handleSaveClick = () => {
    setOk(null);
    setError(null);

    const invalid = !processName || !quizTitle.trim() || items.length === 0;
    if (invalid) {
      setError(
        "Please select a process, enter a quiz title, and add at least one question."
      );
      setShowFailure(true);
      return;
    }

    const payload: CreateQuizPayload = { processName, quizTitle, items };
    // TODO: call create API
    console.log("Create quiz payload:", payload);

    setOk("Quiz created successfully.");
    setShowSuccess(true);
  };

  return (
    <>
      <div className="w-full px-4 py-6 md:px-6">
        {/* inline banners (non-modal) */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {ok}
          </div>
        )}

        <div className="w-full border bg-white">
          {/* content */}
          <div className="space-y-6 px-6 py-6">
            {/* Process + Quiz Title */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Process Name
                </label>
                <div className="relative">
                  <select
                    value={processName}
                    onChange={(e) => setProcessName(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="" disabled>
                      Select Process
                    </option>
                    {PROCESSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Quiz Title
                </label>
                <input
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Enter Quiz Title"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>

            {/* Question selector + Add */}
            <div>
              <label className="mb-1 block text-sm text-gray-700">Question</label>
              <div className="flex items-center gap-3">
                <div className="relative grow">
                  <select
                    value={questionKey}
                    onChange={(e) => setQuestionKey(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="">Add Question</option>
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={!questionKey}
                  className="flex items-center gap-2 rounded-lg bg-[#1447E6] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                >
                  Add <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border">
              <Table className="w-full text-left text-sm">
                <TableHeader className="bg-gray-50 text-gray-700">
                  <TableRow>
                    <TableHead className="px-4 py-2">SL</TableHead>
                    <TableHead className="px-4 py-2">Question ID</TableHead>
                    <TableHead className="px-4 py-2">Question Title</TableHead>
                    <TableHead className="px-4 py-2">Answer Type</TableHead>
                    <TableHead className="px-4 py-2 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No question added
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((it, idx) => (
                      <TableRow key={it.questionId} className="border-t">
                        <TableCell className="px-4 py-2">
                          {String(idx + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="px-4 py-2">{it.questionId}</TableCell>
                        <TableCell className="px-4 py-2 max-w-[420px] truncate">
                          {it.title}
                        </TableCell>
                        <TableCell className="px-4 py-2">{it.answerType}</TableCell>
                        <TableCell className="px-4 py-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeItem(it.questionId)}
                              className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-5">
            <button
              type="button"
              onClick={handleSaveClick}
              className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Failure popup */}
      {showFailure && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          {/* Failure card */}
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              ❌ Failed to create <br /> new Quiz.
            </p>
            <button
              onClick={() => setShowFailure(false)} // keep form so user can fix
              className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              🎉 Successfully created <br /> new Quiz.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                resetForm(); // clear fields after success
              }}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateQuizModal;

import React, { useMemo, useEffect, useState } from "react";
import { X, Plus, Trash2, ChevronDown, XCircle, CheckCircle2 } from "lucide-react";
import {
  TableBody,
  Table,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "./ui/table";

// Types
export type QuestionLite = {
  questionId: string;
  title: string;
  answerType: string;
};

export type CreateQuizPayload = {
  processName: string;
  quizTitle: string;
  items: QuestionLite[];
};

export type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateQuizPayload) => void;
  processes: string[];
  allQuestions: QuestionLite[];
};

const CreateQuizModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  processes,
  allQuestions,
}) => {
  const [processName, setProcessName] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questionKey, setQuestionKey] = useState(""); // selected questionId
  const [items, setItems] = useState<QuestionLite[]>([]);


  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);


  // Reset when opened
  useEffect(() => {
    if (open) {
      setProcessName("");
      setQuizTitle("");
      setQuestionKey("");
      setItems([]);

      setShowSuccess(false);
      setShowFailure(false);

    }
  }, [open]);

  const options = useMemo(
    () =>
      allQuestions.map((q) => ({
        value: q.questionId,
        label: `${q.questionId} — ${q.title}`,
      })),
    [allQuestions]
  );

  const addItem = () => {
    if (!questionKey) return;
    const src = allQuestions.find((q) => q.questionId === questionKey);
    if (!src) return;
    if (items.some((i) => i.questionId === src.questionId)) return; // prevent duplicates
    setItems((prev) => [...prev, src]);
    setQuestionKey("");
  };

  const removeItem = (qid: string) => {
    setItems((prev) => prev.filter((i) => i.questionId !== qid));
  };

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!processName || !quizTitle.trim() || items.length === 0) {

      setShowFailure(true);
      return;
    }

    onSave({
      processName,
      quizTitle,
      items,

    });
    setShowSuccess(true);

  };

  if (!open && !showSuccess && !showFailure) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
   
    >
      {/* Modal */}
      <div
        className="relative z-10 w-[700px] max-w-[92vw] rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 id="create-quiz-title" className="text-lg font-semibold">
            New Quiz Creation
          </h2>
          <button
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            {/* Row: Process + Quiz Title */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    {processes.map((p) => (
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

            {/* Row: Question selector + Add */}
            <div>
              <label className="mb-1 block text-sm text-gray-700">Question</label>
              <div className="flex items-center gap-2">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                  onClick={addItem}
                  disabled={!questionKey}
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
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        className="px-4 py-6 text-center text-gray-500"
                        colSpan={5}
                      >
                        No question added
                      </TableCell>
                    </TableRow>
                  )}

                  {items.map((it, idx) => (
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
                            className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => removeItem(it.questionId)}
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-gray-800 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"

            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Failure popup */}
      {showFailure && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

          {/* Failure card */}
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            {/* icon */}
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* text */}
            <p className="mb-2 text-center text-lg font-semibold text-gray-800">
              ❌ Failed to create <br/> new Quiz.
            </p>

            {/* button */}
            <button
              onClick={() => {
                setShowFailure(false);
                onClose();
              }}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
            {/* Icon */}
            <div className="mb-4 flex items-center justify-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            {/* Text */}
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              🎉 Successfully created <br/> new Quiz.
            </p>
            {/* Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizModal;

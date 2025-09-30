// components/EditQuizModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, ChevronDown } from "lucide-react";

const PROCESS_OPTIONS = ["Nagad","Bexcom","SBL","LG","BTCL","UML","Linde","Coca-Cola","CTGWASA"];
const ANSWER_TYPES = ["Multiple","Dropdown","Short Answer","Paragraph","Checkbox","File Upload"];

export type EditQuizData = {
  process: string;
  quizId: string;       // read-only in UI
  quizTitle: string;
  answerType: string;
  createdBy: string;
  createdTime: string;
};

export default function EditQuizModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialData: EditQuizData | null;
  onSave: (data: EditQuizData) => void;
}) {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<EditQuizData>({
    defaultValues: {
      process: "",
      quizId: "",
      quizTitle: "",
      answerType: ANSWER_TYPES[0],
      createdBy: "",
      createdTime: "",
    },
  });

  useEffect(() => {
    if (open && initialData) reset(initialData);
  }, [open, initialData, reset]);

  if (!open || !initialData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* dialog */}
      <div
        className="relative z-10 w-[880px] max-w-[94vw] rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">View Quiz</h2>
          <button
            type="button"
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit((data) => onSave(data))}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Process Name */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Process Name</label>
            <div className="relative">
              <select
                {...register("process", { required: true })}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
              >
                {PROCESS_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Quiz ID (read-only) */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Quiz ID</label>
            <input
              {...register("quizId")}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900"
            />
          </div>

          {/* Quiz Title */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Quiz Title</label>
            <input
              {...register("quizTitle", { required: true })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Answer Type */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Answer Type</label>
            <div className="relative">
              <select
                {...register("answerType", { required: true })}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
              >
                {ANSWER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Created by */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Created by</label>
            <input
              {...register("createdBy", { required: true })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none"
            />
          </div>

          {/* Created Time */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">Created Time</label>
            <input
              {...register("createdTime", { required: true })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none"
              placeholder="10 Sep, 24 at 10:41 AM"
            />
          </div>

          {/* footer (full width) */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-gray-800 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
              disabled={!isDirty}
              title={!isDirty ? "Change something to enable Edit" : undefined}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

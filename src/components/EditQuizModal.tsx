
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, ChevronDown, XCircle, CheckCircle2 } from "lucide-react";

const PROCESS_OPTIONS = [
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
const ANSWER_TYPES = [
  "Multiple",
  "Dropdown",
  "Short Answer",
  "Paragraph",
  "Checkbox",
  "File Upload",
];

export type EditQuizData = {
  process: string;
  quizId: string;
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
  onSave: (data: EditQuizData) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<EditQuizData>({
    defaultValues: {
      process: "",
      quizId: "",
      quizTitle: "",
      answerType: ANSWER_TYPES[0],
      createdBy: "",
      createdTime: "",
    },
  });

  // Popup states (mirrors CreateQuizModal behavior)
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
      setShowSuccess(false);
      setShowFailure(false);
    }
  }, [open, initialData, reset]);

  // Keep the wrapper mounted while a popup is showing
  if (!open && !showSuccess && !showFailure) return null;

  const submit = handleSubmit((data) => {

    if (!data.process || !data.quizTitle.trim() || !data.quizId.trim()) {
      setShowFailure(true);
      return;
    }
    onSave(data);
    setShowSuccess(true);

  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">


      {/* dialog (only when editing) */}
      {open && initialData && (
        <div
          className="relative z-10 w-[880px] max-w-[94vw] rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Quiz</h2>
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
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Process Name */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">Process Name</label>
              <div className="relative">
                <select
                  {...register("process", { required: true })}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
                >
                  {PROCESS_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
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

                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
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
                    <option key={t} value={t}>
                      {t}
                    </option>
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


                className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white shadow-md transition duration-200
                ${!isDirty ? "bg-blue-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer hover:shadow-lg"}`}

                disabled={!isDirty}
                title={!isDirty ? "Change something to enable Edit" : undefined}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

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
            <p className="mb-6 text-center text-lg font-semibold text-gray-800">
              ❌ Failed to edit <br /> Quiz.
            </p>

            {/* button */}
            <button
              onClick={() => {
                setShowFailure(false);
                onClose();
              }}
              className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-medium cursor-pointer text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success pop-up */}
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
              🎉 Successfully edited <br /> Quiz!
            </p>
            {/* Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

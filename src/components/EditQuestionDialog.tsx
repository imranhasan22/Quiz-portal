import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";

const PROCESS_OPTIONS = ["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"];
const ANSWER_TYPES = ["Multiple", "Dropdown", "Short Answer", "Paragraph", "Checkbox", "File Upload"];

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

export default function EditQuestionDialog({
  open,
  onClose,
  initialData,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: QuestionData) => void;
  initialData: QuestionData | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionData>({
    defaultValues: {
      process: "",
      questionId: "",
      title: "",
      answerType: ANSWER_TYPES[0],
      question: "",
      description: "",
      createdBy: "",
      createdTime: "",
      required: false,
    },
  });

  // Popups state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // যখন modal খোলে তখন initial data reset করো
  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    }
  }, [open, initialData, reset]);

  if (!open || !initialData) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <form
          onSubmit={handleSubmit((data) => {
            if (!data.process || !data.question || !data.questionId) {
              setShowFailure(true);
              return;
            }
            onSubmit?.(data);
            setShowSuccess(true);
          })}
          className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Edit Question</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 px-6 py-5">
            {/* Row 1 */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Select Process */}
              <div>
                <label className="mb-2 block text-sm text-gray-700">Select Process</label>
                <div className="relative">
                  <select
                    {...register("process")}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
                  >
                    <option value="" disabled>
                      Select Process
                    </option>
                    {PROCESS_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                {errors.process && <p className="text-red-500 text-sm">{errors.process.message}</p>}
              </div>

              {/* Question ID */}
              <div>
                <label className="mb-2 block text-sm text-gray-700">Question ID</label>
                <input
                  {...register("questionId")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none"
                />
                {errors.questionId && <p className="text-red-500 text-sm">{errors.questionId.message}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-700">Question Title</label>
                <input
                  {...register("title")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>

              {/* Answer Type */}
              <div>
                <label className="mb-2 block text-sm text-gray-700">Answer Type</label>
                <div className="relative">
                  <select
                    {...register("answerType")}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
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
            </div>

            {/* Question */}
            <div>
              <label className="mb-2 block text-sm text-gray-700">Question</label>
              <input
                {...register("question")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none"
              />
              {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm text-gray-700">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none"
              />
            </div>

            {/* Row 3 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-700">Created By</label>
                <input
                  {...register("createdBy")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700">Created Time</label>
                <input
                  {...register("createdTime")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Required */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Required</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("required")} className="peer sr-only" />
                <span className="h-5 w-9 rounded-full border border-gray-300 bg-gray-300 transition-colors peer-checked:bg-gray-700" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Success popup */}
        {showSuccess && (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-s animate-fadeIn" />
            <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              {/* Text */}
              <p className="mb-6 text-center text-lg font-semibold text-gray-800">
                🎉 Successfully edited <br /> Question!
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

        {/* Failure popup */}
        {showFailure && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-s animate-fadeIn" />
            <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              {/* Text */}
              <p className="mb-6 text-center text-lg font-semibold text-gray-800">
                ❌ Failed to edit <br /> Question.
              </p>
              {/* Button */}
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
      </div>
    </div>
  );
}

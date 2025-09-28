import React, { useEffect, useState } from "react";
import { ChevronDown, Trash2, FileImage, Copy, MoreVertical, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    processName: string;
    questionTitle: string;
    questionText: string;
    answerType: string;
    options: string[];
    required: boolean;
  }) => void;
};

const AddQuestionDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  // ---- state ----
  const [processName, setProcessName] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerType, setAnswerType] = useState("Multiple Choice");
  const [options, setOptions] = useState<string[]>(["Option 1"]);
  const [required, setRequired] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  // State for success and failure
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // ---- reset helper ----
  const resetForm = () => {
    setProcessName("");
    setQuestionTitle("");
    setQuestionText("");
    setAnswerType("Multiple Choice");
    setOptions(["Option 1"]);
    setRequired(false);
    setOpenSelect(false);
  };

  // ডায়ালগ খোলার সাথে সাথে একবার রিসেট করো
  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  if (!open && !showSuccess && !showFailure) return null;

  const addOption = () => setOptions((o) => [...o, `Option ${o.length + 1}`]);
  const removeOption = (idx: number) => setOptions((o) => o.filter((_, i) => i !== idx));

  // close handler: আগে ফর্ম রিসেট, তারপর parent onClose
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // submit handler: সাবমিট ডাটা পাঠাও
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // validation
    if (!processName.trim() || !questionTitle.trim() || !questionText.trim()) {
      setShowFailure(true);
      return;
    }

    onSubmit({
      processName,
      questionTitle,
      questionText,
      answerType,
      options,
      required,
    });

    setShowSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      {/* modal panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Add New Question</h2>
            <button
              onClick={handleClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Process + Title */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">Process Name</label>
                <input
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  placeholder="Enter Process Name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">Question Title</label>
                <input
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Enter Question Title"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">Question</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter Question"
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
              />
            </div>

            {/* Answer Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">Answer Type</label>
              <div className="relative">
                <select
                  value={answerType}
                  onChange={(e) => setAnswerType(e.target.value)}
                  onFocus={() => setOpenSelect(true)}
                  onBlur={() => setOpenSelect(false)}
                  className="appearance-none w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 outline-none"
                >
                  {["Multiple Choice", "Dropdown", "Short Answer", "Paragraph", "Checkbox", "File upload"].map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-current transition-transform  ${openSelect ? "rotate-180" : "rotate-0"
                    }`}
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
                  <input
                    value={opt}
                    onChange={(e) => setOptions((o) => o.map((v, i) => (i === idx ? e.target.value : v)))}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button type="button" title="Attach image" className="rounded p-1 hover:bg-gray-100">
                    <FileImage className="h-4 w-4 text-gray-500" />
                  </button>
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      title="Remove"
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                type="button"
                className="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                + Add option
              </button>
            </div>

            {/* Bottom controls */}
            <div className="mt-5 flex items-center justify-between border-t pt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {/* Copy */}
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(
                        {
                          processName,
                          questionTitle,
                          questionText,
                          answerType,
                          options,
                          required,
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="rounded p-1 hover:bg-gray-100"
                  title="Copy"
                  aria-label="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  className="rounded p-1 text-red-500 hover:bg-gray-100"
                  title="Delete"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Divider */}
                <span className="mx-2 h-5 w-px bg-gray-300" />

                {/* Required */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Required</span>

                  <label className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="peer sr-only"
                      role="switch"
                      aria-checked={required}
                    />
                    <span className="h-5 w-9 rounded-full border border-gray-300 bg-gray-200 transition-colors peer-checked:bg-gray-700" />
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="rounded p-1 hover:bg-gray-100"
                title="More options"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Submit */}
            <button
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-200"
              type="submit" // Use form submit
            >
              Submit
            </button>
          </form>
        </div>

        {/* Failure popup */}
        {showFailure && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-s animate-fadeIn" />

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
                ❌ Failed to create <br /> new Question.
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

        {/* show success popup */}
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
                🎉 Successfully created <br /> new Question.
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
    </div>
  );
};

export default AddQuestionDialog;

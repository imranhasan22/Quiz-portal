import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Circle, CheckCircle2, CheckCircle, XCircle } from "lucide-react";

/** mock questions — replace with API */
type Question = { id: number; text: string; options: string[] };
const ALL_QUESTIONS: Question[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  text:
    i === 0
      ? "What is the primary purpose of a call center?"
      : i === 1
      ? "What is the difference between an inbound and an outbound call center?"
      : "Which of the following technologies is commonly used in call centers?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
}));

const TakeQuizPage: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const totalSeconds = 4 * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [answers, setAnswers] = useState<Record<number, number | undefined>>({});

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const currentTitle = useMemo(
    () => (quizId ? `Nagad Quiz ${quizId}` : "Nagad Quiz"),
    [quizId]
  );

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== undefined).length,
    [answers]
  );

  const handlePick = (qid: number, optIndex: number) =>
    setAnswers((prev) => ({ ...prev, [qid]: optIndex }));

  const handleClear = (qid: number) =>
    setAnswers((prev) => ({ ...prev, [qid]: undefined }));

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setShowConfirm(true);
  };

  const handleSubmitConfirmed = () => {
    setShowConfirm(false);

    const rows = ALL_QUESTIONS.map((q) => {
      const idx = answers[q.id];
      return {
        QID: q.id,
        Question: q.text,
        SelectedIndex: idx ?? null,
        SelectedText: idx !== undefined ? q.options[idx] : null,
        Answered: idx !== undefined,
      };
    });

    console.groupCollapsed(`📋 Quiz Submitted: ${currentTitle}`);
    console.log("Quiz ID:", quizId ?? "(n/a)");
    console.log("Answered:", answeredCount, "/", ALL_QUESTIONS.length);
    console.table(rows);
    console.groupEnd();

    setShowSuccess(true);
  };

  const handleCancel = () => setShowFailure(true);

  const Modal: React.FC<{ onClose?: () => void; children: React.ReactNode }> = ({
    onClose,
    children,
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6">
     
    <div className="fixed right-11 top-3/4 text-sm text-gray-700 z-50">
  <span>
    Remaining Time : <span className=" text-lg font-semibold">{mm} min {ss} sec</span>
  </span>
</div>


      {/* Header card */}
      <div className="rounded-xl border bg-white shadow-sm px-6 py-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
        <div className="text-xs">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
            Total Score <span className="ml-1 inline-flex h-6 min-w-12 items-center justify-center rounded-md bg-gray-800 px-2 text-white">0/20</span>
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: Questions */}
        <form
          id="quiz-form" 
          noValidate
          onSubmit={handleFormSubmit} 
          className="space-y-6"
        >
          {ALL_QUESTIONS.map((q, idx) => (
            <div key={q.id} data-q={q.id} className="rounded-xl border bg-white shadow-sm p-6">
              <div className="flex items-start justify-between">
                <p className="text-lg font-medium text-gray-900">
                  {idx + 1}. {q.text}
                </p>
                <button
                  type="button" 
                  className="text-sm text-gray-500 hover:text-gray-800"
                  onClick={() => handleClear(q.id)}
                >
                  Clear selection
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i;
                  return (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="sr-only"
                        checked={selected}
                        onChange={() => handlePick(q.id, i)}
                      />
                      {selected ? (
                        <CheckCircle2 className="h-5 w-5 text-gray-900" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button" 
              className="rounded-xl border bg-[#E0E7FE] text-[#7586EC] font-medium cursor-pointer px-4 py-2  hover:bg-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit" 
              className="rounded-xl bg-[#5670F7] cursor-pointer px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Right: Navigator */}
        <aside className="rounded-xl sticky top-16 border bg-white shadow-sm p-4 h-fit">
          <div className="grid grid-cols-5 gap-2">
            {ALL_QUESTIONS.map((q) => {
              const answered = answers[q.id] !== undefined;
              
              return (
                <button
                  key={q.id}
                  className={`h-10 rounded-lg border text-sm ${
                    answered
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-green-600 border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    const el = document.querySelector(`[data-q="${q.id}"]`) as HTMLElement;
                    if (el) {
                      window.scrollTo({
                        top: el.offsetTop - 100, 
                        behavior: "smooth", 
                      });
                    }
                  }}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">
            Answered {answeredCount} / {ALL_QUESTIONS.length}
          </p>
        </aside>
      </div>

      {/* Modals for Success, Failure, and Confirm */}
      {/* Confirm Modal */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <h2 className="text-center text-xl font-semibold text-gray-900">You Have Answered</h2>
          <p className="mt-1 text-center text-2xl font-bold text-gray-900">
            {answeredCount} Out of {ALL_QUESTIONS.length}
          </p>
          <p className="mt-4 text-center text-gray-600">Are you sure you want to submit?</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              className="rounded-xl  cursor-pointer border bg-gray-200 px-6 py-2 text-gray-700 "
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
            <button
              className="rounded-xl bg-green-600 cursor-pointer px-6 py-2 font-medium text-white"
              onClick={handleSubmitConfirmed}
            >
              Yes
            </button>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <Modal>
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
                🎉 Successfully submitted the quiz!
              </p>
              {/* Button */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/userquiz");
                }}
                className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium cursor-pointer text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Failure Modal */}
      {showFailure && (
        <Modal onClose={() => setShowFailure(false)}>
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
            {/* Failure Card */}
            <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 shadow-inner">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              {/* Text */}
              <p className="mb-6 text-center text-lg font-semibold text-gray-800">
                Submission cancelled ❌
              </p>
              <p className="mt-1 text-center text-gray-600">Your answers were not submitted.</p>
              {/* Button */}
              <button
                onClick={() => setShowFailure(false)}
                className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm cursor-pointer font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TakeQuizPage;

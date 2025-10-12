
import React, { useMemo } from "react";
import { Circle, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";

type Question = { id: number; text: string; options: string[] };

const ALL_QUESTIONS: Question[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  text:
    i === 0
      ? "What is the primary purpose of a call center?"
      : i === 1
      ? "What is the difference between an inbound and an outbound call center?"
      : "Which of the following technologies is commonly used in call centers?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
}));

const ANSWERS: Record<number, number | undefined> = {
  1: 0,
  2: 2,
  4: 1,
};

const QuizDetails: React.FC = () => {
  const totalQuestions = ALL_QUESTIONS.length;

  const answeredCount = useMemo(
    () => Object.values(ANSWERS).filter((v) => v !== undefined).length,
    []
  );


    const { quizId } = useParams();
    const currentTitle = useMemo(
      () => (quizId ? `Nagad Quiz ${quizId}` : "Nagad Quiz"),
      [quizId]
    );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-xl border bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
        <div className="text-xs">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
            Total Answered{" "}
            <span className="ml-1 inline-flex h-6 min-w-12 items-center justify-center rounded-md bg-gray-800 px-2 text-white">
              {answeredCount}/{totalQuestions}
            </span>
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: Questions */}
        <div className="space-y-6">
          {ALL_QUESTIONS.map((q, idx) => {
            const selectedIndex = ANSWERS[q.id];
            return (
              <div key={q.id} className="rounded-xl border bg-white shadow-sm p-6">
                <p className="text-lg font-medium mb-4">
                  {idx + 1}. {q.text}
                </p>

                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const selected = selectedIndex === i;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                          selected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-gray-50 border-transparent"
                        }`}
                      >
                        {selected ? (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={selected ? "font-semibold text-gray-900" : "text-gray-800"}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Navigator */}
        <aside className="rounded-xl sticky top-16 border bg-white shadow-sm p-4 h-fit">
          <div className="grid grid-cols-5 gap-2">
            {ALL_QUESTIONS.map((q) => {
              const answered = ANSWERS[q.id] !== undefined;
              return (
                <div
                  key={q.id}
                  className={`h-10 rounded-lg border text-sm flex items-center justify-center ${
                    answered
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {q.id}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">
            Answered {answeredCount} / {totalQuestions}
          </p>
        </aside>
      </div>
    </div>
  );
};

export default QuizDetails;

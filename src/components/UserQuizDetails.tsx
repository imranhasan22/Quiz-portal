// UserQuizDetails.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface QuizDetails {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalQuestions: number;
  totalMarks: number;
  attemptCount: number;
  agentName: string;
  agentId: string | number;
  process: string;
  skill: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  quiz?: QuizDetails;
  onStart?: (quizId: number) => void; 
};

const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-medium text-gray-900">{value}</p>
  </div>
);

const UserQuizDetails: React.FC<Props> = ({ open, onClose, quiz, onStart }) => {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open || !quiz) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[1px]" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center cursor-pointer rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-gray-500">Quiz Name</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">{quiz.title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            <Field label="Start Date" value={quiz.startDate} />
            <Field label="End Date" value={quiz.endDate} />
            <Field label="Duration" value={quiz.duration} />
            <Field label="Total Questions" value={quiz.totalQuestions} />
            <Field label="Total Marks" value={quiz.totalMarks} />
            <Field label="Attempt Count" value={quiz.attemptCount} />
            <Field label="Agent Name" value={quiz.agentName} />
            <Field label="Agent ID" value={quiz.agentId} />
            <Field label="Process" value={quiz.process} />
            <Field label="Skill" value={quiz.skill} />
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl bg-[#CFF4E8] px-4 py-2 text-[#5670F7] cursor-pointer hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={() => quiz && onStart?.(quiz.id)}   
              className="rounded-xl bg-[#5670F7] cursor-pointer px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQuizDetails;

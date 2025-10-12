import React, { useState } from "react";
import { CalendarDays, Award, Clock } from "lucide-react";
import UserQuizDetails, { type QuizDetails } from "./UserQuizDetails";
import { useNavigate } from 'react-router-dom';

type Tab = "pending" | "scores";

interface BaseQuiz {
    id: number;
    title: string;
    createdBy: string;
}

interface PendingQuiz extends BaseQuiz {
    dateLabel: string;
    time?: string;
    status: "today" | "upcoming";
    remaining?: string;
}

interface ScoredQuiz extends BaseQuiz {
    date: string;
    time: string;
    score: string;
}

/** ---------- Mock Data ---------- */
const PENDING: (PendingQuiz & QuizDetails)[] = [
    {
        id: 1,
        title: "Nagad Quiz 1",
        createdBy: "Admin",
        dateLabel: "Today",
        status: "today",
        remaining: "4 Hours 20 min Left!",
        startDate: "24 Jun 2024, 4:30 PM",
        endDate: "24 Jun 2024, 5:00 PM",
        duration: "30 minutes",
        totalQuestions: 20,
        totalMarks: 20,
        attemptCount: 1,
        agentName: "Anik Hasan",
        agentId: "20303",
        process: "Nagad",
        skill: "Digital",
    },
    {
        id: 2,
        title: "Nagad Quiz 2",
        createdBy: "Admin",
        dateLabel: "25 Jun 2024",
        time: "4:30 PM",
        status: "upcoming",
        startDate: "25 Jun 2024, 4:30 PM",
        endDate: "25 Jun 2024, 5:00 PM",
        duration: "30 minutes",
        totalQuestions: 20,
        totalMarks: 20,
        attemptCount: 1,
        agentName: "Anik Hasan",
        agentId: "20303",
        process: "Nagad",
        skill: "Digital",
    },
    {
        id: 3,
        title: "Nagad Quiz 3",
        createdBy: "Admin",
        dateLabel: "21 Jun 2024",
        time: "10:30 AM",
        status: "upcoming",
        startDate: "21 Jun 2024, 10:30 AM",
        endDate: "21 Jun 2024, 11:00 AM",
        duration: "30 minutes",
        totalQuestions: 20,
        totalMarks: 20,
        attemptCount: 1,
        agentName: "Anik Hasan",
        agentId: "20303",
        process: "Nagad",
        skill: "Digital",
    },
    {
        id: 4,
        title: "Nagad Quiz 4",
        createdBy: "Admin",
        dateLabel: "08 Jun 2024",
        time: "02:00 PM",
        status: "upcoming",
        startDate: "08 Jun 2024, 2:00 PM",
        endDate: "08 Jun 2024, 2:30 PM",
        duration: "30 minutes",
        totalQuestions: 20,
        totalMarks: 20,
        attemptCount: 1,
        agentName: "Anik Hasan",
        agentId: "20303",
        process: "Nagad",
        skill: "Digital",
    },
];

const SCORES: ScoredQuiz[] = [
    { id: 1, title: "Nagad Quiz 1", createdBy: "Admin", date: "15 Jun 2024", time: "4:30 PM", score: "15/20" },
    { id: 2, title: "Nagad Quiz 2", createdBy: "Admin", date: "16 Jun 2024", time: "1:30 PM", score: "19/20" },
    { id: 3, title: "Nagad Quiz 3", createdBy: "Admin", date: "08 Jun 2024", time: "02:30 PM", score: "08/20" },
    { id: 4, title: "Nagad Quiz 4", createdBy: "Admin", date: "03 Jun 2024", time: "11:30 AM", score: "12/20" },
];

/** ---------- Utility ---------- */
const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

const UserQuiz: React.FC = () => {
    const [tab, setTab] = useState<Tab>("pending");
    const [open, setOpen] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState<QuizDetails | undefined>(undefined);
    const navigate = useNavigate();

    return (
        <div className="p-6">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button
                    className={cx(
                        "pb-2 transition text-sm sm:text-base",
                        tab === "pending" ? "border-b-2 border-black font-medium text-gray-900" : "text-gray-500 hover:text-gray-800"
                    )}
                    onClick={() => setTab("pending")}
                    aria-current={tab === "pending" ? "page" : undefined}
                >
                    Pending Quiz
                </button>

                <button
                    className={cx(
                        "pb-2 transition text-sm sm:text-base",
                        tab === "scores" ? "border-b-2 border-black font-medium text-gray-900" : "text-gray-500 hover:text-gray-800"
                    )}
                    onClick={() => setTab("scores")}
                    aria-current={tab === "scores" ? "page" : undefined}
                >
                    Previous Quiz Score
                </button>
            </div>

            {/* Content */}
            {tab === "pending" ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {PENDING.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => {
                                    setActiveQuiz(q);
                                    setOpen(true);
                                }}
                                className="text-left bg-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{q.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">Created by: {q.createdBy}</p>

                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <div className="flex items-center gap-1">
                                        <CalendarDays className="h-4 w-4" />
                                        <span>
                                            {q.dateLabel}
                                            {q.time && ` - ${q.time}`}
                                        </span>
                                    </div>

                                    {q.status === "today" ? (
                                        <div className="flex items-center gap-1 text-red-600 font-medium">
                                            <Clock className="h-4 w-4" />
                                            <span>{q.remaining}</span>
                                        </div>
                                    ) : (
                                        <span className="ml-auto text-xs font-medium text-gray-500 uppercase">
                                            Upcoming
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Modal for Pending Quiz */}
                    <UserQuizDetails
                        open={open}
                        onClose={() => setOpen(false)}
                        quiz={activeQuiz}
                        onStart={(id) => {
                            setOpen(false);
                            navigate(`/userquiz/take/${id}`);
                        }}
                    />
                </>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {SCORES.map((q) => (
                        <button
                            key={q.id}
                            onClick={() => navigate(`/userquiz/details/${q.id}`)}
                            className="text-left bg-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{q.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">Created by: {q.createdBy}</p>

                            <div className="flex items-center gap-3 text-sm text-gray-800">
                                <div className="flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>
                                        {q.date} - {q.time}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 ml-auto font-semibold">
                                    <Award className="h-4 w-4" />
                                    <span>{q.score}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserQuiz;

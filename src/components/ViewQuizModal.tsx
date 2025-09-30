import React, { useEffect } from "react";
import { X } from "lucide-react";

type ViewQuizData = {
    process: string;
    quizId: string;
    quizTitle: string;
    answerType: string;
    createdBy: string;
    createdTime: string;
    description?: string;
    required?: boolean;
    status?: "Active" | "Inactive";
};

type Props = {
    open: boolean;
    data: ViewQuizData | null;
    onClose: () => void;
};

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">{label}</label>
        <input
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            value={(value as string) ?? ""}
            readOnly
            disabled
        />
    </div>
);

const ViewQuizModal: React.FC<Props> = ({ open, data, onClose }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (!open || !data) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 w-[600px] max-w-[94vw] rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking outside the modal
            >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">View Quiz</h2>
                    <button
                        aria-label="Close"
                        className="rounded p-1 text-gray-500 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>


                <form className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <Field label="Process Name" value={data.process} />
                    <Field label="Quiz ID" value={data.quizId} />
                    <Field label="Quiz Title" value={data.quizTitle} />
                    <Field label="Answer Type" value={data.answerType} />
                    <Field label="Created by" value={data.createdBy} />
                    <Field label="Created Time" value={data.createdTime} />
                    <Field label="Status" value={data.status} />

                </form>

                {/* Footer */}
                <div className="mt-10 flex justify-end">
                </div>
            </div>
        </div>
    );
};

export default ViewQuizModal;

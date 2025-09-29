import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";

type AddUserModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose, onSubmit }) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // ESC key close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Reset form and state when modal opens
    useEffect(() => {
        if (open) {
            setForm({
                employeeName: "",
                employeeId: "",
                phone: "",
                process: "",
                role: "",
                status: "",
                password: "",
                confirmPassword: "",
            });
            setShowSuccess(false);
            setShowFailure(false);
        }
    }, [open]);

    // State for success and failure
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    // Form state
    const [form, setForm] = useState({
        employeeName: "",
        employeeId: "",
        phone: "",
        process: "",
        role: "",
        status: "",
        password: "",
        confirmPassword: "",
    });

    const inputBase =
        "w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md";

    const selectBase =
        "w-full h-10 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md";

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!form.employeeName || !form.employeeId) {
            setShowFailure(true);
        } else {
            onSubmit?.(form);
            setShowSuccess(true);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
             {/*  onClick={onClose} for outside click */}
            <div className="absolute inset-0 bg-black/40" />

            <div
                ref={dialogRef}
                className="relative z-10 w-[90vw] max-w-[720px] rounded-xl border bg-white shadow-2xl transform transition-all"
                 onClick={(e) => e.stopPropagation()} // Prevent closing when clicking outside the modal
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-700">Add New User</h3>
                    <button
                        onClick={onClose}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-gray-200"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Employee Name */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Employee Name</label>
                            <input
                                className={inputBase}
                                placeholder="Enter Employee Name"
                                value={form.employeeName}
                                onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                            />
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Employee ID</label>
                            <input
                                className={inputBase}
                                placeholder="Enter Employee ID"
                                value={form.employeeId}
                                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Phone Number</label>
                            <input
                                className={inputBase}
                                placeholder="Enter Phone Number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>

                        {/* Process */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Process Name</label>
                            <div className="relative">
                                <select
                                    className={selectBase}
                                    value={form.process}
                                    onChange={(e) => setForm({ ...form, process: e.target.value })}
                                >
                                    <option value="" hidden>Select Process</option>
                                    {["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"].map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Role</label>
                            <div className="relative">
                                <select
                                    className={selectBase}
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="" hidden>Select Employee Role</option>
                                    {["New Joiner", "Agent", "Admin"].map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Select Status</label>
                            <div className="relative">
                                <select
                                    className={selectBase}
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="" hidden>Select Status</option>
                                    {["Active", "Inactive"].map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">New Password</label>
                            <input
                                type="password"
                                className={inputBase}
                                placeholder="Enter New Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                className={inputBase}
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="py-4">
                        <button
                            type="submit" // Handle form submission via the form tag
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
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
                            ❌ Failed to add <br /> new User.
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
                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-s animate-fadeIn" />

                    {/* success card */}
                    <div className="relative z-10 w-[320px] rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
                        {/* icon */}
                        <div className="mb-4 flex items-center justify-center">
                            <div className="grid h-14 w-14 place-items-center rounded-full bg-green-100 shadow-inner">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        {/* text */}
                        <p className="mb-6 text-center text-lg font-semibold text-gray-800">
                            🎉 Successfully added <br /> new User!
                        </p>

                        {/* button */}
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

export default AddUserModal;

import React, { useEffect, useState } from "react";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";

// Define the UserRow type
type UserRow = {
  id: number;
  sl: string;
  process: string;
  name: string;
  employeeId: string;
  role: "New Joiner" | "Agent" | "Admin";
  phone: string;
  status: "Active" | "Inactive";
  password?: string;
  confirmPassword?: string;
};

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserRow) => void;
  user: UserRow | null;
};

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, onSubmit, user }) => {
  const [form, setForm] = useState<UserRow | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // Close modal with ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Populate form with user data when modal is open
  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!open || !user) return null; // Return null if modal is not open or user is null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form?.process || !form?.name || !form?.employeeId || !form?.phone || !form?.status) {
      setShowFailure(true);
       return
    }
    else {
      onSubmit?.(form)
      setShowSuccess(true);
    }
 
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-[90vw] max-w-[720px] rounded-xl border bg-white shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking outiside the modal
        >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-700">Edit User</h3>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full hover:bg-gray-200">
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Employee Name</label>
              <input
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                name="name"
                value={form?.name || ""}
                onChange={handleChange}
                placeholder="Enter Employee Name"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Employee ID</label>
              <input
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                name="employeeId"
                value={form?.employeeId || ""}
                onChange={handleChange}
                placeholder="Enter Employee ID"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Phone Number</label>
              <input
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                name="phone"
                value={form?.phone || ""}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>

            {/* Process Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Process Name</label>
              <div className="relative">
                <select
                  className="w-full h-10 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                  name="process"
                  value={form?.process || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Process</option>
                  {["Nagad", "Bexcom", "SBL", "LG", "BTCL", "UML", "Linde", "Coca-Cola", "CTGWASA"].map((process) => (
                    <option key={process} value={process}>
                      {process}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Role</label>
              <div className="relative">
                <select
                  className="w-full h-10 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                  name="role"
                  value={form?.role || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  {["New Joiner", "Agent", "Admin"].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Status</label>
              <div className="relative">
                <select
                  className="w-full h-10 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
                  name="status"
                  value={form?.status || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  {["Active", "Inactive"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Passwords */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                name="password"
                value={form?.password || ""}
                onChange={handleChange}
                placeholder="Enter New Password"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                name="confirmPassword"
                value={form?.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-200"
            >
              Save
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
              ❌ Failed to Edit <br /> new User.
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

      {/* Success pop-up */}
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
              🎉 Successfully edit <br /> User!
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
  );
};

export default EditUserModal;

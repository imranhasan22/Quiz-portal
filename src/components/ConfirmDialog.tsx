import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm action",
  message = "Are you sure you want to delete?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(); 
          }}
        >
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          {/* Message */}
          <p className="mt-2 text-sm text-gray-600">{message}</p>

          {/* Buttons */}
          <div className="mt-5  flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl cursor-pointer bg-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="rounded-xl cursor-pointer bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDialog;

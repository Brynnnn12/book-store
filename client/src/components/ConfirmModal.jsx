import React from "react";

const ConfirmModal = ({
  open,
  title = "Konfirmasi",
  message = "Apakah kamu yakin ingin melanjutkan?",
  confirmText = "Ya",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-error text-error-content rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856C18.36 18.36 20 15.955 20 13s-1.64-5.36-4.082-6.59A9.978 9.978 0 0012 4a9.978 9.978 0 00-3.918.81C5.64 7.64 4 10.045 4 13c0 2.955 1.64 5.36 4.062 6.59z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn border border-gray-300 bg-white hover:bg-gray-100"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-error text-white ${
              loading ? "btn-disabled" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

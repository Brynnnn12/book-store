import React from "react";

const DeleteConfirmationModal = ({
  bookToDelete,
  closeModals,
  deleteBook,
  isDeleteModalOpen,
}) => {
  if (!bookToDelete || !isDeleteModalOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
        <p className="py-4">
          Apakah Anda yakin ingin menghapus buku "{bookToDelete.title}"?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={closeModals}>
            Batal
          </button>
          <button className="btn btn-error" onClick={deleteBook}>
            Hapus
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={closeModals}></div>
    </div>
  );
};

export default DeleteConfirmationModal;

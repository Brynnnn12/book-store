import React, { useState } from "react";
import { toast } from "react-hot-toast";

const OrderDetailModal = ({
  order,
  loading,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  const handleUpdateStatus = async () => {
    try {
      await onUpdateStatus(order._id, paymentStatus);
      toast.success("Status pembayaran berhasil diperbarui!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui status");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Detail Pesanan</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2">
          <p>
            <strong>ID Pesanan:</strong> {order._id}
          </p>
          <p>
            <strong>Pengguna:</strong> {order.userId?.name} (
            {order.userId?.email})
          </p>
          <p>
            <strong>Buku:</strong> {order.bookId?.title} oleh{" "}
            {order.bookId?.author}
          </p>
          <p>
            <strong>Total Harga:</strong> Rp{" "}
            {order.totalPrice?.toLocaleString()}
          </p>
          <p>
            <strong>Status Pembayaran:</strong>{" "}
            <StatusBadge status={order.paymentStatus} />
          </p>
          {order.paymentProof && (
            <div>
              <p>
                <strong>Bukti Pembayaran:</strong>
              </p>
              <img
                src={order.paymentProof}
                alt="Bukti Pembayaran"
                className="mt-2 max-h-32 rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="modal-action">
          <div className="w-full">
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Update Status Pembayaran</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="select select-bordered flex-grow"
                >
                  <option value="pending">Menunggu</option>
                  <option value="completed">Selesai</option>
                  <option value="failed">Gagal</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {!loading && "Update"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="btn">
                Tutup
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Apakah Anda yakin ingin menghapus pesanan ini?"
                    )
                  ) {
                    onDelete(order._id);
                  }
                }}
                className={`btn btn-error ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {!loading && "Hapus Pesanan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-success",
      text: "text-success-content",
      label: "Selesai",
    },
    pending: {
      bg: "bg-warning",
      text: "text-warning-content",
      label: "Menunggu",
    },
    failed: {
      bg: "bg-error",
      text: "text-error-content",
      label: "Gagal",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`badge ${config.bg} ${config.text}`}>{config.label}</span>
  );
};

export default OrderDetailModal;

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmModal from "../../../components/ConfirmModal"; // Pastikan path-nya sesuai

const OrderTable = ({ orders, loading, onViewDetail, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = (id) => {
    setSelectedOrderId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    setDeleting(true);
    try {
      await onDelete(selectedOrderId);
    } finally {
      setDeleting(false);
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Memuat data...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 py-4 text-center text-gray-500">
        Tidak ada data pesanan
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <h2 className="text-xl font-semibold p-4 border-b">Daftar Pesanan</h2>

        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengguna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buku
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order._id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.userId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.bookId?.title || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  Rp {order.totalPrice?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetail(order._id)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      title="Detail"
                    >
                      <FaEye className="mr-1" />
                      <span className="sr-only md:not-sr-only">Detail</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(order._id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Hapus"
                    >
                      <RiDeleteBinLine className="mr-1" />
                      <span className="sr-only md:not-sr-only">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmModal
        open={showModal}
        title="Hapus Pesanan"
        message="Apakah Anda yakin ingin menghapus pesanan ini?"
        confirmText="Hapus"
        cancelText="Batal"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowModal(false);
          setSelectedOrderId(null);
        }}
      />
    </>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Selesai",
      icon: "✅",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Menunggu",
      icon: "⏳",
    },
    failed: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Gagal",
      icon: "❌",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
    >
      {config.icon} {config.label}
    </span>
  );
};

export default OrderTable;

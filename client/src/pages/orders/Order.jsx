import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../utils/axiosConfig";
import OrderForm from "./components/OrderForm";
import OrderTable from "./components/OrderTable";
import OrderDetailModal from "./components/OrderDetailModal";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data pesanan");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books for the order form
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data.books);
    } catch (err) {
      toast.error("Gagal memuat data buku");
      console.error("Error fetching books:", err);
    }
  };

  // Fetch order by ID
  const fetchOrderById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${id}`);
      setSelectedOrder(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat detail pesanan");
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("bookId", orderData.bookId);
      formDataObj.append("totalPrice", orderData.totalPrice);
      if (orderData.paymentProof) {
        formDataObj.append("paymentProof", orderData.paymentProof);
      }

      await api.post("/orders", formDataObj);
      await fetchOrders();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, status) => {
    setLoading(true);
    try {
      await api.put(`/orders/${orderId}/payment-status`, {
        paymentStatus: status,
      });
      await fetchOrders();
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Gagal memperbarui status pembayaran"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    setLoading(true);
    try {
      await api.delete(`/orders/${orderId}`);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
      toast.success("Pesanan berhasil dihapus!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pesanan");
      console.error("Error deleting order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchOrders();
    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-24 mb-10 px-10">
        <h1 className="text-3xl font-bold mb-6">Manajemen Pesanan</h1>

        <OrderForm
          books={books}
          loading={loading}
          onCreateOrder={createOrder}
        />

        <div className=" shadow-md rounded-lg overflow-hidden mb-8">
          <h2 className="text-xl font-semibold p-4 border-b">Daftar Pesanan</h2>
          <OrderTable
            orders={orders}
            loading={loading}
            onViewDetail={fetchOrderById}
            onDelete={deleteOrder}
          />
        </div>

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            loading={loading}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={updatePaymentStatus}
            onDelete={deleteOrder}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;

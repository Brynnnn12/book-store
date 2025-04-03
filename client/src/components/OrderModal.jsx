import { useState } from "react";
import api from "../utils/axiosConfig";
import toast from "react-hot-toast";

const OrderModal = ({ showModal, setShowModal, item }) => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("bookId", item._id);
      formData.append("totalPrice", item.price);
      paymentProof && formData.append("paymentProof", paymentProof);

      const response = await api.post("/orders", formData);

      if (response.status === 201) {
        toast.success("Order created successfully");
        setShowModal(false);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create order";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setError(null);
  };

  return (
    <dialog open={showModal} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create New Order</h3>
        <div className="divider my-1" />

        <div className="space-y-4">
          {/* Book Information */}
          {["title", "author", "price"].map((field) => (
            <div key={field}>
              <p className="font-medium capitalize">{field}:</p>
              <p className="text-lg">
                {field === "price" ? `$${item[field]}` : item[field]}
              </p>
            </div>
          ))}

          {/* Payment Proof Form */}
          <form onSubmit={handleBuyNow}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Upload Payment Proof</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                required
              />
              <label className="label">
                <span className="label-text-alt">
                  Please upload your payment receipt
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={handleClose}
                disabled={isLoading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default OrderModal;

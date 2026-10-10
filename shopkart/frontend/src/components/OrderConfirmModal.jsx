import React from "react";

export default function OrderConfirmModal({ order, onClose }) {
  return (
    <div className="modal">
      <div className="modalbox confirm">
        <div className="check">✅</div>
        <h3>Order placed!</h3>
        <p style={{ margin: "8px 0", color: "var(--muted)" }}>
          Order #{order.order_id} for ₹{Number(order.total).toLocaleString("en-IN")}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          This order is saved in the Django database — check /admin/ to see it.
        </p>
        <div className="modal-actions">
          <button className="btn-primary" style={{ flex: "none", width: "100%" }} onClick={onClose}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

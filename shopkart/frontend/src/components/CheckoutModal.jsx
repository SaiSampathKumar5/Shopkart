import React, { useState } from "react";

export default function CheckoutModal({ onClose, onSubmit, submitting, error }) {
  const [form, setForm] = useState({ customer_name: "", address: "", city: "", pincode: "" });
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.customer_name.trim() || !form.address.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="modal">
      <div className="modalbox">
        <h3>Delivery details</h3>
        <label>Full name</label>
        <input value={form.customer_name} onChange={update("customer_name")} placeholder="Full name" />
        <label>Address</label>
        <input value={form.address} onChange={update("address")} placeholder="House no, street, area" />
        <label>City</label>
        <input value={form.city} onChange={update("city")} placeholder="City" />
        <label>Pincode</label>
        <input value={form.pincode} onChange={update("pincode")} placeholder="6-digit pincode" />
        {error && <p className="errortext">{error}</p>}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}

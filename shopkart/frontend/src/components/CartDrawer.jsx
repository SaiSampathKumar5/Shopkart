import React from "react";

export default function CartDrawer({ cart, products, onClose, onChangeQty, onRemove, onCheckout }) {
  const entries = Object.entries(cart);
  const lookup = Object.fromEntries(products.map((p) => [p.id, p]));
  const total = entries.reduce((sum, [id, qty]) => sum + (lookup[id]?.price || 0) * qty, 0);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer" style={{ transform: "translateX(0)" }}>
        <div className="drawer-head">
          <strong>Your Cart</strong>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {entries.length === 0 && <p className="empty">Your cart is empty.</p>}
          {entries.map(([id, qty]) => {
            const p = lookup[id];
            if (!p) return null;
            return (
              <div className="citem" key={id}>
                <div className="cithumb" style={{ background: p.color }}>{p.emoji}</div>
                <div className="cinfo">
                  <div className="pname">{p.name}</div>
                  <div className="pmeta">₹{Number(p.price).toLocaleString("en-IN")}</div>
                  <div className="qtyrow">
                    <button onClick={() => onChangeQty(p.id, -1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => onChangeQty(p.id, 1)}>+</button>
                    <button className="remove" onClick={() => onRemove(p.id)}>Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {entries.length > 0 && (
          <div className="drawer-foot">
            <div className="totalrow">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button className="checkoutbtn" onClick={onCheckout}>Proceed to checkout</button>
          </div>
        )}
      </div>
    </>
  );
}

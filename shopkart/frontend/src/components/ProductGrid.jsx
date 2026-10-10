import React, { useState } from "react";

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };
  return (
    <div className="card">
      <div className="thumb" style={{ background: product.color }}>{product.emoji}</div>
      <span className="rating">★ {product.rating}</span>
      <div className="pname">{product.name}</div>
      <div className="pmeta">{product.category}</div>
      <div>
        <span className="price">₹{Number(product.price).toLocaleString("en-IN")}</span>
        <span className="mrp">₹{Number(product.mrp).toLocaleString("en-IN")}</span>
      </div>
      <button className={`addbtn ${added ? "added" : ""}`} onClick={handleAdd}>
        {added ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}

export default function ProductGrid({ products, onAdd }) {
  if (products.length === 0) {
    return <p className="empty">No products found. Try a different search.</p>;
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}

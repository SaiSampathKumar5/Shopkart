import React from "react";

export default function Header({ cats, activeCat, onCatChange, search, onSearchChange, cartCount, onOpenCart }) {
  return (
    <header>
      <div className="topbar">
        <div className="logo">Shop<span>kart</span></div>
        <div className="searchwrap">
          <input
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="button">🔍</button>
        </div>
        <button className="carticon" onClick={onOpenCart}>
          🛒<span className="badge">{cartCount}</span>
        </button>
      </div>
      <nav className="cats">
        {cats.map((c) => (
          <button
            key={c}
            className={`catbtn ${c === activeCat ? "active" : ""}`}
            onClick={() => onCatChange(c)}
          >
            {c}
          </button>
        ))}
      </nav>
    </header>
  );
}

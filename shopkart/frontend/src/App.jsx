import React, { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import Header from "./components/Header.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";
import OrderConfirmModal from "./components/OrderConfirmModal.jsx";

const CATS = ["All", "Electronics", "Fashion", "Home", "Books"];
const CART_KEY = "shopkart_cart";

export default function App() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // unfiltered, for cart lookups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .getProducts({ category, search })
      .then((data) => setProducts(data.results || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 250); // debounce search
    return () => clearTimeout(t);
  }, [loadProducts]);

  // Fetched once, unfiltered — the cart drawer needs to show items even
  // when the main grid is currently filtered to a different category/search.
  useEffect(() => {
    api.getProducts().then((data) => setAllProducts(data.results || data)).catch(() => {});
  }, []);

  const addToCart = (productId) =>
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + 1 }));

  const changeQty = (productId, delta) =>
    setCart((c) => {
      const next = { ...c, [productId]: (c[productId] || 0) + delta };
      if (next[productId] <= 0) delete next[productId];
      return next;
    });

  const removeItem = (productId) =>
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = async (details) => {
    setPlacingOrder(true);
    setOrderError(null);
    try {
      const items = Object.entries(cart).map(([product_id, quantity]) => ({
        product_id: Number(product_id),
        quantity,
      }));
      const order = await api.placeOrder({ ...details, items });
      setCart({});
      setCheckoutOpen(false);
      setConfirmedOrder(order);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Header
        cats={CATS}
        activeCat={category}
        onCatChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <h2 className="section-title">
          {search ? `Results for "${search}"` : category === "All" ? "All products" : category}
        </h2>
        {loading && <p className="empty">Loading products…</p>}
        {error && (
          <p className="empty">
            Couldn't reach the backend ({error}). Is Django running on :8000?
          </p>
        )}
        {!loading && !error && <ProductGrid products={products} onAdd={addToCart} />}
      </main>
      <footer>Shopkart — a demo storefront built on a real Django API.</footer>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          products={allProducts}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onRemove={removeItem}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSubmit={handlePlaceOrder}
          submitting={placingOrder}
          error={orderError}
        />
      )}
      {confirmedOrder && (
        <OrderConfirmModal order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />
      )}
    </>
  );
}

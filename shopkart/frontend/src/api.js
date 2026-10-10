// Thin wrapper around the Django REST API. In dev, Vite proxies "/api" to
// http://127.0.0.1:8000 (see vite.config.js), so relative paths work as-is.
const BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products/${qs ? `?${qs}` : ""}`);
  },
  placeOrder: (payload) =>
    request(`/orders/`, { method: "POST", body: JSON.stringify(payload) }),
  getOrder: (orderId) => request(`/orders/${orderId}/`),
};

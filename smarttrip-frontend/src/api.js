// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const apiRequest = {
  // ── Auth ─────────────────────────────────────────────
  login:              (data)      => API.post("/api/users/login", data),
  register:           (data)      => API.post("/api/users", data),

  // ── Users (admin) ────────────────────────────────────
  getUsers:           ()          => API.get("/api/users"),
  deleteUser:         (id)        => API.delete(`/api/users/${id}`),

  // ── Packages ─────────────────────────────────────────
  getPackages:        ()          => API.get("/packages"),
  getMyPackages:      (agencyId)  => API.get(`/packages/agency/${agencyId}`),
  createPackage:      (data)      => API.post("/packages", data),
  updatePackage:      (id, data)  => API.put(`/packages/${id}`, data),
  deactivate:         (id)        => API.put(`/packages/${id}/deactivate`),

  // ── Bookings ─────────────────────────────────────────
  createBooking:      (data)      => API.post("/bookings", data),
  getAllBookings:      ()          => API.get("/bookings"),
  getMyBookings:      (userId)    => API.get(`/bookings/user/${userId}`),
  // FIX: this endpoint was missing — BookingList used a broken dynamic import workaround instead
  getBookingsByAgency:(agencyId)  => API.get(`/bookings/agency/${agencyId}`),
  cancelBooking:      (id)        => API.put(`/bookings/${id}/cancel`),
  approveBooking:     (id)        => API.put(`/bookings/${id}/approve`),
  rejectBooking:      (id)        => API.put(`/bookings/${id}/reject`),

  // ── Reviews ──────────────────────────────────────────
  getReviews:         (pkgId)     => API.get(`/reviews/package/${pkgId}`),
  addReview:          (data)      => API.post("/reviews", data),
};

export default API;
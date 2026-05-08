// src/components/MyTrips.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../api';
import { MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md';

const MyTrips = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("ALL");

  // FIX: wrapped in useCallback so it's stable and can be called after cancel
  const fetchBookings = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    apiRequest.getMyBookings(user.id)
      .then(res => setBookings(res.data))
      .catch(err => console.error("Failed to load bookings:", err))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await apiRequest.cancelBooking(id);
      // FIX: refresh list so cancelled booking shows updated status immediately
      fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to cancel booking.";
      alert(msg);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED": return { cls: "status-badge status-confirmed", icon: <MdCheckCircle /> };
      case "PENDING":   return { cls: "status-badge status-pending",   icon: <MdAccessTime /> };
      case "CANCELLED": return { cls: "status-badge status-cancelled", icon: <MdCancel /> };
      default:          return { cls: "status-badge status-pending",   icon: null };
    }
  };

  const filtered = bookings.filter(b => filter === "ALL" || b.status === filter);

  if (loading) return (
    <div className="content-area flex items-center justify-center" style={{ minHeight: 300 }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">My Trips</h1>
        <div className="filter-tabs">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`filter-tab ${filter === s ? "active" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h2>No trips found</h2>
          <p>{bookings.length === 0 ? "You haven't made any bookings yet." : "No trips match this filter."}</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filtered.map((booking) => {
            const { cls, icon } = getStatusStyle(booking.status);
            const pkg = booking.travelPackage || {};

            return (
              <motion.div key={booking.id} className="booking-card" whileHover={{ y: -6 }}>
                <div className="booking-card-header">
                  <div>
                    <h3 className="booking-title">{pkg.title || "Unknown Package"}</h3>
                    <p className="booking-destination">{pkg.destination || "—"}</p>
                  </div>
                  <span className={cls}>{icon} {booking.status}</span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Travel Date</span>
                    <span className="detail-value">{booking.travelDate || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Travelers</span>
                    <span className="detail-value">{booking.numberOfTravelers ?? 1} person(s)</span>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <div>
                    <p className="price-label">Total Amount</p>
                    <p className="price-value">
                      ₹{(booking.finalPrice || booking.totalPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  {/* FIX: only PENDING bookings can be cancelled (matches backend rule) */}
                  {booking.status === "PENDING" && (
                    <button onClick={() => handleCancel(booking.id)} className="cancel-btn">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTrips;

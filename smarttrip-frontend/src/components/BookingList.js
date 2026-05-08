import React, { useEffect, useState, useCallback } from "react";
import { MdOutlineConfirmationNumber, MdPerson, MdLocationOn, MdCheckCircle, MdCancel } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../api";

function BookingList({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    try {
      let data;

      if (user.role === "ADMIN") {
        // Admin sees all bookings
        const res = await apiRequest.getAllBookings();
        data = res.data;
      } else if (user.role === "AGENCY") {
        // FIX: was a broken dynamic import hack then client-side filtering.
        // Use the dedicated /bookings/agency/{id} endpoint instead.
        const res = await apiRequest.getBookingsByAgency(user.id);
        data = res.data;
      } else {
        const res = await apiRequest.getMyBookings(user.id);
        data = res.data;
      }

      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleAction = async (id, action) => {
    const label = action === "approve" ? "confirm" : "reject";
    if (!window.confirm(`Are you sure you want to ${label} this booking?`)) return;
    try {
      if (action === "approve") await apiRequest.approveBooking(id);
      else                      await apiRequest.rejectBooking(id);
      loadBookings();
    } catch (err) {
      alert("Failed to update booking status.");
    }
  };

  if (loading) return (
    <div className="content-area flex items-center justify-center" style={{ minHeight: 300 }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">
          {user?.role === "AGENCY" ? "Reservations" : "All Bookings"}
        </h1>
        <span className="badge">{bookings.length} total</span>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <MdOutlineConfirmationNumber size={64} className="empty-icon" />
          <h2>No Bookings Found</h2>
          <p>Nothing to show here yet.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          <AnimatePresence>
            {bookings.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="booking-card"
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="booking-card-left">
                  <div className={`booking-icon ${b.status === "CONFIRMED" ? "confirmed" : b.status === "CANCELLED" ? "cancelled" : "pending"}`}>
                    <MdLocationOn size={26} />
                  </div>
                  <div>
                    <h3 className="booking-title">{b.travelPackage?.title || "Unknown Package"}</h3>
                    <div className="booking-meta">
                      <span><MdPerson size={14} /> {b.user?.name || "—"}</span>
                      {b.travelDate && <span>📅 {b.travelDate}</span>}
                      {b.numberOfTravelers && <span>👥 {b.numberOfTravelers} traveler(s)</span>}
                    </div>
                  </div>
                </div>

                <div className="booking-card-right">
                  <div className="booking-price">
                    <p className="price-label">Total</p>
                    <p className="price-value">₹{(b.finalPrice || b.totalPrice || 0).toLocaleString()}</p>
                  </div>

                  {/* FIX: Admin also gets approve/reject controls */}
                  {(user.role === "AGENCY" || user.role === "ADMIN") && b.status === "PENDING" && (
                    <div className="action-buttons">
                      <button onClick={() => handleAction(b.id, "approve")} className="action-btn approve" title="Approve">
                        <MdCheckCircle size={20} /> Approve
                      </button>
                      <button onClick={() => handleAction(b.id, "reject")} className="action-btn reject" title="Reject">
                        <MdCancel size={20} /> Reject
                      </button>
                    </div>
                  )}

                  <span className={`status-badge status-${b.status?.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default BookingList;
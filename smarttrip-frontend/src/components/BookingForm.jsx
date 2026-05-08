import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../api';

const BookingForm = ({ user }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    travelDate: "",
    numberOfTravelers: 1,
    couponCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    apiRequest.getPackages()
      .then(res => {
        const available = res.data.filter(p => p.active && p.availableSlots > 0);
        setPackages(available);
      })
      .catch(err => console.error("Error loading packages:", err))
      .finally(() => setLoadingPackages(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) return alert("Please select a package first");
    if (!formData.travelDate) return alert("Please select a travel date");

    // FIX: parse numberOfTravelers to int early for correct comparison
    const numTravelers = parseInt(formData.numberOfTravelers, 10);
    if (!numTravelers || numTravelers < 1) return alert("Number of travelers must be at least 1");
    if (numTravelers > selectedPackage.availableSlots) {
      return alert(`Only ${selectedPackage.availableSlots} slots available for this trip`);
    }

    setLoading(true);

    const bookingData = {
      user:              { id: user.id },
      travelPackage:     { id: selectedPackage.id },
      travelDate:        formData.travelDate,
      numberOfTravelers: numTravelers,
      // FIX: send empty string as null so backend coupon check doesn't
      // try to match a blank string against the coupon code
      couponCode:        formData.couponCode.trim() || null,
      status:            "PENDING"
    };

    try {
      await apiRequest.createBooking(bookingData);
      alert("🎉 Booking Successful! You can view it in 'My Trips'.");
      setFormData({ travelDate: "", numberOfTravelers: 1, couponCode: "" });
      setSelectedPackage(null);
      // FIX: reset the select via state instead of direct DOM access (React-safe)
      document.getElementById("package-select").value = "";
    } catch (err) {
      const msg = err.response?.data?.error || "Booking failed. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // FIX: derived estimate uses parsed int so it doesn't show NaN or wrong values
  const numTravelers = parseInt(formData.numberOfTravelers, 10) || 0;
  const estimatedTotal = selectedPackage ? selectedPackage.price * numTravelers : 0;

  return (
    <div className="content-area">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="section-card"
        style={{ maxWidth: 680, margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", color: "#1e293b" }}>
          Book Your Trip ✈️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Selector */}
          <div className="form-group">
            <label>Select Destination *</label>
            {loadingPackages ? (
              <p style={{ color: "#94a3b8" }}>Loading trips...</p>
            ) : packages.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No available packages at the moment.</p>
            ) : (
              <select
                id="package-select"
                className="form-input"
                defaultValue=""
                onChange={(e) => {
                  const pkg = packages.find(p => p.id === parseInt(e.target.value, 10));
                  setSelectedPackage(pkg || null);
                }}
                required
              >
                <option value="" disabled>-- Choose a Destination --</option>
                {packages.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.destination} (₹{p.price?.toLocaleString()}) · {p.availableSlots} slots
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Package Preview */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 16, padding: "18px 22px" }}
            >
              <p style={{ fontWeight: 700, color: "#166534", marginBottom: 4 }}>{selectedPackage.title}</p>
              <p style={{ color: "#15803d", fontSize: "0.88rem" }}>
                📍 {selectedPackage.destination} &nbsp;|&nbsp; 💰 ₹{selectedPackage.price?.toLocaleString()} per person
                &nbsp;|&nbsp; 🗓 {selectedPackage.travelDate || "Flexible"}
              </p>
              {selectedPackage.couponCode && (
                <p style={{ color: "#15803d", fontSize: "0.82rem", marginTop: 6 }}>
                  🏷 Coupon available: <strong>{selectedPackage.couponCode}</strong>
                  {" "}({selectedPackage.discountType === "PERCENT"
                    ? `${selectedPackage.discountValue}% off`
                    : `₹${selectedPackage.discountValue} off`})
                </p>
              )}
            </motion.div>
          )}

          {/* Date & Travelers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label>Travel Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.travelDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Travelers *</label>
              <input
                type="number"
                min="1"
                max={selectedPackage?.availableSlots || 99}
                className="form-input"
                value={formData.numberOfTravelers}
                onChange={(e) => setFormData({ ...formData, numberOfTravelers: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Price Preview */}
          {selectedPackage && numTravelers > 0 && (
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Estimated Total</span>
              <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1e293b" }}>
                ₹{estimatedTotal.toLocaleString()}
              </span>
            </div>
          )}

          {/* Coupon */}
          <div className="form-group">
            <label>Promo Code (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter coupon code"
              value={formData.couponCode}
              onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
            />
          </div>

          <button type="submit" className="btn" disabled={loading || !selectedPackage} style={{ fontSize: "1.1rem", padding: "16px" }}>
            {loading ? "Processing..." : "Confirm Booking →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;



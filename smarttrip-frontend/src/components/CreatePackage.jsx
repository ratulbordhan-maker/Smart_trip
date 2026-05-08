import React, { useState } from "react";
import { apiRequest } from "../api";
import { motion } from 'framer-motion';

function CreatePackage({ user }) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    price: "",
    description: "",
    travelDate: "",
    totalSlots: "",
    couponCode: "",
    discountValue: "",
    discountType: "PERCENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.destination || !formData.price || !formData.totalSlots) {
      setError("Please fill all required fields (*)");
      return;
    }
    if (Number(formData.price) <= 0) { setError("Price must be greater than 0"); return; }
    if (Number(formData.totalSlots) <= 0) { setError("Slots must be greater than 0"); return; }

    setLoading(true);
    setError("");

    try {
      const slots = Number(formData.totalSlots);
      const payload = {
        title:          formData.title,
        destination:    formData.destination,
        price:          Number(formData.price),
        description:    formData.description,
        travelDate:     formData.travelDate,
        totalSlots:     slots,
        availableSlots: slots,   // ✅ backend also sets this but we send it for safety
        createdBy:      user.id, // ✅ links package to logged-in agency
        active:         true,
        // optional coupon fields
        couponCode:     formData.couponCode   || null,
        discountValue:  formData.discountValue ? Number(formData.discountValue) : 0,
        discountType:   formData.discountType  || "PERCENT",
      };

      // ✅ FIX: apiRequest.createPackage → POST /packages (correct, no /api prefix)
      await apiRequest.createPackage(payload);
      setSuccess(true);
      setFormData({ title: "", destination: "", price: "", description: "", travelDate: "", totalSlots: "", couponCode: "", discountValue: "", discountType: "PERCENT" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create package. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 className="text-4xl font-bold text-white mb-8">Post a New Trip</h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-card">
        {error   && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "14px 18px", borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ background: "#d1fae5", color: "#065f46", padding: "14px 18px", borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>🎉 Package published successfully!</div>}

        {/* Basic Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="form-group">
            <label>Trip Title *</label>
            <input name="title" className="form-input" placeholder="e.g. Goa Beach Getaway" value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Destination *</label>
            <input name="destination" className="form-input" placeholder="e.g. Goa, India" value={formData.destination} onChange={handleChange} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label>Price per Person (₹) *</label>
              <input name="price" type="number" min="1" className="form-input" placeholder="5000" value={formData.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Total Slots *</label>
              <input name="totalSlots" type="number" min="1" className="form-input" placeholder="20" value={formData.totalSlots} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Travel Date</label>
            <input name="travelDate" type="date" className="form-input" value={formData.travelDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-input" style={{ height: 120, resize: "vertical" }} placeholder="Describe the adventure — itinerary, inclusions, highlights..." value={formData.description} onChange={handleChange} />
          </div>

          {/* Coupon Section */}
          <div style={{ border: "2px dashed #e2e8f0", borderRadius: 16, padding: 20 }}>
            <p style={{ fontWeight: 700, color: "#64748b", marginBottom: 14, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Optional Coupon / Discount</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label>Coupon Code</label>
                <input name="couponCode" className="form-input" placeholder="SAVE20" value={formData.couponCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Discount Value</label>
                <input name="discountValue" type="number" min="0" className="form-input" placeholder="20" value={formData.discountValue} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Discount Type</label>
                <select name="discountType" className="form-input" value={formData.discountType} onChange={handleChange}>
                  <option value="PERCENT">% Percent</option>
                  <option value="FLAT">₹ Flat</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn" style={{ fontSize: "1.1rem", padding: "18px" }}>
            {loading ? "Publishing..." : "Post Package →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CreatePackage;

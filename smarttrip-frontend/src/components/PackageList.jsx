import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../api';

const PackageList = ({ user }) => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // FIX: track deactivation state per package so button gives feedback
  const [deactivating, setDeactivating] = useState(null);

  const loadPackages = () => {
    const fetchFn = user?.role === "AGENCY"
      ? apiRequest.getMyPackages(user.id)
      : apiRequest.getPackages();

    fetchFn
      .then(res => setPackages(res.data))
      .catch(err => console.error("Failed to load packages:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPackages(); }, [user]);

  // FIX: deactivate handler — was not wired up at all; agency had no way to
  // deactivate a package from the UI even though the backend supports it.
  const handleDeactivate = async (pkgId) => {
    if (!window.confirm("Deactivate this package? It will no longer appear for travelers.")) return;
    setDeactivating(pkgId);
    try {
      await apiRequest.deactivate(pkgId);
      // Refresh list so the INACTIVE badge shows immediately
      loadPackages();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to deactivate package.");
    } finally {
      setDeactivating(null);
    }
  };

  const filtered = packages.filter(pkg =>
    pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="content-area flex items-center justify-center" style={{ minHeight: 300 }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div className="content-area">
      <div className="flex justify-between items-center mb-12">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold text-white"
        >
          {user?.role === "AGENCY" ? "My Trip Packages" : "Explore the World"}
        </motion.h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search destination..."
            className="form-input w-80 shadow-2xl pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3.5 opacity-40">🔍</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-md p-20 rounded-[40px] text-center border border-white/20"
        >
          <p className="text-white text-2xl font-light">
            {user?.role === "AGENCY"
              ? "You haven't posted any packages yet. Use 'Post New Trip' to get started."
              : "No destinations match your search."}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -10 }}
                className="package-card group bg-white p-4 rounded-[32px] shadow-2xl"
              >
                <div className="relative h-60 overflow-hidden rounded-2xl mb-6">
                  <img
                    src={pkg.imageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="destination"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-gray-900">
                    {pkg.availableSlots} SLOTS LEFT
                  </div>
                  {!pkg.active && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black">
                      INACTIVE
                    </div>
                  )}
                </div>

                <div className="px-2">
                  <h3 className="text-2xl font-bold text-gray-800 leading-tight">{pkg.title}</h3>
                  <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-1">{pkg.destination}</p>
                  {pkg.travelDate && (
                    <p className="text-gray-400 text-xs mt-1">📅 {pkg.travelDate}</p>
                  )}

                  <div className="mt-8 flex justify-between items-end border-t border-gray-100 pt-6">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Starting from</p>
                      <p className="text-3xl font-black text-gray-900">₹{pkg.price?.toLocaleString()}</p>
                    </div>

                    {/* FIX: Agency gets a working Deactivate button; others just see a label */}
                    {user?.role === "AGENCY" ? (
                      pkg.active ? (
                        <button
                          onClick={() => handleDeactivate(pkg.id)}
                          disabled={deactivating === pkg.id}
                          style={{
                            padding: "8px 16px", borderRadius: 12,
                            background: "#fee2e2", color: "#dc2626",
                            border: "none", fontSize: "0.8rem", fontWeight: 700,
                            cursor: "pointer", transition: "all 0.18s"
                          }}
                        >
                          {deactivating === pkg.id ? "..." : "Deactivate"}
                        </button>
                      ) : (
                        <span style={{
                          padding: "8px 16px", borderRadius: 12,
                          background: "#f1f5f9", color: "#94a3b8",
                          fontSize: "0.8rem", fontWeight: 700
                        }}>
                          Inactive
                        </span>
                      )
                    ) : (
                      <span className="px-4 py-2 rounded-2xl text-sm font-bold bg-gray-100 text-gray-500 cursor-default">
                        View Trip
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PackageList;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../api';

const Dashboard = ({ user }) => {
  const role = user?.role || "USER";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === "USER") {
          const res = await apiRequest.getMyBookings(user.id);
          const bookings = res.data;
          const confirmed  = bookings.filter(b => b.status === "CONFIRMED").length;
          const pending    = bookings.filter(b => b.status === "PENDING").length;
          const totalSpent = bookings
            .filter(b => b.status === "CONFIRMED")
            .reduce((sum, b) => sum + (b.finalPrice || b.totalPrice || 0), 0);

          setStats([
            { label: "Confirmed Trips",  value: confirmed, color: "text-emerald-500" },
            { label: "Pending Bookings", value: pending,   color: "text-yellow-500" },
            { label: "Total Spent",      value: `₹${totalSpent.toLocaleString()}`, color: "text-indigo-500" },
          ]);
        } else if (role === "AGENCY") {
          // FIX: was calling apiRequest.getAllBookings() which returns ALL bookings
          // and then trying to client-filter by createdBy — fragile. Use the
          // dedicated agency endpoint so only this agency's bookings are returned.
          const [pkgRes, bookRes] = await Promise.all([
            apiRequest.getMyPackages(user.id),
            apiRequest.getBookingsByAgency(user.id),
          ]);
          const myPackages = pkgRes.data;
          const myBookings = bookRes.data;
          const revenue = myBookings
            .filter(b => b.status === "CONFIRMED")
            .reduce((sum, b) => sum + (b.finalPrice || b.totalPrice || 0), 0);

          setStats([
            { label: "Active Packages",    value: myPackages.filter(p => p.active).length, color: "text-orange-500" },
            { label: "Total Reservations", value: myBookings.length, color: "text-blue-500" },
            { label: "Revenue Earned",     value: `₹${revenue.toLocaleString()}`, color: "text-emerald-500" },
          ]);
        } else if (role === "ADMIN") {
          const [userRes, pkgRes, bookRes] = await Promise.all([
            apiRequest.getUsers(),
            apiRequest.getPackages(),
            apiRequest.getAllBookings(),
          ]);
          setStats([
            { label: "Total Users",    value: userRes.data.length,  color: "text-purple-500" },
            { label: "Live Packages",  value: pkgRes.data.filter(p => p.active).length, color: "text-pink-500" },
            { label: "Total Bookings", value: bookRes.data.length,  color: "text-emerald-500" },
          ]);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, role]);

  return (
    <div className="content-area">
      <div className="dashboard-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-bold text-white mb-4">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            {role === "ADMIN"  ? "System overview and user management panel." :
             role === "AGENCY" ? "Manage your tour packages and track your bookings." :
             "Where would you like to fly to next?"}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="trip-card p-10" style={{ opacity: 0.5 }}>
              <div style={{ width: 80, height: 60, background: "#e2e8f0", borderRadius: 12, marginBottom: 12 }} />
              <div style={{ width: 120, height: 16, background: "#e2e8f0", borderRadius: 8 }} />
            </div>
          ))
        ) : (
          (stats || []).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="trip-card p-10 flex flex-col items-center justify-center text-center"
            >
              <span className={`text-6xl font-black mb-2 ${item.color}`}>{item.value}</span>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{item.label}</span>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 40, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "28px 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap"
        }}
      >
        <div>
          <p style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
            {role === "AGENCY" ? "📦 Ready to post a new trip?" :
             role === "ADMIN"  ? "👥 Need to manage users?" :
             "🗺️ Ready for your next adventure?"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", margin: "4px 0 0", fontSize: "0.9rem" }}>
            {role === "AGENCY" ? "Use 'Post New Trip' in the sidebar to get started." :
             role === "ADMIN"  ? "Visit 'Manage Users' to view and control all accounts." :
             "Browse packages and book your next trip from the sidebar."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
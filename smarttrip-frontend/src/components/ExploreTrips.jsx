import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../api';

const ExploreTrips = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Uses centralized API request
    apiRequest.getPackages()
      .then(res => setPackages(res.data))
      .catch(err => console.error("Could not load trips"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = packages.filter(p => 
    p.destination?.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content-area">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-white">Discover</h1>
        <input
          type="text"
          placeholder="Search destinations..."
          className="form-input w-80 shadow-2xl"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="packages-grid">
        {filtered.map((pkg) => (
          <motion.div key={pkg.id} whileHover={{ y: -10 }} className="package-card group">
            <div className="h-48 rounded-2xl overflow-hidden mb-4">
               <img src={pkg.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} className="w-full h-full object-cover" alt="trip"/>
            </div>
            <h3 className="text-2xl font-bold">{pkg.title}</h3>
            <p className="text-emerald-600 font-bold uppercase text-xs tracking-widest">{pkg.destination}</p>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="text-3xl font-black">₹{pkg.price}</span>
              <button className="btn px-6 py-2 rounded-lg">View</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreTrips;
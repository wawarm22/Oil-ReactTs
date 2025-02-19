import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../assets/css/oil-loader.css";

const OilDropletLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="oil-container">
      <motion.div
        className="oil-droplet"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
      />
      <div className="oil-tank">
        <motion.div
          className="oil-level"
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="loading-text">{progress}%</p>
    </div>
  );
};

export default OilDropletLoader;

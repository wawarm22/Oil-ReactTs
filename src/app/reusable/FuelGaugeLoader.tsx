
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../assets/css/fuel-loader.css";

const FuelGaugeLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fuel-gauge-container">
      <div className="fuel-gauge">
        <motion.div
          className="fuel-gauge-indicator"
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="fuel-labels">
        <span>E</span>
        <span>F</span>
      </div>
      <p className="loading-text">{progress}%</p>
    </div>
  );
};

export default FuelGaugeLoader;

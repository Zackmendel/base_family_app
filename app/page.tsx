"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to FamFunds</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your collaborative family financial management platform
        </p>
      </motion.div>
    </div>
  );
}

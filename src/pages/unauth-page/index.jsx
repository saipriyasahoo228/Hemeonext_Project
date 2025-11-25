import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function UnauthPage() {
  // Animation variants for staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#2c3e50] dark:bg-[#1a252f] overflow-hidden">
      <div className="w-[96%] mx-auto min-h-screen bg-gradient-to-br rounded-[50px] shadow-2xl overflow-hidden border-4 border-[#d4a373]/30 p-6 from-[#f7e4bc] via-[#f9e7c9] to-[#fce8d2] dark:from-[#2a4066] dark:via-[#34495e] dark:to-[#4a698a]">
        <motion.div
          className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center max-w-md w-full bg-white/90 dark:bg-[#2c3e50]/90 backdrop-blur-md rounded-[30px] shadow-2xl p-8 border border-[#d4a373]/50">
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <Lock className="h-16 w-16 text-[#d4a373]" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-[#f7e4bc] mb-4"
            >
              Unauthorized Access
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 mb-8"
            >
              Sorry, you don’t have permission to view this page. Please log in with an authorized account or return to the homepage.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <Button
                  className="w-full sm:w-auto bg-[#d4a373] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#c68e5e] transition-colors duration-300 hover:scale-105"
                >
                  Back to Home
                </Button>
              </Link>
              {/* <Link to="/auth/login">
                <Button
                  className="w-full sm:w-auto bg-transparent border border-[#d4a373] text-[#d4a373] px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#d4a373] hover:text-white transition-colors duration-300 hover:scale-105"
                >
                  Login
                </Button>
              </Link> */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UnauthPage;
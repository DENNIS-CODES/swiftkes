import { motion } from "framer-motion";

interface SuccessCheckmarkProps {
  size?: number;
}

export function SuccessCheckmark({ size = 80 }: SuccessCheckmarkProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <motion.circle
          cx="40"
          cy="40"
          r="38"
          className="stroke-success"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Checkmark */}
        <motion.path
          d="M24 42L34 52L56 28"
          className="stroke-success"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        />
      </svg>
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-success"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1, repeat: 1 }}
      />
    </motion.div>
  );
}

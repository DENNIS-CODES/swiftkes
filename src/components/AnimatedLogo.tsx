import { motion } from "framer-motion";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const sizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl md:text-6xl",
};

export function AnimatedLogo({ className = "", size = "lg", showTagline = false }: AnimatedLogoProps) {
  return (
    <motion.div 
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 12,
      }}
    >
      <div className={`font-lexend font-bold tracking-tight ${sizes[size]}`}>
        <span className="text-primary">Swift</span>
        <span className="text-accent">Kes</span>
      </div>
      {showTagline && (
        <motion.p 
          className="text-muted-foreground text-sm md:text-base mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Send money to Kenya instantly
        </motion.p>
      )}
    </motion.div>
  );
}

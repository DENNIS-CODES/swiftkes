import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant: "deposit" | "receive" | "send";
  onClick: () => void;
  delay?: number;
}

const variants = {
  deposit: "gradient-hero text-primary-foreground",
  receive: "bg-secondary text-secondary-foreground border border-border",
  send: "gradient-accent text-accent-foreground",
};

const iconBg = {
  deposit: "bg-primary-foreground/20",
  receive: "bg-primary/10",
  send: "bg-accent-foreground/20",
};

export function FeatureTile({ 
  icon: Icon, 
  title, 
  description, 
  variant, 
  onClick, 
  delay = 0 
}: FeatureTileProps) {
  return (
    <motion.button
      className={`feature-tile w-full text-left ${variants[variant]}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${title}: ${description}`}
    >
      <div className={`w-12 h-12 rounded-xl ${iconBg[variant]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
      
      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
    </motion.button>
  );
}

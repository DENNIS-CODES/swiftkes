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
      className={`relative overflow-hidden rounded-xl p-3 transition-all text-left ${variants[variant]}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${title}: ${description}`}
    >
      <div className={`w-9 h-9 rounded-lg ${iconBg[variant]} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>
      <h3 className="font-semibold text-sm mb-0.5">{title}</h3>
      <p className="text-[10px] opacity-80">{description}</p>
      
      {/* Decorative element */}
      <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10 blur-xl" />
    </motion.button>
  );
}

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "secondary" | "accent";
  onClick: () => void;
  className?: string;
}

const variants = {
  primary: "gradient-hero text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  accent: "gradient-accent text-accent-foreground hover:opacity-90",
};

export function ActionButton({
  icon: Icon,
  label,
  variant = "primary",
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        className={cn(
          "w-full h-14 text-base font-medium rounded-xl touch-target",
          variants[variant],
          className
        )}
        aria-label={label}
      >
        <Icon className="w-5 h-5 mr-2" />
        {label}
      </Button>
    </motion.div>
  );
}

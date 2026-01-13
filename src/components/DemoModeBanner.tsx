import { motion } from "framer-motion";
import { Beaker, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DemoModeBannerProps {
  onAddFunds: (amount: number) => void;
}

export function DemoModeBanner({ onAddFunds }: DemoModeBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open demo controls"
      >
        <Beaker className="w-5 h-5 text-accent-foreground" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-accent/30 rounded-2xl p-4 shadow-glow-accent"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">Demo Mode</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => setIsExpanded(false)}
          aria-label="Minimize demo controls"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        Add test funds to try all features
      </p>
      
      <div className="flex gap-2">
        {[100, 500, 1000].map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onAddFunds(amount)}
          >
            <Plus className="w-3 h-3 mr-1" />
            ${amount}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

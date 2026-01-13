import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Wallet } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

export function BalanceDisplay({ balance, currency = "USD", isLoading = false }: BalanceDisplayProps) {
  return (
    <motion.div 
      className="gradient-hero text-primary-foreground rounded-3xl p-6 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Available Balance</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium opacity-80">{currency}</span>
          {isLoading ? (
            <div className="h-10 w-32 bg-white/20 rounded animate-gentle-pulse" />
          ) : (
            <span className="text-4xl font-bold">
              <CountUp
                end={balance}
                decimals={2}
                duration={1.5}
                separator=","
                prefix=""
              />
            </span>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
          <span className="opacity-80">≈ KES {(balance * 152.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="bg-highlight/20 text-highlight px-2 py-0.5 rounded-full text-xs font-medium">
            1.5% fee
          </span>
        </div>
      </div>
    </motion.div>
  );
}

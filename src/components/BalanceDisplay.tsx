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
      className="gradient-hero text-primary-foreground rounded-2xl p-4 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <Wallet className="w-4 h-4 opacity-80" />
          <span className="text-xs font-medium opacity-80">Available Balance</span>
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium opacity-80">{currency}</span>
          {isLoading ? (
            <div className="h-8 w-24 bg-white/20 rounded animate-gentle-pulse" />
          ) : (
            <span className="text-3xl font-bold">
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
        
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="opacity-80">≈ KES {(balance * 152.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="bg-highlight/20 text-highlight px-1.5 py-0.5 rounded-full text-[10px] font-medium">
            1.5% fee
          </span>
        </div>
      </div>
    </motion.div>
  );
}

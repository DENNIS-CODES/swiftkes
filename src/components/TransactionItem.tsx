import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from "lucide-react";
import CountUp from "react-countup";

interface TransactionItemProps {
  type: "sent" | "received" | "deposit";
  amount: number;
  currency: string;
  recipient: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  delay?: number;
  showCountUp?: boolean;
}

const typeConfig = {
  sent: {
    icon: ArrowUpRight,
    color: "text-destructive",
    bg: "bg-destructive/10",
    prefix: "-",
  },
  received: {
    icon: ArrowDownLeft,
    color: "text-success",
    bg: "bg-success/10",
    prefix: "+",
  },
  deposit: {
    icon: ArrowDownLeft,
    color: "text-primary",
    bg: "bg-primary/10",
    prefix: "+",
  },
};

export function TransactionItem({
  type,
  amount,
  currency,
  recipient,
  timestamp,
  status,
  delay = 0,
  showCountUp = false,
}: TransactionItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{recipient}</p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${config.color}`}>
          {config.prefix}
          {showCountUp ? (
            <CountUp end={amount} decimals={2} duration={1} />
          ) : (
            amount.toFixed(2)
          )}{" "}
          {currency}
        </p>
        {status === "completed" && (
          <div className="flex items-center gap-1 text-xs text-success justify-end">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

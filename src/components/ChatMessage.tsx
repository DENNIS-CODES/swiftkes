import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export function ChatMessage({ message, isUser, timestamp, status = "read" }: ChatMessageProps) {
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? "chat-bubble-user shadow-soft"
            : "chat-bubble-bot border border-border"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            isUser ? "text-primary-foreground/60 justify-end" : "text-muted-foreground"
          }`}
        >
          <span>{timestamp}</span>
          {isUser && (
            status === "read" ? (
              <CheckCheck className="w-3.5 h-3.5 text-highlight" />
            ) : status === "delivered" ? (
              <CheckCheck className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

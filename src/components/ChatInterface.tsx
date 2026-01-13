import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  onTransactionComplete?: (tx: { amount: number; recipient: string }) => void;
}

const BOT_RESPONSES: Record<string, string> = {
  greeting: `👋 Welcome to SwiftKes!

I can help you send money to Kenya instantly. Just tell me what you'd like to do:

• "Send 100 USD to +254712345678"
• "Check my balance"
• "Show exchange rate"`,
  
  send_intent: `Great! I'll help you send money. Here's a summary:

💰 Amount: {amount} USD
📱 Recipient: {recipient}
💱 Rate: 1 USD = 152.50 KES
📤 They receive: ~{kesAmount} KES
💳 Fee: 1.5% ({fee} USD)

Please select the recipient's preferred method:`,
  
  verification: `For your security, I've sent a 6-digit OTP to your phone. Please enter it to confirm this transaction.`,
  
  confirmed: `✅ Transaction Confirmed!

🎉 {amount} USD sent to {recipient}

Transaction ID: SW-{txId}
They'll receive {kesAmount} KES via M-Pesa within 30 seconds.

Need anything else?`,
  
  balance: `💰 Your current balance:
  
USDC: {usdBalance} USD
≈ KES {kesBalance}

Available for instant withdrawal to M-Pesa.`,
  
  rate: `📊 Current Exchange Rate:

1 USD = 152.50 KES
Last updated: just now

SwiftKes fee: 1.5% (lowest in market!)`,
};

export function ChatInterface({ onTransactionComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: BOT_RESPONSES.greeting,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<"idle" | "awaiting_method" | "awaiting_otp" | "processing">("idle");
  const [pendingTx, setPendingTx] = useState<{ amount: number; recipient: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const lowerInput = input.toLowerCase();
    setInput("");

    // Parse user intent
    if (conversationState === "awaiting_method") {
      if (lowerInput.includes("mpesa") || lowerInput.includes("m-pesa") || lowerInput === "1") {
        addBotMessage(BOT_RESPONSES.verification);
        setConversationState("awaiting_otp");
      } else if (lowerInput.includes("bank") || lowerInput === "2") {
        addBotMessage("Bank transfers take 1-2 business days. For instant delivery, choose M-Pesa!\n\nReply '1' for M-Pesa or '2' to continue with Bank.");
      }
    } else if (conversationState === "awaiting_otp") {
      // Any 6 digit code works for demo
      if (/^\d{6}$/.test(input.trim())) {
        setConversationState("processing");
        setIsTyping(true);
        setTimeout(() => {
          const txId = Math.random().toString(36).substring(2, 10).toUpperCase();
          const kesAmount = pendingTx ? Math.round(pendingTx.amount * 152.5) : 15250;
          const response = BOT_RESPONSES.confirmed
            .replace("{amount}", pendingTx?.amount.toString() || "100")
            .replace("{recipient}", pendingTx?.recipient || "+254712345678")
            .replace("{txId}", txId)
            .replace("{kesAmount}", kesAmount.toLocaleString());
          
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: response,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setIsTyping(false);
          setConversationState("idle");
          
          if (pendingTx && onTransactionComplete) {
            onTransactionComplete(pendingTx);
          }
          setPendingTx(null);
        }, 2000);
      } else {
        addBotMessage("Please enter the 6-digit code I sent to your phone. (Hint: try 123456 for demo)");
      }
    } else if (lowerInput.includes("send") && /\d+/.test(lowerInput)) {
      // Parse send command
      const amountMatch = lowerInput.match(/(\d+)\s*(usd|dollars?)?/i);
      const phoneMatch = lowerInput.match(/\+?\d{10,12}/);
      
      const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
      const recipient = phoneMatch ? phoneMatch[0] : "+254712345678";
      const kesAmount = Math.round(amount * 152.5);
      const fee = (amount * 0.015).toFixed(2);
      
      setPendingTx({ amount, recipient });
      
      const response = BOT_RESPONSES.send_intent
        .replace("{amount}", amount.toString())
        .replace("{recipient}", recipient)
        .replace("{kesAmount}", kesAmount.toLocaleString())
        .replace("{fee}", fee);
      
      addBotMessage(response + "\n\n1️⃣ M-Pesa (Instant)\n2️⃣ Bank Transfer (1-2 days)");
      setConversationState("awaiting_method");
    } else if (lowerInput.includes("balance")) {
      const response = BOT_RESPONSES.balance
        .replace("{usdBalance}", "250.00")
        .replace("{kesBalance}", "38,125");
      addBotMessage(response);
    } else if (lowerInput.includes("rate") || lowerInput.includes("exchange")) {
      addBotMessage(BOT_RESPONSES.rate);
    } else {
      addBotMessage("I can help you:\n\n• Send money (e.g., 'Send 50 USD to +254700123456')\n• Check your balance\n• View exchange rates\n\nWhat would you like to do?");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">SwiftKes Assistant</h3>
          <p className="text-xs text-muted-foreground">
            {isTyping ? "typing..." : "Online • Ready to help"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="flex items-center gap-2 text-muted-foreground text-sm p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SwiftKes is typing...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background"
            disabled={conversationState === "processing"}
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || conversationState === "processing"}
            className="gradient-hero hover:opacity-90 transition-opacity touch-target"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

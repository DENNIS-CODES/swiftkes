import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, Sparkles } from "lucide-react";
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
  balance?: number;
}

// Simple AI-like response generation
const generateAIResponse = (input: string, balance: number): { response: string; intent: string } => {
  const lowerInput = input.toLowerCase();
  
  // Intent detection
  if (lowerInput.includes("send") && /\d+/.test(lowerInput)) {
    const amountMatch = lowerInput.match(/(\d+)\s*(usd|dollars?)?/i);
    const phoneMatch = lowerInput.match(/\+?\d{10,12}/);
    const emailMatch = lowerInput.match(/[\w.-]+@[\w.-]+\.\w+/);
    
    const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
    const recipient = emailMatch ? emailMatch[0] : (phoneMatch ? phoneMatch[0] : "+254712345678");
    const kesAmount = Math.round(amount * 152.5);
    const fee = (amount * 0.015).toFixed(2);
    
    if (amount > balance) {
      return {
        response: `❌ Insufficient balance!\n\nYou're trying to send $${amount} but your balance is only $${balance.toFixed(2)}.\n\nWould you like to:\n• Send a smaller amount\n• Add funds to your wallet first`,
        intent: "insufficient_funds"
      };
    }
    
    return {
      response: `🤖 AI Analysis Complete!\n\n💰 Amount: $${amount} USD\n📱 Recipient: ${recipient}\n💱 Rate: 1 USD = 152.50 KES\n📤 They receive: ~KES ${kesAmount.toLocaleString()}\n💳 Fee: 1.5% ($${fee})\n\nPlease select the delivery method:\n\n1️⃣ M-Pesa (Instant)\n2️⃣ Bank Transfer (1-2 days)`,
      intent: "send_intent"
    };
  }
  
  if (lowerInput.includes("balance") || lowerInput.includes("how much")) {
    const kesBalance = Math.round(balance * 152.5);
    return {
      response: `💰 Your Current Balance:\n\n🇺🇸 USD: $${balance.toFixed(2)}\n🇰🇪 KES: ≈${kesBalance.toLocaleString()}\n\n📊 Today's rate: 1 USD = 152.50 KES\n✨ Available for instant M-Pesa withdrawal`,
      intent: "balance"
    };
  }
  
  if (lowerInput.includes("rate") || lowerInput.includes("exchange") || lowerInput.includes("convert")) {
    return {
      response: `📊 Live Exchange Rates:\n\n🔄 1 USD = 152.50 KES\n🔄 1 EUR = 165.30 KES\n🔄 1 GBP = 192.80 KES\n\n⏱️ Updated: just now\n💎 SwiftKes fee: Only 1.5%\n\n💡 Tip: Say "Send 50 USD to +254712345678" to start a transfer!`,
      intent: "rate"
    };
  }
  
  if (lowerInput.includes("help") || lowerInput.includes("what can")) {
    return {
      response: `🤖 I'm your AI-powered assistant!\n\nHere's what I can help with:\n\n💸 Send Money\n"Send 100 USD to +254712345678"\n"Transfer $50 to john@email.com"\n\n💰 Check Balance\n"What's my balance?"\n"How much do I have?"\n\n📊 Exchange Rates\n"Show exchange rate"\n"Convert 100 USD to KES"\n\n❓ Just type naturally and I'll understand!`,
      intent: "help"
    };
  }
  
  if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("hey")) {
    return {
      response: `👋 Hey there! Welcome to SwiftKes!\n\nI'm your AI assistant, ready to help you send money to Kenya instantly.\n\n💡 Try saying:\n• "Send 100 USD to +254712345678"\n• "Check my balance"\n• "What's the exchange rate?"\n\nHow can I help you today?`,
      intent: "greeting"
    };
  }
  
  // Default intelligent response
  return {
    response: `🤖 I understood you said: "${input}"\n\nI can help you with:\n\n• 💸 Sending money (e.g., "Send 50 USD to +254700123456")\n• 💰 Checking your balance\n• 📊 Viewing exchange rates\n\nWhat would you like to do?`,
    intent: "unknown"
  };
};

export function ChatInterface({ onTransactionComplete, balance = 250 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `👋 Welcome to SwiftKes AI!\n\nI'm your intelligent assistant powered by AI. I can help you:\n\n• 💸 Send money with natural language\n• 💰 Check your balance\n• 📊 Get live exchange rates\n\n💡 Try: "Send 100 USD to +254712345678"`,
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

    // Handle conversation states
    if (conversationState === "awaiting_method") {
      if (lowerInput.includes("mpesa") || lowerInput.includes("m-pesa") || lowerInput === "1") {
        addBotMessage("🔐 For your security, I've sent a 6-digit OTP to your phone.\n\nPlease enter the code to confirm this transaction.\n\n💡 Hint: Try 123456 for demo");
        setConversationState("awaiting_otp");
      } else if (lowerInput.includes("bank") || lowerInput === "2") {
        addBotMessage("🏦 Bank Transfer Selected\n\nBank transfers take 1-2 business days.\n\nFor instant delivery, reply '1' for M-Pesa!\n\n1️⃣ M-Pesa (Instant)\n2️⃣ Continue with Bank");
      }
      return;
    }
    
    if (conversationState === "awaiting_otp") {
      if (/^\d{6}$/.test(input.trim())) {
        setConversationState("processing");
        setIsTyping(true);
        setTimeout(() => {
          const txId = Math.random().toString(36).substring(2, 10).toUpperCase();
          const kesAmount = pendingTx ? Math.round(pendingTx.amount * 152.5) : 15250;
          
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `✅ Transaction Successful!\n\n🎉 $${pendingTx?.amount} sent to ${pendingTx?.recipient}\n\n📋 Transaction ID: SW-${txId}\n💰 Recipient gets: KES ${kesAmount.toLocaleString()}\n📱 Delivery: M-Pesa (within 30 seconds)\n\n🧾 Receipt sent to your email.\n\nNeed anything else?`,
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
        return;
      } else {
        addBotMessage("❌ Invalid OTP. Please enter the 6-digit code.\n\n💡 Hint: Try 123456 for demo");
        return;
      }
    }

    // Parse with AI
    const { response, intent } = generateAIResponse(input, balance);
    
    if (intent === "send_intent") {
      // Extract transaction details
      const amountMatch = lowerInput.match(/(\d+)\s*(usd|dollars?)?/i);
      const phoneMatch = lowerInput.match(/\+?\d{10,12}/);
      const emailMatch = lowerInput.match(/[\w.-]+@[\w.-]+\.\w+/);
      
      const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
      const recipient = emailMatch ? emailMatch[0] : (phoneMatch ? phoneMatch[0] : "+254712345678");
      
      setPendingTx({ amount, recipient });
      setConversationState("awaiting_method");
    }
    
    addBotMessage(response);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center relative">
          <Bot className="w-5 h-5 text-primary-foreground" />
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm flex items-center gap-1.5">
            SwiftKes AI
            <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-medium">
              AI
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {isTyping ? "typing..." : "Online • Ready to help"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
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
            className="flex items-center gap-2 text-muted-foreground text-xs px-3 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>AI is thinking...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-card">
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
            placeholder="Ask AI anything..."
            className="flex-1 bg-background text-sm h-10"
            disabled={conversationState === "processing"}
            aria-label="Message input"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || conversationState === "processing"}
            className="gradient-hero hover:opacity-90 transition-opacity h-10 w-10"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

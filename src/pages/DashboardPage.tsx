import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Send, Download, Plus, QrCode, ArrowDownLeft, Sparkles } from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { ActionButton } from "@/components/ActionButton";
import { TransactionItem } from "@/components/TransactionItem";
import { ChatInterface } from "@/components/ChatInterface";
import { SendDrawer } from "@/components/SendDrawer";
import { DepositDrawer } from "@/components/DepositDrawer";
import { ReceiveDrawer } from "@/components/ReceiveDrawer";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { Navigation } from "@/components/Navigation";
import { FeatureTile } from "@/components/FeatureTile";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: "sent" | "received" | "deposit";
  amount: number;
  currency: string;
  recipient: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export default function DashboardPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    (location.state as { initialTab?: string })?.initialTab === "chat" ? "chat" : "home"
  );
  const [balance, setBalance] = useState(250.0);
  const [showSendDrawer, setShowSendDrawer] = useState(false);
  const [showDepositDrawer, setShowDepositDrawer] = useState(false);
  const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "sent",
      amount: 50,
      currency: "USD",
      recipient: "+254712345678",
      timestamp: "Today, 2:30 PM",
      status: "completed",
    },
    {
      id: "2",
      type: "deposit",
      amount: 200,
      currency: "USD",
      recipient: "Google Pay",
      timestamp: "Yesterday, 10:15 AM",
      status: "completed",
    },
    {
      id: "3",
      type: "sent",
      amount: 100,
      currency: "USD",
      recipient: "+254700123456",
      timestamp: "Jan 10, 4:45 PM",
      status: "completed",
    },
  ]);

  const handleSend = (amount: number, recipient: string) => {
    setBalance((prev) => prev - amount - amount * 0.015);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: "sent",
        amount,
        currency: "USD",
        recipient,
        timestamp: "Just now",
        status: "completed",
      },
      ...prev,
    ]);
  };

  const handleDeposit = (amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: "deposit",
        amount,
        currency: "USD",
        recipient: "Card Deposit",
        timestamp: "Just now",
        status: "completed",
      },
      ...prev,
    ]);
  };

  const handleDemoAddFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: "deposit",
        amount,
        currency: "USD",
        recipient: "Demo Funds",
        timestamp: "Just now",
        status: "completed",
      },
      ...prev,
    ]);
  };

  const handleChatTransaction = (tx: { amount: number; recipient: string }) => {
    handleSend(tx.amount, tx.recipient);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Home Tab */}
      {activeTab === "home" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <AnimatedLogo size="sm" />
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Scan QR code"
              onClick={() => setShowReceiveDrawer(true)}
            >
              <QrCode className="w-5 h-5" />
            </Button>
          </div>

          {/* Balance */}
          <div className="mb-4">
            <BalanceDisplay balance={balance} />
          </div>

          {/* Feature Tiles */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <FeatureTile
              icon={Plus}
              title="Deposit"
              description="Add funds"
              variant="deposit"
              onClick={() => setShowDepositDrawer(true)}
              delay={0.1}
            />
            <FeatureTile
              icon={ArrowDownLeft}
              title="Receive"
              description="Get paid"
              variant="receive"
              onClick={() => setShowReceiveDrawer(true)}
              delay={0.2}
            />
            <FeatureTile
              icon={Send}
              title="Send"
              description="Transfer"
              variant="send"
              onClick={() => setShowSendDrawer(true)}
              delay={0.3}
            />
          </div>

          {/* AI Chat Banner */}
          <motion.button
            onClick={() => setActiveTab("chat")}
            className="w-full p-3 mb-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">AI-Powered Assistant</p>
              <p className="text-xs text-muted-foreground">Send money with natural language</p>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
              NEW
            </div>
          </motion.button>

          {/* Recent transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Recent Activity</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary text-xs h-8"
                onClick={() => setActiveTab("history")}
              >
                View all
              </Button>
            </div>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx, index) => (
                <TransactionItem
                  key={tx.id}
                  {...tx}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="h-[calc(100vh-64px)]">
          <ChatInterface onTransactionComplete={handleChatTransaction} balance={balance} />
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3"
        >
          <h1 className="text-xl font-bold mb-4">Transaction History</h1>
          <div className="space-y-2">
            {transactions.map((tx, index) => (
              <TransactionItem
                key={tx.id}
                {...tx}
                delay={index * 0.05}
                showCountUp={tx.timestamp === "Just now"}
              />
            ))}
          </div>
          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs">Your history will appear here</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3"
        >
          <h1 className="text-xl font-bold mb-4">Profile</h1>
          
          <div className="space-y-3">
            <div className="p-3 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-xl font-bold text-primary-foreground">
                  JD
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-xs text-muted-foreground">+1 234 567 8900</p>
                  <p className="text-xs text-muted-foreground">john.doe@email.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-xl">
              <h3 className="font-medium text-sm mb-2">Account Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-medium">Mock Verified</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Demo account • Full features enabled
              </p>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-xl space-y-2">
              <h3 className="font-medium text-sm">Settings</h3>
              {["Notifications", "Security", "Payment Methods", "Help & Support"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Drawers */}
      <SendDrawer
        isOpen={showSendDrawer}
        onClose={() => setShowSendDrawer(false)}
        balance={balance}
        onSend={handleSend}
      />
      <DepositDrawer
        isOpen={showDepositDrawer}
        onClose={() => setShowDepositDrawer(false)}
        onDeposit={handleDeposit}
      />
      <ReceiveDrawer
        isOpen={showReceiveDrawer}
        onClose={() => setShowReceiveDrawer(false)}
      />

      {/* Demo mode banner */}
      {activeTab !== "chat" && (
        <DemoModeBanner onAddFunds={handleDemoAddFunds} />
      )}
    </div>
  );
}

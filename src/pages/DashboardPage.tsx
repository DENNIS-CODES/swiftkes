import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Send, Download, Plus, QrCode } from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { ActionButton } from "@/components/ActionButton";
import { TransactionItem } from "@/components/TransactionItem";
import { ChatInterface } from "@/components/ChatInterface";
import { SendDrawer } from "@/components/SendDrawer";
import { DepositDrawer } from "@/components/DepositDrawer";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { Navigation } from "@/components/Navigation";
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
          className="p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <AnimatedLogo size="sm" />
            <Button variant="ghost" size="icon" aria-label="Scan QR code">
              <QrCode className="w-5 h-5" />
            </Button>
          </div>

          {/* Balance */}
          <div className="mb-6">
            <BalanceDisplay balance={balance} />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <ActionButton
              icon={Plus}
              label="Add Money"
              variant="secondary"
              onClick={() => setShowDepositDrawer(true)}
            />
            <ActionButton
              icon={Send}
              label="Send"
              variant="accent"
              onClick={() => setShowSendDrawer(true)}
            />
          </div>

          {/* Recent transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Activity</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => setActiveTab("history")}
              >
                View all
              </Button>
            </div>
            <div className="space-y-3">
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
          <ChatInterface onTransactionComplete={handleChatTransaction} />
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
          <div className="space-y-3">
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
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-lg">John Doe</p>
                  <p className="text-sm text-muted-foreground">+1 234 567 8900</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-card border border-border rounded-xl">
              <h3 className="font-medium mb-3">Account Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-success font-medium">Mock Verified</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Demo account • Full features enabled
              </p>
            </div>
            
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <h3 className="font-medium">Settings</h3>
              {["Notifications", "Security", "Payment Methods", "Help & Support"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Demo mode banner */}
      {activeTab !== "chat" && (
        <DemoModeBanner onAddFunds={handleDemoAddFunds} />
      )}
    </div>
  );
}

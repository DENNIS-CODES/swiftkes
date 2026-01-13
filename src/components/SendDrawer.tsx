import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Smartphone, Building2, Loader2, Phone, Mail, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuccessCheckmark } from "./SuccessCheckmark";

interface SendDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSend: (amount: number, recipient: string) => void;
}

type Step = "amount" | "recipient" | "method" | "confirm" | "processing" | "success";
type RecipientType = "phone" | "email";

export function SendDrawer({ isOpen, onClose, balance, onSend }: SendDrawerProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("phone");
  const [method, setMethod] = useState<"mpesa" | "bank" | null>(null);

  const kesAmount = parseFloat(amount || "0") * 152.5;
  const fee = parseFloat(amount || "0") * 0.015;

  const isValidRecipient = () => {
    if (recipientType === "phone") {
      return recipient.replace(/\D/g, "").length >= 10;
    } else {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
    }
  };

  const handleSubmit = () => {
    if (step === "amount" && parseFloat(amount) > 0 && parseFloat(amount) <= balance) {
      setStep("recipient");
    } else if (step === "recipient" && isValidRecipient()) {
      setStep("method");
    } else if (step === "method" && method) {
      setStep("confirm");
    } else if (step === "confirm") {
      setStep("processing");
      setTimeout(() => {
        setStep("success");
        onSend(parseFloat(amount), recipient);
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setRecipient("");
    setRecipientType("phone");
    setMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-xl font-semibold">Send Money</h2>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-8">
              <AnimatePresence mode="wait">
                {step === "amount" && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl h-14 mt-2"
                        autoFocus
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Available: ${balance.toFixed(2)} USD
                      </p>
                    </div>
                    
                    {parseFloat(amount) > 0 && (
                      <div className="p-4 bg-secondary rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Recipient gets</span>
                          <span className="font-medium">KES {kesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fee (1.5%)</span>
                          <span className="font-medium">${fee.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-14 gradient-accent text-accent-foreground font-medium text-base"
                      disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
                
                {step === "recipient" && (
                  <motion.div
                    key="recipient"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {/* Recipient Type Toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => { setRecipientType("phone"); setRecipient(""); }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          recipientType === "phone" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        Phone
                      </button>
                      <button
                        onClick={() => { setRecipientType("email"); setRecipient(""); }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          recipientType === "email" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>

                    <div>
                      <Label htmlFor="recipient">
                        {recipientType === "phone" ? "Phone Number" : "Email Address"}
                      </Label>
                      <Input
                        id="recipient"
                        type={recipientType === "phone" ? "tel" : "email"}
                        placeholder={recipientType === "phone" ? "+254 7XX XXX XXX" : "recipient@email.com"}
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="text-base h-12 mt-2"
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {recipientType === "phone" 
                          ? "Enter the recipient's phone number" 
                          : "Enter the recipient's email address"}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-12 gradient-accent text-accent-foreground font-medium text-sm"
                      disabled={!isValidRecipient()}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
                
                {step === "method" && (
                  <motion.div
                    key="method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-muted-foreground">How should they receive the money?</p>
                    
                    <button
                      onClick={() => setMethod("mpesa")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        method === "mpesa" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">M-Pesa</p>
                          <p className="text-sm text-muted-foreground">Instant delivery</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setMethod("bank")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        method === "bank" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">1-2 business days</p>
                        </div>
                      </div>
                    </button>
                    
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-14 gradient-accent text-accent-foreground font-medium text-base"
                      disabled={!method}
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
                
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-secondary rounded-xl space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">You send</span>
                        <span className="font-semibold">${amount} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">They receive</span>
                        <span className="font-semibold">KES {kesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To</span>
                        <span className="font-semibold">{recipient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Via</span>
                        <span className="font-semibold">{method === "mpesa" ? "M-Pesa" : "Bank"}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-muted-foreground">Total (incl. fee)</span>
                        <span className="font-bold text-primary">${(parseFloat(amount) + fee).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-14 gradient-accent text-accent-foreground font-medium text-base"
                    >
                      Confirm & Send
                    </Button>
                  </motion.div>
                )}
                
                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-lg font-medium">Processing transaction...</p>
                    <p className="text-sm text-muted-foreground">This will just take a moment</p>
                  </motion.div>
                )}
                
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <SuccessCheckmark />
                    <h3 className="text-xl font-semibold mt-6 mb-2">Money Sent!</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      {recipient} will receive KES {kesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} via {method === "mpesa" ? "M-Pesa" : "Bank Transfer"}
                    </p>
                    <Button onClick={handleClose} className="gradient-hero text-primary-foreground">
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

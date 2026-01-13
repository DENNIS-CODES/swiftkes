import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Loader2, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuccessCheckmark } from "./SuccessCheckmark";

interface DepositDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

type Step = "amount" | "payment" | "processing" | "success";

export function DepositDrawer({ isOpen, onClose, onDeposit }: DepositDrawerProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");

  const handlePayment = (method: "google" | "apple" | "card") => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      onDeposit(parseFloat(amount));
    }, 2000);
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-foreground/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-xl font-semibold">Add Money</h2>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
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
                      <Label htmlFor="deposit-amount">Amount (USD)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl h-14 mt-2"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {[50, 100, 200].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAmount(val.toString())}
                          className="flex-1 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors font-medium"
                        >
                          ${val}
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setStep("payment")}
                      className="w-full h-14 gradient-hero text-primary-foreground font-medium text-base"
                      disabled={!amount || parseFloat(amount) <= 0}
                    >
                      Continue to Payment
                    </Button>
                  </motion.div>
                )}
                
                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2"
                  >
                    <p className="text-muted-foreground text-sm mb-3">Choose payment method for ${amount}</p>
                    
                    <button
                      onClick={() => handlePayment("google")}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-sm">Google Pay</span>
                        <p className="text-xs text-muted-foreground">Fast & secure</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePayment("apple")}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-background" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-sm">Apple Pay</span>
                        <p className="text-xs text-muted-foreground">Touch ID / Face ID</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePayment("card")}
                      className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-sm">Mastercard / Visa</span>
                        <p className="text-xs text-muted-foreground">Debit or Credit</p>
                      </div>
                    </button>
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
                    <p className="text-lg font-medium">Processing payment...</p>
                    <p className="text-sm text-muted-foreground">Please wait</p>
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
                    <h3 className="text-xl font-semibold mt-6 mb-2">Deposit Successful!</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      ${amount} USD has been added to your wallet
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

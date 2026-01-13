import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Loader2 } from "lucide-react";
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
                    className="space-y-3"
                  >
                    <p className="text-muted-foreground mb-4">Choose payment method for ${amount}</p>
                    
                    <button
                      onClick={() => handlePayment("google")}
                      className="w-full p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center text-lg">
                        G
                      </div>
                      <span className="font-medium">Google Pay</span>
                    </button>
                    
                    <button
                      onClick={() => handlePayment("apple")}
                      className="w-full p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center text-lg">
                        
                      </div>
                      <span className="font-medium">Apple Pay</span>
                    </button>
                    
                    <button
                      onClick={() => handlePayment("card")}
                      className="w-full p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Debit/Credit Card</span>
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

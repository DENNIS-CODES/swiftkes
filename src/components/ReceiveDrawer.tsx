import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Mail, Phone, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";

interface ReceiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
  userEmail?: string;
}

type Tab = "qr" | "details";

export function ReceiveDrawer({ 
  isOpen, 
  onClose, 
  userPhone = "+1 234 567 8900",
  userEmail = "john.doe@email.com"
}: ReceiveDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("qr");
  const [copied, setCopied] = useState<string | null>(null);

  const walletId = "SWIFT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const qrData = JSON.stringify({
    app: "SwiftKes",
    wallet: walletId,
    phone: userPhone,
    email: userEmail
  });

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Send me money on SwiftKes",
          text: `Send me money via SwiftKes!\n\nPhone: ${userPhone}\nEmail: ${userEmail}\nWallet ID: ${walletId}`,
          url: `https://swiftkes.app/pay/${walletId}`
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleClose = () => {
    setActiveTab("qr");
    setCopied(null);
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
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-4 pb-2">
              <h2 className="text-lg font-semibold">Receive Money</h2>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 mb-4">
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "qr" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <QrCode className="w-4 h-4 inline mr-1.5" />
                QR Code
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "details" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <Share2 className="w-4 h-4 inline mr-1.5" />
                Share Details
              </button>
            </div>
            
            <div className="px-4 pb-6">
              <AnimatePresence mode="wait">
                {activeTab === "qr" && (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-2xl shadow-lg">
                        <QRCode 
                          value={qrData}
                          size={180}
                          level="H"
                          bgColor="#FFFFFF"
                          fgColor="#0F766E"
                        />
                      </div>
                    </div>
                    
                    <p className="text-center text-sm text-muted-foreground">
                      Scan this QR code to send money instantly
                    </p>

                    {/* Wallet ID */}
                    <div className="bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Wallet ID</p>
                          <p className="font-mono font-medium text-sm">{walletId}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(walletId, "wallet")}
                          className="h-8"
                        >
                          {copied === "wallet" ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleShare}
                      className="w-full h-12 gradient-hero text-primary-foreground"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Payment Link
                    </Button>
                  </motion.div>
                )}
                
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      Share these details to receive money from anyone
                    </p>

                    {/* Phone */}
                    <div className="bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Phone Number</p>
                            <p className="font-medium text-sm">{userPhone}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(userPhone, "phone")}
                          className="h-8"
                        >
                          {copied === "phone" ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email Address</p>
                            <p className="font-medium text-sm">{userEmail}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(userEmail, "email")}
                          className="h-8"
                        >
                          {copied === "email" ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Wallet ID */}
                    <div className="bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-highlight/10 flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-highlight" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Wallet ID</p>
                            <p className="font-mono font-medium text-sm">{walletId}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(walletId, "wallet")}
                          className="h-8"
                        >
                          {copied === "wallet" ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleShare}
                      className="w-full h-12 gradient-accent text-accent-foreground mt-4"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share All Details
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

import { motion } from "framer-motion";
import { ArrowRight, Wallet, Send, Download } from "lucide-react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { FeatureTile } from "@/components/FeatureTile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: string) => {
    navigate("/app", { state: { initialTab: feature } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo */}
      <header className="pt-12 pb-8 px-6">
        <AnimatedLogo size="lg" showTagline />
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 pb-24">
        {/* Feature tiles */}
        <div className="grid gap-4 mb-8">
                <FeatureTile
                  icon={Download}
                  title="Deposit"
                  description="Add money via Google Pay, Apple Pay, or card"
                  variant="deposit"
                  onClick={() => handleFeatureClick("deposit")}
                  delay={0.1}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FeatureTile
                    icon={Wallet}
                    title="Receive"
                    description="Get paid in USDC"
                    variant="receive"
                    onClick={() => handleFeatureClick("receive")}
                    delay={0.2}
                  />
                  
                  <FeatureTile
                    icon={Send}
                    title="Send"
                    description="To M-Pesa or Bank"
                    variant="send"
                    onClick={() => handleFeatureClick("send")}
                    delay={0.3}
                  />
                </div>
              </div>

              {/* Stats */}
              <motion.div
                className="flex items-center justify-center gap-8 py-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">1.5%</p>
                  <p className="text-xs text-muted-foreground">Low fees</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">&lt;30s</p>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={() => navigate("/app")}
                  className="w-full h-16 text-lg font-semibold gradient-accent text-accent-foreground rounded-2xl shadow-glow-accent touch-target"
                  aria-label="Get Started with SwiftKes"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              {/* WhatsApp option */}
              <motion.p
                className="text-center text-sm text-muted-foreground mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Or message us on{" "}
                <a
                  href="https://wa.me/1234567890?text=Hi%20SwiftKes"
                  className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
            WhatsApp
          </a>
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by stablecoins • Secure & instant
        </p>
      </footer>
    </div>
  );
}

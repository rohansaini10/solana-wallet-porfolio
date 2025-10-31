"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Header from "./header"
import PortfolioView from "./portfolio-view"
import PaymentRequestView from "./payment-request-view"
import ProjectsView from "./projects-view"
import NetworkToggle from "./network-toggle"

export default function Dashboard() {
  const { connected, connecting, disconnecting } = useWallet()
  const [activeTab, setActiveTab] = useState<"portfolio" | "payments" | "projects">("portfolio")
  const [network, setNetwork] = useState<"mainnet" | "devnet">("mainnet")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    setConnectionError(null)
  }, [connected])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 sm:gap-8 animate-in fade-in duration-500 px-4">
            <div className="w-full max-w-2xl mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 sm:p-6 hover:border-primary/40 transition-all duration-300">
                  <div className="text-2xl mb-2">💼</div>
                  <h3 className="font-semibold text-foreground mb-2">Portfolio Management</h3>
                  <p className="text-sm text-muted-foreground">
                    View your SOL balance, token holdings, and transaction history on mainnet and devnet
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 sm:p-6 hover:border-primary/40 transition-all duration-300">
                  <div className="text-2xl mb-2">📱</div>
                  <h3 className="font-semibold text-foreground mb-2">QR Payment Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate dynamic QR codes for Solana Pay payment requests with custom amounts
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 sm:p-6 hover:border-primary/40 transition-all duration-300">
                  <div className="text-2xl mb-2">🪂</div>
                  <h3 className="font-semibold text-foreground mb-2">Devnet Airdrop</h3>
                  <p className="text-sm text-muted-foreground">
                    Request SOL airdrops on devnet for testing (up to 5 SOL per request)
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 sm:p-6 hover:border-primary/40 transition-all duration-300">
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="font-semibold text-foreground mb-2">Project Showcase</h3>
                  <p className="text-sm text-muted-foreground">
                    Track work-in-progress projects including Telegram Solana trading bot (65% progress)
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Solana Portfolio Manager
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
                Connect your wallet to view your portfolio, create payment requests, and manage your Solana assets
              </p>
              {connectionError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                  {connectionError}
                </div>
              )}
            </div>
            <WalletMultiButton
              className="!bg-primary hover:!bg-primary/90 !text-primary-foreground transition-all duration-200 disabled:opacity-50"
              disabled={connecting || disconnecting}
            />
            {(connecting || disconnecting) && (
              <p className="text-muted-foreground text-sm">
                {connecting ? "Connecting wallet..." : "Disconnecting..."}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-in fade-in duration-500">
              <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                {(["portfolio", "payments", "projects"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card text-foreground hover:bg-muted border border-border/50 hover:border-primary/30"
                    }`}
                  >
                    {tab === "portfolio" && "Portfolio"}
                    {tab === "payments" && "Payments"}
                    {tab === "projects" && "Projects"}
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-auto">
                <NetworkToggle network={network} setNetwork={setNetwork} />
              </div>
            </div>

            {activeTab === "portfolio" && <PortfolioView network={network} />}
            {activeTab === "payments" && <PaymentRequestView network={network} />}
            {activeTab === "projects" && <ProjectsView />}
          </>
        )}
      </div>
    </div>
  )
}

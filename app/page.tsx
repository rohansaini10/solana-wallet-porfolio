"use client"

import { useState, useEffect } from "react"
import { WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"
import Dashboard from "@/components/dashboard"
import ErrorBoundary from "@/components/error-boundary"
import { getRpcUrl } from "@/lib/rpc-config"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

  const endpoint = getRpcUrl("mainnet")

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Solana Portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <WalletProvider wallets={wallets} autoConnect={false} endpoint={endpoint}>
        <WalletModalProvider>
          <Dashboard />
        </WalletModalProvider>
      </WalletProvider>
    </ErrorBoundary>
  )
}

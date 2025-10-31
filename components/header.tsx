"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Header() {
  const { connected, publicKey } = useWallet()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 hover:bg-card/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            <span className="text-lg font-bold text-primary-foreground">◎</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Solana Portfolio
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {connected && publicKey && (
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Connected Wallet</p>
              <p className="text-sm font-mono text-foreground">
                {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
              </p>
            </div>
          )}
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground transition-all duration-200" />
        </div>
      </div>
    </header>
  )
}

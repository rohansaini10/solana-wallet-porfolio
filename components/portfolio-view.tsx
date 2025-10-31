"use client"

import { useState, useEffect, useMemo } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, Connection } from "@solana/web3.js"
import BalanceCard from "./balance-card"
import TokenHoldings from "./token-holdings"
import TransactionHistory from "./transaction-history"
import AirdropButton from "./airdrop-button"
import { getRpcUrl } from "@/lib/rpc-config"

interface PortfolioViewProps {
  network: "mainnet" | "devnet"
}

export default function PortfolioView({ network }: PortfolioViewProps) {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const connection = useMemo(() => {
    const rpcUrl = getRpcUrl(network)
    console.log("[v0] Creating connection for", network, "with RPC:", rpcUrl)
    return new Connection(rpcUrl, "confirmed")
  }, [network])

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setLoading(false)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching balance for:", publicKey.toString(), "on", network)
        const lamports = await connection.getBalance(publicKey)
        setBalance(lamports / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error("[v0] Error fetching balance:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch balance")
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 5000)
    return () => clearInterval(interval)
  }, [publicKey, connection, network])

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
        <p className="font-medium">Error loading portfolio</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <BalanceCard balance={balance} loading={loading} network={network} />
        {network === "devnet" && <AirdropButton publicKey={publicKey} connection={connection} />}
      </div>

      <TokenHoldings publicKey={publicKey} connection={connection} network={network} />
      <TransactionHistory publicKey={publicKey} connection={connection} network={network} />
    </div>
  )
}

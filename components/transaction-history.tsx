"use client"

import { useState, useEffect } from "react"
import type { Connection, PublicKey } from "@solana/web3.js"
import { getHeliusTransactionHistoryUrl } from "@/lib/rpc-config"

interface TransactionHistoryProps {
  publicKey: PublicKey | null
  connection: Connection
  network?: "mainnet" | "devnet"
}

export default function TransactionHistory({ publicKey, connection, network = "mainnet" }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setLoading(false)
        setError(null)
        setTransactions([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const heliusUrl = getHeliusTransactionHistoryUrl(network).replace("{address}", publicKey.toString())
        console.log("[v0] Fetching transactions from Helius:", heliusUrl)

        const response = await fetch(heliusUrl)
        if (!response.ok) {
          throw new Error(`Helius API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Helius response received, transactions count:", data?.length || 0)

        const txs = (data || []).map((tx: any) => {
          const description = tx.description || "Transaction"
          let amount = 0

          // Extract amount from native transfers
          if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
            amount = tx.nativeTransfers[0].amount / 1e9 // Convert lamports to SOL
          }

          // Extract amount from token transfers
          if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
            amount = tx.tokenTransfers[0].tokenAmount?.uiAmount || 0
          }

          return {
            signature: tx.signature,
            timestamp: tx.timestamp || 0,
            status: tx.type === "UNKNOWN" ? "Pending" : "Success",
            type: tx.type || "Unknown",
            amount: amount,
            description: description.substring(0, 60),
          }
        })

        setTransactions(txs)
        console.log("[v0] Parsed transactions:", txs.length)
      } catch (error) {
        console.error("[v0] Error fetching transactions from Helius:", error)
        try {
          const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 })
          const txs = signatures.map((sig) => ({
            signature: sig.signature,
            timestamp: sig.blockTime || 0,
            status: sig.err ? "Failed" : "Success",
            type: "Transaction",
            amount: 0,
            description: "On-chain transaction",
          }))
          setTransactions(txs)
          console.log("[v0] Fetched transactions via web3.js fallback:", txs.length)
        } catch (fallbackError) {
          console.error("[v0] Fallback error:", fallbackError)
          setError("Unable to load transactions")
          setTransactions([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [publicKey, connection, network])

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Unknown"
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 lg:p-8 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Transactions</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {network === "devnet" ? "Devnet" : "Mainnet"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2 sm:space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 sm:h-12 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/60 transition-all duration-200 border border-border/50 hover:border-primary/30 group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-foreground truncate group-hover:text-primary transition-colors">
                  {tx.signature.slice(0, 20)}...
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(tx.timestamp)}</p>
                {tx.amount > 0 && <p className="text-xs text-primary mt-1 font-semibold">{tx.amount.toFixed(4)} SOL</p>}
              </div>
              <span
                className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  tx.status === "Success"
                    ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
                }`}
              >
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm">No transactions found</p>
      )}
    </div>
  )
}

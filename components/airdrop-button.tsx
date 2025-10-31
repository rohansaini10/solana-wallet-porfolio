"use client"

import { useState } from "react"
import type { Connection, PublicKey } from "@solana/web3.js"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

interface AirdropButtonProps {
  publicKey: PublicKey | null
  connection: Connection
}

export default function AirdropButton({ publicKey, connection }: AirdropButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [airdropAmount, setAirdropAmount] = useState(2)
  const MAX_AIRDROP = 5

  const handleAirdrop = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      setMessage("Requesting airdrop...")
      console.log("[v0] Requesting airdrop of", airdropAmount, "SOL")

      const signature = await connection.requestAirdrop(publicKey, airdropAmount * LAMPORTS_PER_SOL)
      console.log("[v0] Airdrop signature:", signature)

      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Confirmation timeout")), 30000)),
      ])

      setMessage(`✓ Airdrop successful! ${airdropAmount} SOL received`)
      setTimeout(() => setMessage(""), 5000)
    } catch (error: any) {
      console.error("[v0] Airdrop error:", error)

      let errorMessage = "✗ Airdrop failed. Try again later."

      const errorStr = error?.message?.toLowerCase() || error?.toString?.()?.toLowerCase() || ""
      const errorCode = error?.code || error?.status || 0

      if (
        errorStr.includes("rate limit") ||
        errorCode === 429 ||
        errorCode === 403 ||
        errorStr.includes("too many requests")
      ) {
        errorMessage = "⏱ Rate limited! Devnet faucet allows 1 SOL per project per day. Try again tomorrow."
      } else if (errorStr.includes("insufficient funds")) {
        errorMessage = "✗ Faucet has insufficient funds. Try again later."
      }

      setMessage(errorMessage)
      setTimeout(() => setMessage(""), 6000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 lg:p-8 hover:border-primary/20 transition-all duration-300">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">Devnet Airdrop</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Request SOL for testing on devnet</p>

      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm text-muted-foreground mb-2">Amount (SOL): {airdropAmount}</label>
        <input
          type="range"
          min="0.1"
          max={MAX_AIRDROP}
          step="0.1"
          value={airdropAmount}
          onChange={(e) => setAirdropAmount(Number.parseFloat(e.target.value))}
          disabled={loading}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0.1 SOL</span>
          <span>{MAX_AIRDROP} SOL (max)</span>
        </div>
      </div>

      <button
        onClick={handleAirdrop}
        disabled={loading || !publicKey}
        className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2 sm:py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 text-sm sm:text-base"
      >
        {loading ? "Processing..." : `Request ${airdropAmount} SOL`}
      </button>

      <p className="text-xs text-muted-foreground mt-3 sm:mt-4 text-center">
        Limited to {MAX_AIRDROP} SOL per request to prevent rate limiting
      </p>

      {message && (
        <p
          className={`text-xs sm:text-sm mt-3 sm:mt-4 text-center transition-all duration-300 ${
            message.includes("✓") ? "text-green-400" : message.includes("⏱") ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

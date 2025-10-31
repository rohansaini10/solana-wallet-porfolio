"use client"

import { useState, useEffect } from "react"
import { type Connection, PublicKey } from "@solana/web3.js"

interface TokenHoldingsProps {
  publicKey: PublicKey | null
  connection: Connection
  network?: "mainnet" | "devnet"
}

export default function TokenHoldings({ publicKey, connection, network = "mainnet" }: TokenHoldingsProps) {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) {
        setLoading(false)
        setError(null)
        setTokens([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching tokens for:", publicKey.toString(), "on", network)

        const pubKey = publicKey instanceof PublicKey ? publicKey : new PublicKey(publicKey)

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJsyFbPVwwQQfZyiNwAJsyFbPVww"),
        })

        const tokenData = tokenAccounts.value
          .filter((account) => {
            const amount = account.account.data.parsed?.info?.tokenAmount?.uiAmount
            return amount && amount > 0
          })
          .map((account) => ({
            mint: account.account.data.parsed.info.mint,
            amount: account.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: account.account.data.parsed.info.tokenAmount.decimals,
          }))
          .slice(0, 5)

        setTokens(tokenData)
        console.log("[v0] Fetched tokens:", tokenData.length)
      } catch (error) {
        console.error("[v0] Error fetching tokens:", error)
        setTokens([])
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [publicKey, connection, network])

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 lg:p-8 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Token Holdings</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {network === "devnet" ? "Devnet" : "Mainnet"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2 sm:space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 sm:h-12 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : tokens.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {tokens.map((token, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/60 transition-all duration-200 border border-border/50 hover:border-primary/30 group"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {token.mint.slice(0, 8)}...
                </p>
                <p className="text-xs text-muted-foreground">Token Account</p>
              </div>
              <p className="font-semibold text-primary text-sm sm:text-base ml-2 flex-shrink-0">
                {token.amount.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm">No token holdings found</p>
      )}
    </div>
  )
}

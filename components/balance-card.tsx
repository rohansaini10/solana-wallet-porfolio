"use client"

export interface BalanceCardProps {
  balance: number
  loading: boolean
  network?: "mainnet" | "devnet"
}

export default function BalanceCard({ balance, loading, network = "mainnet" }: BalanceCardProps) {
  const networkLabel = network === "devnet" ? "Devnet SOL" : "SOL Balance"
  const networkColor = network === "devnet" ? "from-accent to-primary" : "from-primary to-accent"

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-xl p-4 sm:p-6 lg:p-8 glow-accent hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-sm sm:text-lg font-semibold text-foreground">{networkLabel}</h2>
          {network === "devnet" && <p className="text-xs text-accent mt-1">Test Network</p>}
        </div>
        <div
          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br ${networkColor} flex items-center justify-center shadow-lg shadow-primary/20`}
        >
          <span className="text-lg sm:text-xl font-bold text-primary-foreground">◎</span>
        </div>
      </div>

      {loading ? (
        <div className="h-10 sm:h-12 bg-muted rounded-lg animate-pulse"></div>
      ) : (
        <div>
          <p className="text-2xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text mb-1 sm:mb-2 animate-in fade-in duration-500">
            {balance.toFixed(4)}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">≈ ${(balance * 140).toFixed(2)} USD</p>
        </div>
      )}
    </div>
  )
}

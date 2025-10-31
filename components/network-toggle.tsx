"use client"

export interface NetworkToggleProps {
  network: "mainnet" | "devnet"
  setNetwork: (network: "mainnet" | "devnet") => void
}

export default function NetworkToggle({ network, setNetwork }: NetworkToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
      <button
        onClick={() => setNetwork("mainnet")}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          network === "mainnet" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Mainnet
      </button>
      <button
        onClick={() => setNetwork("devnet")}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          network === "devnet" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Devnet
      </button>
    </div>
  )
}

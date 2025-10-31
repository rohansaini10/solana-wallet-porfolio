"use client"

import { useState } from "react"
import type { PublicKey } from "@solana/web3.js"
import QRCode from "qrcode"

interface PaymentRequestGeneratorProps {
  publicKey: PublicKey | null
  network: "mainnet" | "devnet"
  onCreateRequest: (request: any) => void
}

export default function PaymentRequestGenerator({ publicKey, network, onCreateRequest }: PaymentRequestGeneratorProps) {
  const [amount, setAmount] = useState("")
  const [label, setLabel] = useState("")
  const [message, setMessage] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [loading, setLoading] = useState(false)

  const generatePaymentRequest = async () => {
    if (!publicKey || !amount) {
      alert("Please enter an amount")
      return
    }

    try {
      setLoading(true)

      // Solana Pay URL format: solana:{recipient}?amount={amount}&label={label}&message={message}
      const solanaPayUrl = `solana:${publicKey.toBase58()}?amount=${amount}${
        label ? `&label=${encodeURIComponent(label)}` : ""
      }${message ? `&message=${encodeURIComponent(message)}` : ""}`

      const qrDataUrl = await QRCode.toDataURL(solanaPayUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 200,
        color: {
          dark: "#ffffff",
          light: "#1a1a1a",
        },
      })

      setQrCode(qrDataUrl)

      const request = {
        id: Date.now(),
        amount,
        label,
        message,
        qrCode: qrDataUrl,
        solanaPayUrl,
        createdAt: new Date(),
      }

      onCreateRequest(request)
      setAmount("")
      setLabel("")
      setMessage("")
    } catch (error) {
      console.error("Error generating QR code:", error)
      alert("Failed to generate payment request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 sm:p-6 lg:p-8 sticky top-24 hover:border-primary/20 transition-all duration-300">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Create Payment Request</h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">Amount (SOL)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-input border border-border rounded-lg px-3 sm:px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">Label (Optional)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Invoice #123"
            className="w-full bg-input border border-border rounded-lg px-3 sm:px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Payment description..."
            rows={3}
            className="w-full bg-input border border-border rounded-lg px-3 sm:px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          />
        </div>

        <button
          onClick={generatePaymentRequest}
          disabled={loading || !amount}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          {loading ? "Generating..." : "Generate QR Code"}
        </button>
      </div>

      {qrCode && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Latest QR Code:</p>
          <div className="flex justify-center">
            <img
              src={qrCode || "/placeholder.svg"}
              alt="Payment QR Code"
              className="w-40 sm:w-48 h-40 sm:h-48 rounded-lg border border-border hover:border-primary/30 transition-all duration-300"
            />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import PaymentRequestGenerator from "./payment-request-generator"
import PaymentRequestList from "./payment-request-list"

interface PaymentRequestViewProps {
  network: "mainnet" | "devnet"
}

export default function PaymentRequestView({ network }: PaymentRequestViewProps) {
  const { publicKey } = useWallet()
  const [requests, setRequests] = useState<any[]>([])

  const handleCreateRequest = (request: any) => {
    setRequests([request, ...requests])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-1">
        <PaymentRequestGenerator publicKey={publicKey} network={network} onCreateRequest={handleCreateRequest} />
      </div>
      <div className="lg:col-span-2">
        <PaymentRequestList requests={requests} />
      </div>
    </div>
  )
}

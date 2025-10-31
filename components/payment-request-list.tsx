"use client"

interface PaymentRequestListProps {
  requests: any[]
}

export default function PaymentRequestList({ requests }: PaymentRequestListProps) {
  const downloadQR = (qrCode: string, label: string) => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `payment-${label || "request"}-${Date.now()}.png`
    link.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Payment Requests</h2>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary">{request.amount} SOL</h3>
                    <p className="text-xs text-muted-foreground">{request.createdAt.toLocaleTimeString()}</p>
                  </div>

                  {request.label && (
                    <p className="text-sm text-foreground mb-2">
                      <span className="text-muted-foreground">Label:</span> {request.label}
                    </p>
                  )}

                  {request.message && (
                    <p className="text-sm text-foreground mb-4">
                      <span className="text-muted-foreground">Message:</span> {request.message}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => downloadQR(request.qrCode, request.label)}
                      className="text-xs bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded transition-colors"
                    >
                      Download QR
                    </button>
                    <button
                      onClick={() => copyToClipboard(request.solanaPayUrl)}
                      className="text-xs bg-accent/20 text-accent hover:bg-accent/30 px-3 py-1 rounded transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src={request.qrCode || "/placeholder.svg"}
                    alt="Payment QR"
                    className="w-32 h-32 rounded-lg border border-border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No payment requests created yet. Create one to get started!
        </p>
      )}
    </div>
  )
}

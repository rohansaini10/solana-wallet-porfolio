"use client"

export default function ProjectsView() {
  const projects = [
    {
      id: 1,
      name: "Telegram Solana Trading Bot",
      status: "In Progress",
      description: "Automated trading bot for Solana tokens with real-time price monitoring and execution",
      features: [
        "Real-time token price tracking",
        "Automated buy/sell signals",
        "Portfolio management",
        "Risk management tools",
        "Telegram notifications",
      ],
      progress: 65,
      tech: ["Node.js", "Solana Web3.js", "Telegram Bot API", "Redis"],
      github: "https://github.com/rohansaini10/tg-bot",
    },
    {
      id: 2,
      name: "Portfolio Analytics Dashboard",
      status: "Planned",
      description: "Advanced analytics and insights for Solana portfolio performance",
      features: ["Performance metrics", "Historical analysis", "Risk assessment", "Tax reporting"],
      progress: 0,
      tech: ["React", "Chart.js", "Solana Web3.js"],
    },
    {
      id: 3,
      name: "Multi-Sig Wallet Manager",
      status: "Planned",
      description: "Secure multi-signature wallet for team fund management",
      features: ["Multi-sig support", "Approval workflows", "Transaction history", "Security audit logs"],
      progress: 0,
      tech: ["Next.js", "Solana Web3.js", "Smart Contracts"],
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
        <h2 className="text-2xl font-bold text-foreground mb-2">Hackathon Projects</h2>
        <p className="text-muted-foreground">Innovative Solana ecosystem tools and applications in development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-in fade-in duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex-1">{project.name}</h3>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2 transition-all ${
                  project.status === "In Progress" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {project.status === "In Progress" && "WIP"}
                {project.status === "Planned" && "Planned"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

            {project.status === "In Progress" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-xs font-semibold text-primary">{project.progress}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Features:</p>
              <ul className="space-y-1">
                {project.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="text-xs text-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Tech Stack:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted/50 text-foreground px-2 py-1 rounded hover:bg-muted transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-all duration-200 font-medium"
                >
                  View on GitHub
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

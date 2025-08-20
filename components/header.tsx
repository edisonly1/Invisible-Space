import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Invisible Space — Atlanta Tonight
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
          >
            Dashboard
          </Link>
          <Link
            href="/explainer"
            target="_blank"
            className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
          >
            Explainer (Print to PDF)
          </Link>
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
          >
            NASA Space Apps
          </a>
        </nav>
      </div>
    </header>
  )
}

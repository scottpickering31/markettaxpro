import "../../../styles/globals.css";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container flex items-center justify-between py-3">
            <a href="/app" className="font-semibold">
              Accruwise
            </a>
            <p>Welcome</p>
            <nav className="flex gap-4 text-sm">
              <a href="/app">Home</a>
              <a href="/app/costs">Costs</a>
              <a href="/app/transactions">Transactions</a>
              <a href="/app/summary">Summary</a>
              <a href="/app/connect">Import</a>
              <a href="/app/export">Export</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}

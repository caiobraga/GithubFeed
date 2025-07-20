"use client"

import { useSession } from "next-auth/react"
import LandingPage from "./components/landing-page";
import Dashboard from "./components/dashboard";

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/80 text-lg">Carregando GitHub Feed...</p>
        </div>
      </div>
    )
  }


  if (!session) {
    return <LandingPage />
  }


  return <Dashboard />
}


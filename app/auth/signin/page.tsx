"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "../../[locale]/ui/card"
import { Button } from "../../[locale]/ui/button"

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para a página inicial onde está a landing page
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="text-white/80 text-lg">Redirecionando...</p>
      </div>
    </div>
  )
}


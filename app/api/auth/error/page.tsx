"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "../../../[locale]/ui/card"
import { Button } from "../../../[locale]/ui/button"
import { AlertCircle, Home } from "lucide-react"

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="max-w-md w-full bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Erro de Autenticação</h1>
            <p className="text-white/70">
              {error === "OAuthCallback" 
                ? "Houve um problema com a configuração do GitHub OAuth. Verifique se a URL de callback está correta."
                : "Ocorreu um erro durante o processo de login."
              }
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            
            <p className="text-sm text-white/50">
              Redirecionando automaticamente em 5 segundos...
            </p>
          </div>

          {error === "OAuthCallback" && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">Solução:</h3>
              <p className="text-xs text-white/70">
                Configure a URL de callback no GitHub OAuth como: 
                <code className="block mt-1 p-1 bg-black/20 rounded text-yellow-300">
                  http://localhost:3000/api/auth/callback/github
                </code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


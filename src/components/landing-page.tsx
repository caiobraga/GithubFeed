"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Github, Star, GitBranch, Users, Code, Zap, Shield, Sparkles, ArrowRight, Play } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { callbackUrl: "/" })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: GitBranch,
      title: "Feed de Commits",
      description: "Acompanhe todos os seus commits em tempo real em um feed elegante e organizado."
    },
    {
      icon: Users,
      title: "Perfis de Desenvolvedores",
      description: "Explore perfis completos de desenvolvedores e suas contribuições no GitHub."
    },
    {
      icon: Code,
      title: "Repositórios",
      description: "Navegue por seus repositórios com busca avançada e filtros inteligentes."
    },
    {
      icon: Zap,
      title: "Tempo Real",
      description: "Receba atualizações instantâneas sobre atividades em seus projetos favoritos."
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Autenticação segura via GitHub OAuth sem armazenar dados sensíveis."
    },
    {
      icon: Sparkles,
      title: "Interface Moderna",
      description: "Design limpo e intuitivo inspirado nas melhores redes sociais."
    }
  ]

  const stats = [
    { number: "100%", label: "Integração GitHub" },
    { number: "0ms", label: "Tempo de Setup" },
    { number: "∞", label: "Repositórios" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Github className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              GitHub Feed
            </span>
          </div>
          
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            <Star className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Sua rede social de
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {" "}desenvolvimento
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Conecte-se ao GitHub e transforme sua atividade de desenvolvimento em uma experiência social moderna e envolvente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 mr-3" />
                  Entrar com GitHub
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
            >
              <Play className="w-5 h-5 mr-3" />
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-300">{stat.number}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Funcionalidades que você vai
            <span className="text-purple-400"> amar</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Descubra como o GitHub Feed transforma sua experiência de desenvolvimento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Pronto para começar?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Junte-se à comunidade de desenvolvedores que já estão usando o GitHub Feed para acompanhar suas atividades de forma mais inteligente.
            </p>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-white text-purple-900 hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 mr-3" />
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GitHub Feed</span>
          </div>
          <p className="text-white/60">
            Conectando desenvolvedores através do código
          </p>
          <div className="flex justify-center space-x-6 text-sm text-white/50">
            <span>Privacidade</span>
            <span>•</span>
            <span>Termos</span>
            <span>•</span>
            <span>Suporte</span>
          </div>
        </div>
      </footer>
    </div>
  )
}


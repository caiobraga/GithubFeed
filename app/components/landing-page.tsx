"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Github, Star, GitBranch, Users, Code, Zap, Shield, Sparkles, ArrowRight, Play, Heart, TrendingUp } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
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
      description: "Acompanhe todos os seus commits em tempo real em um feed elegante e organizado.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Perfis de Desenvolvedores",
      description: "Explore perfis completos de desenvolvedores e suas contribuições no GitHub.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Code,
      title: "Repositórios",
      description: "Navegue por seus repositórios com busca avançada e filtros inteligentes.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Tempo Real",
      description: "Receba atualizações instantâneas sobre atividades em seus projetos favoritos.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Autenticação segura via GitHub OAuth sem armazenar dados sensíveis.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "Interface Moderna",
      description: "Design limpo e intuitivo inspirado nas melhores redes sociais.",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const stats = [
    { number: "100%", label: "Integração GitHub", icon: Github },
    { number: "0ms", label: "Tempo de Setup", icon: Zap },
    { number: "∞", label: "Repositórios", icon: Code }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Github className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  GitHub Feed
                </span>
                <Badge variant="secondary" className="ml-3 bg-purple-500/20 text-purple-200 border-purple-400/30">
                  <Star className="w-3 h-3 mr-1" />
                  Beta
                </Badge>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Recursos
              </Button>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Sobre
              </Button>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Contato
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              Sua rede social de
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                desenvolvimento
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Conecte-se ao GitHub e transforme sua atividade de desenvolvimento em uma 
              <span className="text-purple-300 font-semibold"> experiência social moderna</span> e envolvente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-10 py-8 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover-lift pulse-glow"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-6 h-6 mr-3" />
                  Entrar com GitHub
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-8 text-xl rounded-2xl backdrop-blur-sm hover-lift"
            >
              <Play className="w-6 h-6 mr-3" />
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-purple-300 mb-2">{stat.number}</div>
                    <div className="text-white/70 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold mb-6">
            Funcionalidades que você vai
            <span className="text-purple-400"> amar</span>
          </h2>
          <p className="text-2xl text-white/70 max-w-3xl mx-auto">
            Descubra como o GitHub Feed transforma sua experiência de desenvolvimento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group hover-lift">
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-white/80">Amado por desenvolvedores</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-white/80">Em crescimento</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-white/80">100% Seguro</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white">
              Pronto para começar?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Junte-se à comunidade de desenvolvedores que já estão usando o GitHub Feed para 
              acompanhar suas atividades de forma mais inteligente e social.
            </p>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-white text-purple-900 hover:bg-white/90 px-10 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover-lift"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-6 h-6 mr-3" />
                  Começar Agora
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">GitHub Feed</span>
            </div>
            <p className="text-white/60 text-lg">
              Conectando desenvolvedores através do código
            </p>
            <div className="flex justify-center space-x-8 text-white/50">
              <Button variant="ghost" className="text-white/50 hover:text-white">Privacidade</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">Termos</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">Suporte</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">API</Button>
            </div>
            <div className="text-white/40 text-sm">
              © 2025 GitHub Feed. Feito com ❤️ para a comunidade de desenvolvedores.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


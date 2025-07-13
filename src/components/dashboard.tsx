"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Github, LogOut, Star, GitBranch, Users, Code } from "lucide-react"

export default function Dashboard() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                GitHub Feed
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{session.user?.name}</span>
              </div>
              
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              Bem-vindo ao GitHub Feed, {session.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-white/80">
              Sua rede social de desenvolvimento está pronta para uso
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                  <p className="text-white/70">{session.user?.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                  <Github className="w-3 h-3 mr-1" />
                  Conectado ao GitHub
                </Badge>
                <Badge variant="secondary" className="bg-green-600/20 text-green-200 border-green-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Autenticado
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Feed de Commits</h3>
                <p className="text-white/70">Acompanhe todos os seus commits em tempo real</p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Perfis</h3>
                <p className="text-white/70">Explore perfis de desenvolvedores</p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Repositórios</h3>
                <p className="text-white/70">Navegue por seus repositórios</p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Success Message */}
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                🎉 Login realizado com sucesso!
              </h2>
              <p className="text-white/80 text-lg">
                Você está conectado ao GitHub e pronto para usar o GitHub Feed. 
                As funcionalidades de feed, perfis e repositórios estarão disponíveis em breve.
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  onClick={() => window.open('https://github.com/' + session.user?.name, '_blank')}
                  className="bg-white text-purple-900 hover:bg-white/90"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Ver meu GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}



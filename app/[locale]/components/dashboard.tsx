"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import CommitFeed from "./commit-feed"
import RepositoryList from "./repository-list"
import UserProfile from "./user-profile"
import { Github, LogOut, GitCommit, Users, Book, Settings, Bell } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export default function Dashboard() {
  const t = useTranslations('Dashboard')
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("feed")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const pathname = usePathname()
  const language = pathname?.split('/')[1] || 'pt'

  // Quando mudar para a aba de perfil, mostrar o perfil do usuário logado
  useEffect(() => {
    if (activeTab === "profile" && !selectedUser && session?.user?.name) {
      setSelectedUser(session.user.name)
    }
  }, [activeTab, selectedUser, session?.user?.name])

  const handleUserClick = (username: string) => {
    setSelectedUser(username)
    setActiveTab("profile")
  }

  const handleBackToFeed = () => {
    setSelectedUser(null)
    setActiveTab("feed")
  }

  if (!session?.accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t('loading')}</h3>
                <p className="text-sm text-white/70">{t('loading')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <CommitFeed 
            accessToken={session.accessToken ?? ""} 
            onUserClick={handleUserClick}
            locale={language}
          />
        )
      case "repositories":
        return (
          <RepositoryList 
            accessToken={session.accessToken ?? ""}
            onUserClick={handleUserClick}
            locale={language}
          />
        )
      case "profile":
        return selectedUser ? (
          <UserProfile 
            username={selectedUser}
            accessToken={session.accessToken ?? ""}
            onBack={handleBackToFeed}
          />
        ) : (
          <UserProfile 
            username={session.user?.name || ""}
            accessToken={session.accessToken ?? ""}
            onBack={handleBackToFeed}
          />
        )
      default:
        return (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2 text-white">{t('comingSoon.title')}</h3>
                <p className="text-white/60">{t('comingSoon.description')}</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Github className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  GitHub Feed
                </span>
                <Badge variant="secondary" className="ml-3 bg-purple-500/20 text-purple-200 border-purple-400/30">
                  Dashboard
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-white font-medium">{session.user?.name}</div>
                  <div className="text-white/60 text-sm">{session.user?.email}</div>
                </div>
              </div>
              
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {language === 'pt' ? 'Sair' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center">
              <TabsList className="bg-white/5 border border-white/10 backdrop-blur-sm p-1">
                <TabsTrigger 
                  value="feed"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70 hover:text-white transition-colors"
                >
                  <GitCommit className="w-4 h-4 mr-2" />
                  {t('feed')}
                </TabsTrigger>
                <TabsTrigger 
                  value="repositories"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70 hover:text-white transition-colors"
                >
                  <Book className="w-4 h-4 mr-2" />
                  {t('repositories')}
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t('profile')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="feed" className="space-y-6">
              {renderContent()}
            </TabsContent>

            <TabsContent value="repositories" className="space-y-6">
              {renderContent()}
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              {renderContent()}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Welcome Message for First Time Users */}
      {activeTab === "feed" && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 border-purple-500/30 backdrop-blur-sm max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Bem-vindo ao GitHub Feed!</h4>
                  <p className="text-white/80 text-xs mt-1">
                    Explore seus commits, repositórios e perfis de desenvolvedores.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


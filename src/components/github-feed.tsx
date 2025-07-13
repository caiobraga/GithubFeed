"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import CommitFeed from "./commit-feed"
import UserProfile from "./user-profile"
import RepositoryList from "./repository-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { GitBranch, Users, BookOpen } from "lucide-react"

export default function GitHubFeed() {
  const { data: session } = useSession()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("feed")

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
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erro: Token de acesso não encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">GitHub Feed</h1>
        <p className="text-muted-foreground">Acompanhe suas atividades e explore repositórios</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Feed de Commits
          </TabsTrigger>
          <TabsTrigger value="repositories" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Repositórios
          </TabsTrigger>
          <TabsTrigger value="profile" disabled={!selectedUser} className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {selectedUser ? (
              <div className="flex items-center gap-1">
                <span className="truncate max-w-20">{selectedUser}</span>
                <Badge variant="secondary" className="text-xs">Perfil</Badge>
              </div>
            ) : (
              "Perfil"
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          <CommitFeed 
            accessToken={session.accessToken} 
            onUserClick={handleUserClick}
          />
        </TabsContent>
        
        <TabsContent value="repositories" className="space-y-6">
          <RepositoryList 
            accessToken={session.accessToken}
            onUserClick={handleUserClick}
          />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          {selectedUser && (
            <UserProfile 
              username={selectedUser}
              accessToken={session.accessToken}
              onBack={handleBackToFeed}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, GitFork, Star, Eye, Users, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

interface UserData {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  created_at: string
  public_repos: number
  followers: number
  following: number
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  updated_at: string
}

interface UserProfileProps {
  username: string
  accessToken: string
  onBack: () => void
}

export default function UserProfile({ username, accessToken, onBack }: UserProfileProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const octokit = new Octokit({ auth: accessToken })

        // Buscar dados do usuário
        const { data: userData } = await octokit.rest.users.getByUsername({
          username
        })

        setUser(userData as UserData)

        // Buscar repositórios do usuário
        const { data: reposData } = await octokit.rest.repos.listForUser({
          username,
          sort: "updated",
          per_page: 20
        })

        setRepositories(reposData as Repository[])
      } catch (err) {
        setError("Erro ao carregar dados do usuário")
        console.error("Erro ao buscar dados do usuário:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username, accessToken])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-pink-500",
      "C#": "bg-purple-500",
      PHP: "bg-indigo-500",
      Ruby: "bg-red-600",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      Swift: "bg-orange-600",
      Kotlin: "bg-purple-600",
      Dart: "bg-blue-600",
      HTML: "bg-orange-400",
      CSS: "bg-blue-400",
      Shell: "bg-gray-500",
    }
    return colors[language] || "bg-gray-400"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="animate-pulse">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error || "Usuário não encontrado"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Feed
      </Button>

      {/* Perfil do usuário */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        <CardHeader className="relative pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-background -mt-12 relative">
              <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
              <AvatarFallback className="text-2xl">
                {(user.name || user.login).charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
                <p className="text-muted-foreground">@{user.login}</p>
              </div>
              
              {user.bio && (
                <p className="text-sm">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.blog && (
                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <a
                      href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>{user.blog}</span>
                    </a>
                  </Button>
                )}
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{user.public_repos}</span>
              </div>
              <p className="text-xs text-muted-foreground">Repositórios</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{user.followers}</span>
              </div>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{user.following}</span>
              </div>
              <p className="text-xs text-muted-foreground">Seguindo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repositórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Repositórios Populares</span>
            <Badge variant="outline">{repositories.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {repositories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum repositório público encontrado.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {repositories.slice(0, 6).map((repo) => (
                <Card key={repo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                        asChild
                      >
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repo.name}
                        </a>
                      </Button>
                    </div>
                    
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        {repo.language && (
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                            <span className="text-muted-foreground">{repo.language}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Star className="w-3 h-3" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </div>
                      </div>
                      
                      <span className="text-muted-foreground">
                        {formatDate(repo.updated_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


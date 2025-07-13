"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { GitCommit, Calendar, User, ExternalLink, Clock, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

interface Commit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
    avatar_url?: string
    login?: string
  }
  repository: {
    name: string
    full_name: string
    html_url: string
  }
  html_url: string
}

interface CommitFeedProps {
  accessToken: string
  onUserClick: (username: string) => void
}

export default function CommitFeed({ accessToken, onUserClick }: CommitFeedProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setLoading(true)
        const octokit = new Octokit({ auth: accessToken })

        // Buscar repositórios do usuário
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
          sort: "updated",
          per_page: 10
        })

        // Buscar commits de cada repositório
        const allCommits: Commit[] = []
        
        for (const repo of repos) {
          try {
            const { data: repoCommits } = await octokit.rest.repos.listCommits({
              owner: repo.owner.login,
              repo: repo.name,
              per_page: 5
            })

            const formattedCommits = repoCommits.map(commit => ({
              sha: commit.sha,
              message: commit.commit.message,
              author: {
                name: commit.commit.author?.name || "Unknown",
                email: commit.commit.author?.email || "",
                date: commit.commit.author?.date || "",
                avatar_url: commit.author?.avatar_url,
                login: commit.author?.login
              },
              repository: {
                name: repo.name,
                full_name: repo.full_name,
                html_url: repo.html_url
              },
              html_url: commit.html_url
            }))

            allCommits.push(...formattedCommits)
          } catch (repoError) {
            console.warn(`Erro ao buscar commits do repositório ${repo.name}:`, repoError)
          }
        }

        // Ordenar commits por data
        allCommits.sort((a, b) => new Date(b.author.date).getTime() - new Date(a.author.date).getTime())
        
        setCommits(allCommits.slice(0, 50)) // Limitar a 50 commits
      } catch (err) {
        setError("Erro ao carregar commits")
        console.error("Erro ao buscar commits:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommits()
  }, [accessToken])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Agora há pouco"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return "Ontem"
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: diffInHours > 8760 ? "numeric" : undefined
    })
  }

  const handleUserClick = (username: string) => {
    if (username) {
      onUserClick(username)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (commits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <GitCommit className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum commit encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Atividade Recente</h2>
        <Badge variant="outline" className="text-xs">
          {commits.length} commits
        </Badge>
      </div>
      
      {commits.map((commit, index) => (
        <Card key={commit.sha} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={commit.author.avatar_url} alt={commit.author.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-foreground hover:text-primary"
                      onClick={() => commit.author.login && handleUserClick(commit.author.login)}
                      disabled={!commit.author.login}
                    >
                      {commit.author.name}
                    </Button>
                    <span className="text-muted-foreground">•</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80"
                      asChild
                    >
                      <a
                        href={commit.repository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1"
                      >
                        <span>{commit.repository.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(commit.author.date)}</span>
                  </div>
                </div>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {commit.message.split('\n')[0]}
              </p>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    asChild
                  >
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1"
                    >
                      <GitCommit className="w-3 h-3" />
                      <span>{commit.sha.substring(0, 7)}</span>
                    </a>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea } from "./ui/scroll-area"
import { GitCommit, Calendar, ExternalLink, RefreshCw, Star, GitBranch, Users } from "lucide-react"

interface Commit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    avatar_url?: string
  }
  date: string
  url: string
  repository: {
    name: string
    full_name: string
    url: string
  }
}

interface CommitFeedProps {
  accessToken: string
  onUserClick?: (username: string) => void
}

export default function CommitFeed({ accessToken, onUserClick }: CommitFeedProps) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchCommits = async () => {
    try {
      setError(null)
      
      // Buscar repositórios do usuário
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 10,
        type: 'all'
      })

      const allCommits: Commit[] = []

      // Buscar commits de cada repositório
      for (const repo of repos.slice(0, 5)) { // Limitar a 5 repos para performance
        try {
          const { data: repoCommits } = await octokit.rest.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            per_page: 5,
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Últimos 7 dias
          })

          const formattedCommits = repoCommits.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: {
              name: commit.commit.author?.name || 'Unknown',
              email: commit.commit.author?.email || '',
              avatar_url: commit.author?.avatar_url
            },
            date: commit.commit.author?.date || '',
            url: commit.html_url,
            repository: {
              name: repo.name,
              full_name: repo.full_name,
              url: repo.html_url
            }
          }))

          allCommits.push(...formattedCommits)
        } catch (repoError) {
          console.warn(`Erro ao buscar commits do repo ${repo.name}:`, repoError)
        }
      }

      // Ordenar por data
      allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      setCommits(allCommits.slice(0, 20)) // Mostrar apenas os 20 mais recentes
    } catch (err) {
      console.error('Erro ao buscar commits:', err)
      setError('Erro ao carregar commits. Verifique suas permissões do GitHub.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCommits()
  }

  useEffect(() => {
    fetchCommits()
  }, [accessToken])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return 'Ontem'
    return date.toLocaleDateString('pt-BR')
  }

  const truncateMessage = (message: string, maxLength: number = 100) => {
    const firstLine = message.split('\n')[0]
    return firstLine.length > maxLength 
      ? firstLine.substring(0, maxLength) + '...' 
      : firstLine
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <GitCommit className="w-8 h-8 mr-3 text-purple-400" />
            Feed de Commits
          </h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 mb-4">
            <GitCommit className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Erro ao carregar commits</h3>
            <p className="text-red-300 mt-2">{error}</p>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="border-red-400/30 text-red-300 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <GitCommit className="w-8 h-8 mr-3 text-purple-400" />
          Feed de Commits
        </h2>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
            {commits.length} commits
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Feed */}
      {commits.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <GitCommit className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum commit encontrado</h3>
            <p className="text-white/60">
              Não encontramos commits recentes em seus repositórios. 
              Faça alguns commits e volte aqui!
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {commits.map((commit) => (
              <Card 
                key={commit.sha} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <Avatar 
                      className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onUserClick && onUserClick(commit.author.name)}
                    >
                      <AvatarImage src={commit.author.avatar_url} alt={commit.author.name} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {commit.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-medium text-lg leading-relaxed">
                            {truncateMessage(commit.message)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                            <span 
                              className="hover:text-purple-300 cursor-pointer transition-colors"
                              onClick={() => onUserClick && onUserClick(commit.author.name)}
                            >
                              {commit.author.name}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(commit.date)}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white hover:bg-white/10"
                          onClick={() => window.open(commit.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Repository Info */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="w-4 h-4 text-purple-400" />
                          <span 
                            className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors font-medium"
                            onClick={() => window.open(commit.repository.url, '_blank')}
                          >
                            {commit.repository.name}
                          </span>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className="border-white/20 text-white/70 text-xs"
                        >
                          {commit.sha.substring(0, 7)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Footer Stats */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-300">{commits.length}</div>
              <div className="text-white/60 text-sm">Commits Recentes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-300">
                {new Set(commits.map(c => c.repository.name)).size}
              </div>
              <div className="text-white/60 text-sm">Repositórios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-300">
                {new Set(commits.map(c => c.author.name)).size}
              </div>
              <div className="text-white/60 text-sm">Contribuidores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


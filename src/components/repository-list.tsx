"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { GitFork, Star, Eye, ExternalLink, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

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
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
}

interface RepositoryListProps {
  accessToken: string
  onUserClick: (username: string) => void
}

export default function RepositoryList({ accessToken, onUserClick }: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated")

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true)
        const octokit = new Octokit({ auth: accessToken })

        // Buscar repositórios do usuário autenticado
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
          sort: "updated",
          per_page: 100,
          type: "all"
        })

        setRepositories(repos as Repository[])
        setFilteredRepos(repos as Repository[])
      } catch (err) {
        setError("Erro ao carregar repositórios")
        console.error("Erro ao buscar repositórios:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [accessToken])

  useEffect(() => {
    let filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Ordenar repositórios
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count
        case "name":
          return a.name.localeCompare(b.name)
        case "updated":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

    setFilteredRepos(filtered)
  }, [repositories, searchTerm, sortBy])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Hoje"
    if (diffInDays === 1) return "Ontem"
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: diffInDays > 365 ? "numeric" : undefined
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
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-10 bg-muted rounded"></div>
          </CardHeader>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-12"></div>
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
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Meus Repositórios
                <Badge variant="secondary">{repositories.length}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie e explore seus projetos
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar repositórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "updated" | "stars" | "name")}
                className="px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option value="updated">Mais recentes</option>
                <option value="stars">Mais estrelas</option>
                <option value="name">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de repositórios */}
      {filteredRepos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum repositório encontrado para sua busca." : "Nenhum repositório encontrado."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-md transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-foreground hover:text-primary truncate"
                        asChild
                      >
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <span className="truncate">{repo.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {repo.private && (
                        <Badge variant="secondary" className="text-xs">
                          Privado
                        </Badge>
                      )}
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {repo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {repo.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <Separator className="mb-3" />
                
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
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Atualizado {formatDate(repo.updated_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


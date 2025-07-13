"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea } from "./ui/scroll-area"
import { 
  Search, 
  Star, 
  GitFork, 
  Eye, 
  Book, 
  ExternalLink,
  Calendar,
  Filter,
  Plus,
  Check,
  Bell,
  BellOff,
  RefreshCw
} from "lucide-react"

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  updated_at: string
  html_url: string
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
  subscribed?: boolean
}

interface RepositoryListProps {
  accessToken: string
  onUserClick?: (username: string) => void
}

export default function RepositoryList({ accessToken, onUserClick }: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")
  const [subscribedRepos, setSubscribedRepos] = useState<Set<number>>(new Set())
  const [refreshing, setRefreshing] = useState(false)

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchRepositories = async () => {
    try {
      setError(null)
      
      // Buscar repositórios do usuário autenticado
      const { data: userRepos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 50,
        type: 'all'
      })

      // Buscar repositórios que o usuário está assistindo
      const { data: watchedRepos } = await octokit.rest.activity.listWatchedReposForAuthenticatedUser({
        per_page: 30
      })

      // Combinar e remover duplicatas
      const allRepos = [...userRepos, ...watchedRepos]
      const uniqueRepos = allRepos.filter((repo, index, self) => 
        index === self.findIndex(r => r.id === repo.id)
      )

      // Verificar status de inscrição para cada repositório
      const reposWithSubscription = await Promise.all(
        uniqueRepos.map(async (repo) => {
          try {
            const { data: subscription } = await octokit.rest.activity.getRepoSubscription({
              owner: repo.owner.login,
              repo: repo.name
            })
            return { ...repo, subscribed: subscription.subscribed }
          } catch {
            return { ...repo, subscribed: false }
          }
        })
      )

      setRepositories(reposWithSubscription as Repository[])
      setFilteredRepos(reposWithSubscription as Repository[])
      
      // Atualizar set de repositórios inscritos
      const subscribed = new Set(
        reposWithSubscription
          .filter(repo => repo.subscribed)
          .map(repo => repo.id)
      )
      setSubscribedRepos(subscribed)
      
    } catch (err) {
      console.error('Erro ao buscar repositórios:', err)
      setError('Erro ao carregar repositórios.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRepositories()
  }

  const toggleSubscription = async (repo: Repository) => {
    try {
      const isCurrentlySubscribed = subscribedRepos.has(repo.id)
      
      if (isCurrentlySubscribed) {
        // Cancelar inscrição
        await octokit.rest.activity.deleteRepoSubscription({
          owner: repo.owner.login,
          repo: repo.name
        })
        setSubscribedRepos(prev => {
          const newSet = new Set(prev)
          newSet.delete(repo.id)
          return newSet
        })
      } else {
        // Inscrever-se
        await octokit.rest.activity.setRepoSubscription({
          owner: repo.owner.login,
          repo: repo.name,
          subscribed: true,
          ignored: false
        })
        setSubscribedRepos(prev => new Set(prev).add(repo.id))
      }
      
      // Atualizar o repositório na lista
      setRepositories(prev => 
        prev.map(r => 
          r.id === repo.id 
            ? { ...r, subscribed: !isCurrentlySubscribed }
            : r
        )
      )
      setFilteredRepos(prev => 
        prev.map(r => 
          r.id === repo.id 
            ? { ...r, subscribed: !isCurrentlySubscribed }
            : r
        )
      )
      
    } catch (err) {
      console.error('Erro ao alterar inscrição:', err)
    }
  }

  useEffect(() => {
    fetchRepositories()
  }, [accessToken])

  useEffect(() => {
    let filtered = repositories

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.login.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por linguagem
    if (languageFilter) {
      filtered = filtered.filter(repo => repo.language === languageFilter)
    }

    setFilteredRepos(filtered)
  }, [searchTerm, languageFilter, repositories])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoje'
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      'C++': 'bg-pink-500',
      'C#': 'bg-purple-500',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-red-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600',
      Swift: 'bg-orange-400',
      Kotlin: 'bg-purple-600',
    }
    return colors[language] || 'bg-gray-500'
  }

  const uniqueLanguages = Array.from(
    new Set(repositories.map(repo => repo.language).filter(Boolean))
  ).sort()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Book className="w-8 h-8 mr-3 text-purple-400" />
            Repositórios
          </h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
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
            <Book className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Erro ao carregar repositórios</h3>
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
          <Book className="w-8 h-8 mr-3 text-purple-400" />
          Repositórios
        </h2>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
            {filteredRepos.length} repositórios
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

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Buscar repositórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white"
              >
                <option value="">Todas as linguagens</option>
                {uniqueLanguages.map(lang => (
                  <option key={lang} value={lang} className="bg-slate-800">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository List */}
      {filteredRepos.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <Book className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || languageFilter ? 'Nenhum repositório encontrado' : 'Nenhum repositório'}
            </h3>
            <p className="text-white/60">
              {searchTerm || languageFilter 
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não tem repositórios ou não está assistindo nenhum.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredRepos.map((repo) => (
              <Card 
                key={repo.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Owner Avatar */}
                      <Avatar 
                        className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onUserClick && onUserClick(repo.owner.login)}
                      >
                        <AvatarImage src={repo.owner.avatar_url} alt={repo.owner.login} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {repo.owner.login.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Repository Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 
                            className="text-white font-semibold text-xl hover:text-purple-300 cursor-pointer transition-colors"
                            onClick={() => window.open(repo.html_url, '_blank')}
                          >
                            {repo.name}
                          </h3>
                          {repo.private && (
                            <Badge variant="outline" className="border-yellow-400/30 text-yellow-300 text-xs">
                              Privado
                            </Badge>
                          )}
                          <ExternalLink 
                            className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors"
                            onClick={() => window.open(repo.html_url, '_blank')}
                          />
                        </div>
                        
                        <p 
                          className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors text-sm mb-2"
                          onClick={() => onUserClick && onUserClick(repo.owner.login)}
                        >
                          {repo.owner.login}
                        </p>
                        
                        {repo.description && (
                          <p className="text-white/70 mb-4 leading-relaxed">
                            {repo.description}
                          </p>
                        )}
                        
                        {/* Repository Stats */}
                        <div className="flex items-center space-x-6 text-sm text-white/60">
                          {repo.language && (
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(repo.language)}`} />
                              <span>{repo.language}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {repo.stargazers_count}
                          </div>
                          
                          <div className="flex items-center">
                            <GitFork className="w-4 h-4 mr-1" />
                            {repo.forks_count}
                          </div>
                          
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {repo.watchers_count}
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(repo.updated_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Button */}
                    <Button
                      onClick={() => toggleSubscription(repo)}
                      variant={subscribedRepos.has(repo.id) ? "default" : "outline"}
                      size="sm"
                      className={
                        subscribedRepos.has(repo.id)
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {subscribedRepos.has(repo.id) ? (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Inscrito
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 mr-2" />
                          Inscrever-se
                        </>
                      )}
                    </Button>
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
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-300">{repositories.length}</div>
              <div className="text-white/60 text-sm">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-300">{subscribedRepos.size}</div>
              <div className="text-white/60 text-sm">Inscritos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-300">{uniqueLanguages.length}</div>
              <div className="text-white/60 text-sm">Linguagens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">
                {repositories.filter(r => !r.private).length}
              </div>
              <div className="text-white/60 text-sm">Públicos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect, useCallback } from "react"
import { Octokit } from "@octokit/rest"
import { useTranslations } from 'next-intl'
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"
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
  locale?: string
}

export default function RepositoryList({ accessToken, onUserClick, locale = 'en' }: RepositoryListProps) {
  const t = useTranslations('RepositoryList')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")
  const [subscribedRepos, setSubscribedRepos] = useState<Set<number>>(new Set())
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalRepos, setTotalRepos] = useState(0)
  const REPOS_PER_PAGE = 30

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchRepositories = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      // Buscar contagem total de repositórios do usuário
      const response = await octokit.request('GET /user/repos', {
        per_page: 1,
        affiliation: 'owner,collaborator,organization_member'
      })

      // Extrair o total do header Link
      const linkHeader = response.headers.link
      if (linkHeader) {
        const match = linkHeader.match(/page=([0-9]+)>; rel="last"/)
        if (match) {
          const total = parseInt(match[1])
          setTotalRepos(total)
        }
      } else {
        // Se não houver header Link, significa que há apenas uma página
        const { data: allRepos } = await octokit.rest.repos.listForAuthenticatedUser({
          affiliation: 'owner,collaborator,organization_member'
        })
        setTotalRepos(allRepos.length)
      }

      // Buscar página atual de repositórios
      const { data: allRepos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: REPOS_PER_PAGE,
        page: pageNum,
        affiliation: 'owner,collaborator,organization_member'
      })

      // Buscar todos os repositórios que o usuário está assistindo
      const { data: allWatchedRepos } = await octokit.rest.activity.listWatchedReposForAuthenticatedUser({
        per_page: 100,
        page: 1
      })

      // Criar um Set com os IDs dos repositórios assistidos
      const subscribedRepoIds = new Set(allWatchedRepos.map(repo => repo.id))

      // Adicionar status de inscrição aos repositórios
      const reposWithSubscription = allRepos.map(repo => ({
        ...repo,
        description: repo.description || '',
        subscribed: subscribedRepoIds.has(repo.id)
      })) as Repository[]

      if (append) {
        setRepositories(prev => [...prev, ...reposWithSubscription])
        setFilteredRepos(prev => [...prev, ...reposWithSubscription])
      } else {
        setRepositories(reposWithSubscription)
        setFilteredRepos(reposWithSubscription)
      }
      
      // Atualizar set de repositórios inscritos
      setSubscribedRepos(subscribedRepoIds)
      setHasMore(reposWithSubscription.length === REPOS_PER_PAGE)
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
      
    } catch (err) {
      console.error('Erro ao buscar repositórios:', err)
      setError('Erro ao carregar repositórios.')
      setSubscribedRepos(subscribedRepos)
      setHasMore(false)
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setPage(1)
    void fetchRepositories(1, false)
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
    void fetchRepositories(1, false)
  }, [accessToken])

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when 20% from bottom of page
    if (documentHeight - scrollPosition <= window.innerHeight * 0.2 && !loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      void fetchRepositories(nextPage, true);
    }
  }, [loading, loadingMore, hasMore, page]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    let filtered = repositories

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((repo: Repository) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.login.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por linguagem
    if (languageFilter) {
      filtered = filtered.filter((repo: Repository) => repo.language === languageFilter)
    }

    setFilteredRepos(filtered)
    setHasMore(filtered.length >= REPOS_PER_PAGE)
  }, [searchTerm, languageFilter, repositories, REPOS_PER_PAGE])

  const formatDate = (dateString: string, locale: string = 'en') => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return t('today')
    if (diffInDays === 1) return t('yesterday')
    if (diffInDays < 7) return t('daysAgo', { days: diffInDays })
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {t('total')}: {totalRepos}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {t('subscribed')}: {subscribedRepos.size}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {t('languages')}: {uniqueLanguages.length}
          </Badge>
        </div>
        
        <div className="space-y-1 min-w-0">
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
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="bg-white/5">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white mb-1">{filteredRepos.length}</div>
            <div className="text-sm text-white/70">{t('total')}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white mb-1">{subscribedRepos.size}</div>
            <div className="text-sm text-white/70">{t('subscribed')}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white mb-1">{uniqueLanguages.length}</div>
            <div className="text-sm text-white/70">{t('languages')}</div>
          </CardContent>
        </Card>
       
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Book className="w-8 h-8 mr-3 text-purple-400" />
          {t('title')}
        </h2>
        
        <div className="flex items-center space-x-4 min-w-0">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
            {filteredRepos.length} {t('repositories')}
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh')}
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
                  placeholder={t('searchPlaceholder')}
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
                <option value="">{t('allLanguages')}</option>
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
              {searchTerm || languageFilter ? t('noRepositoriesFound') : t('noRepositories')}
            </h3>
            <p className="text-white/60">
              {searchTerm || languageFilter 
                ? t('tryAdjustingFilters')
                : t('noRepositoriesYet')
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRepos.map((repo) => (
            <Card 
              key={repo.id} 
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift"
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        <div className="font-medium text-lg text-white hover:text-purple-300 cursor-pointer truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
                          {repo.name}
                        </div>
                        {repo.private && (
                          <Badge variant="outline" className="border-yellow-400/30 text-yellow-300 text-xs">
                            {t('private')}
                          </Badge>
                        )}
                        <ExternalLink 
                          className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors"
                          onClick={() => window.open(repo.html_url, '_blank')}
                        />
                      </div>
                      
                      <div 
                        className="text-white hover:text-purple-200 cursor-pointer transition-colors text-sm mb-2"
                        onClick={() => onUserClick && onUserClick(repo.owner.login)}
                      >
                        @{repo.owner.login}
                      </div>
                      
                      {repo.description && (
                        <p className="text-white mb-4 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                      
                      {/* Repository Stats */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-white/10">
                        {repo.language && (
                          <div className="flex items-center text-white">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(repo.language)}`} />
                            <span>{repo.language}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-white">
                          <Star className="w-4 h-4 mr-1" />
                          {repo.stargazers_count}
                        </div>
                        
                        <div className="flex items-center text-white">
                          <GitFork className="w-4 h-4 mr-1" />
                          {repo.forks_count}
                        </div>
                        
                        <div className="flex items-center text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          {repo.watchers_count}
                        </div>
                        
                        <div className="flex items-center text-white">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(repo.updated_at, locale)}
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
                          {t('subscribed')}
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 mr-2" />
                          {t('subscribe')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="mt-4 flex justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-white/40" />
        </div>
      )}
    </div>
  )
}

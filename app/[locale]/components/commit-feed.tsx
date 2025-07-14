"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { GitCommit, Calendar, ExternalLink, RefreshCw, Star, GitBranch, Book, Users } from "lucide-react"

interface Commit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    avatar_url?: string
    login?: string
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
  locale?: string
}

const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return locale === 'pt' ? 'Agora mesmo' : 'Just now'
  if (diffInHours < 24) return locale === 'pt' ? `${diffInHours}h atrás` : `${diffInHours}h ago`
  if (diffInHours < 48) return locale === 'pt' ? 'Ontem' : 'Yesterday'
  return date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')
}

export default function CommitFeed({ accessToken, onUserClick, locale = 'en' }: CommitFeedProps) {
  const t = useTranslations('CommitFeed')
  const pathname = usePathname()
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [stats, setStats] = useState<{
    recentCommits: number
    repositories: number
    totalRepos: number
    contributors: Set<string>
  }>({ recentCommits: 0, repositories: 0, totalRepos: 0, contributors: new Set() })

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchCommits = async (pageNum = 1, append = false) => {
    try {
      setError(null)
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      // Buscar contagem total de repositórios
      const response = await octokit.request('GET /user/repos', {
        per_page: 1,
        affiliation: 'owner,collaborator,organization_member'
      })

      // Extrair total do header Link
      let totalRepos = 0
      const linkHeader = response.headers.link
      if (linkHeader) {
        const match = linkHeader.match(/page=([0-9]+)>; rel="last"/)
        if (match) {
          totalRepos = parseInt(match[1])
        }
      }

      // Buscar repositórios da página atual
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 30,
        page: pageNum,
        affiliation: 'owner,collaborator,organization_member'
      })

      const allCommits: Commit[] = []
      const contributors = new Set<string>()

      // Buscar commits de cada repositório
      for (const repo of repos) {
        try {
          const { data: repoCommits } = await octokit.rest.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            per_page: 5, // Reduzido para carregar menos commits inicialmente
            page: pageNum,
            since: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // Últimos 90 dias
          })

          repoCommits.forEach(commit => {
            if (commit.author?.login) {
              contributors.add(commit.author.login)
            }
          })

          const formattedCommits = repoCommits.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: {
              name: commit.commit.author?.name || 'Unknown',
              email: commit.commit.author?.email || '',
              avatar_url: commit.author?.avatar_url,
              login: commit.author?.login
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
      
      // Atualizar estatísticas
      setStats({
        recentCommits: allCommits.length,
        repositories: repos.length,
        totalRepos: totalRepos,
        contributors: contributors
      })

      if (append) {
        setCommits(prev => [...prev, ...allCommits])
      } else {
        setCommits(allCommits)
      }
      
      // Se não houver commits ou se houver menos que o esperado, não há mais para carregar
      if (append) {
        setHasMore(allCommits.length > 0)
      } else {
        setHasMore(allCommits.length >= 5)
      }
    } catch (err) {
      console.error('Erro ao buscar commits:', err)
      setError('Erro ao carregar commits. Verifique suas permissões do GitHub.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }

  const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const handleScroll = debounce(() => {
    if (loading || loadingMore || !hasMore) return;

    const scrollPosition = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    // Load more when 20% from bottom of page
    if (documentHeight - scrollPosition <= window.innerHeight * 0.2) {
      const nextPage = page + 1
      setPage(nextPage)
      setLoadingMore(true)
      void fetchCommits(nextPage, true)
    }
  }, 150)

  const handleRefresh = async () => {
    setRefreshing(true)
    setPage(1)
    await fetchCommits(1)
  }

  useEffect(() => {
    fetchCommits(1)
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
    
    // Auto refresh every 2 minutes
    const autoRefreshInterval = setInterval(() => {
      void fetchCommits(1, false)
    }, 2 * 60 * 1000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(autoRefreshInterval)
    }
  }, [accessToken])



  const truncateMessage = (message: string, maxLength: number = 100) => {
    const firstLine = message.split('\n')[0]
    return firstLine.length > maxLength 
      ? firstLine.substring(0, maxLength) + '...' 
      : firstLine
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <GitCommit className="w-8 h-8 mr-3 text-purple-400" />
            {t('title')}
          </h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
            {t('tryAgain')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{t('repositories')}</p>
              <div className="text-3xl font-bold text-white mb-1">{stats.repositories}</div>
              <div className="text-sm text-white/70">{t('total')}</div>
            </div>
            <Book className="w-8 h-8 text-purple-400" />
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{t('today')}</p>
              <div className="text-3xl font-bold text-white mb-1">{stats.recentCommits}</div>
              <div className="text-sm text-white/70">{t('total')}</div>
            </div>
            <GitCommit className="w-8 h-8 text-purple-400" />
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{t('yesterday')}</p>
              <div className="text-3xl font-bold text-white mb-1">{stats.contributors.size}</div>
              <div className="text-sm text-white/70">{t('contributors')}</div>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </CardContent>
        </Card>
      </div>

      {commits.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
      ) : (
        <div className="space-y-4">
          {commits.map((commit) => (
            <Card 
              key={commit.sha} 
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift overflow-hidden"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  <Avatar 
                    className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                    onClick={() => commit.author.login && onUserClick && onUserClick(commit.author.login)}
                  >
                    <AvatarImage src={commit.author.avatar_url} alt={commit.author.name} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {commit.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-white font-medium text-lg leading-relaxed truncate max-w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
                          {truncateMessage(commit.message)}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <span 
                            className={`transition-colors ${commit.author.login ? 'hover:text-purple-300 cursor-pointer' : ''}`}
                            onClick={() => commit.author.login && onUserClick && onUserClick(commit.author.login)}
                          >
                            {commit.author.name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(commit.date, locale)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(commit.url, '_blank')}
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2 min-w-0">
                        <GitBranch className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span 
                          className="text-white hover:text-purple-200 cursor-pointer transition-colors font-medium truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px]"
                          onClick={() => window.open(commit.repository.url, '_blank')}
                        >
                          {commit.repository.name}
                        </span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="border-white/20 text-white text-xs flex-shrink-0"
                      >
                        {commit.sha.substring(0, 7)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {loadingMore && (
            <Card className="bg-white/5 border-white/10 mt-4">
              <CardContent className="py-6 flex justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )};

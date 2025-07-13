"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { ScrollArea } from "./ui/scroll-area"
import { 
  ArrowLeft, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  Star, 
  GitFork, 
  Book, 
  ExternalLink,
  Github,
  Mail,
  Building,
  GitCommit
} from "lucide-react"

interface UserProfile {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  blog: string
  email: string
  company: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  html_url: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  html_url: string
  private: boolean
}

interface UserProfileProps {
  username: string
  accessToken: string
  onBack: () => void
}

export default function UserProfile({ username, accessToken, onBack }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchUserData = async () => {
    try {
      setError(null)
      
      // Buscar perfil do usuário
      const { data: userProfile } = await octokit.rest.users.getByUsername({
        username: username
      })

      setProfile(userProfile as UserProfile)

      // Buscar repositórios do usuário
      const { data: userRepos } = await octokit.rest.repos.listForUser({
        username: username,
        sort: 'updated',
        per_page: 12,
        type: 'all'
      })

      setRepositories(userRepos as Repository[])
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err)
      setError('Erro ao carregar perfil do usuário.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [username, accessToken])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    })
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-8 text-center">
            <div className="text-red-400">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Erro ao carregar perfil</h3>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Feed
        </Button>
        
        <Button
          onClick={() => window.open(profile.html_url, '_blank')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Github className="w-4 h-4 mr-2" />
          Ver no GitHub
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <Avatar className="w-32 h-32 mx-auto md:mx-0">
              <AvatarImage src={profile.avatar_url} alt={profile.name || profile.login} />
              <AvatarFallback className="bg-purple-600 text-white text-4xl">
                {(profile.name || profile.login).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {profile.name || profile.login}
              </h1>
              <p className="text-xl text-purple-300 mb-4">@{profile.login}</p>
              
              {profile.bio && (
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
                {profile.company && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-purple-400" />
                    <span>{profile.company}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-purple-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
                
                {profile.blog && (
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2 text-purple-400" />
                    <a 
                      href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      {profile.blog}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Desde {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">{profile.public_repos}</div>
              <div className="text-white/60">Repositórios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300">{profile.followers}</div>
              <div className="text-white/60">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">{profile.following}</div>
              <div className="text-white/60">Seguindo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repositories */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Book className="w-6 h-6 mr-3 text-purple-400" />
            Repositórios Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          {repositories.length === 0 ? (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Nenhum repositório público encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo) => (
                <Card 
                  key={repo.id} 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift cursor-pointer"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-semibold text-lg truncate flex-1">
                        {repo.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-white/40 ml-2 flex-shrink-0" />
                    </div>
                    
                    {repo.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {repo.language && (
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(repo.language)}`} />
                            <span className="text-white/60 text-sm">{repo.language}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-white/60 text-sm">
                          <Star className="w-3 h-3 mr-1" />
                          {repo.stargazers_count}
                        </div>
                        
                        <div className="flex items-center text-white/60 text-sm">
                          <GitFork className="w-3 h-3 mr-1" />
                          {repo.forks_count}
                        </div>
                      </div>
                      
                      {repo.private && (
                        <Badge variant="outline" className="border-yellow-400/30 text-yellow-300 text-xs">
                          Privado
                        </Badge>
                      )}
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


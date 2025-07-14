"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { Github, Star, GitBranch, Users, Code, Zap, Shield, Sparkles, ArrowRight, Heart, TrendingUp } from "lucide-react"
import { Button } from "../ui/button"
import { useTranslations } from 'next-intl'
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { useRouter, usePathname } from 'next/navigation'

export default function LandingPage() {
  const t = useTranslations('LandingPage')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentLang = pathname.split('/')[1]
    setLanguage(currentLang)
  }, [pathname])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'pt' : 'en'
    const newPath = pathname.replace(`/${language}`, `/${newLang}`)
    router.push(newPath)
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { callbackUrl: "/" })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: GitBranch,
      title: t('features.commits'),
      description: t('features.commitsDesc'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: t('features.profile'),
      description: t('features.profileDesc'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Code,
      title: t('features.repos'),
      description: t('features.reposDesc'),
      color: "from-green-500 to-emerald-500"
    }
  ]

  const stats = [
    { number: "100%", label: "Integração GitHub", icon: Github },
    { number: "0ms", label: "Tempo de Setup", icon: Zap },
    { number: "∞", label: "Repositórios", icon: Code }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Github className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  GitHub Feed
                </span>
                <Badge variant="secondary" className="ml-3 bg-purple-500/20 text-purple-200 border-purple-400/30">
                  <Star className="w-3 h-3 mr-1" />
                  Beta
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {language.toUpperCase()}
              </Button>
              <div className="hidden md:flex space-x-6">
                <a href="#features">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    {t('nav.features')}
                  </Button>
                </a>
                <a href="#about">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    {t('nav.about')}
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    {t('nav.contact')}
                  </Button>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight">
              {t('title')}
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                {t('subtitle')}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t('about.description')}
              <span className="text-purple-300 font-semibold"> {t('about.stats.integration')}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-10 py-8 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover-lift pulse-glow"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-6 h-6 mr-3" />
                  {t('hero.loginButton')}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>


          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover-lift">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-purple-300 mb-2">{stat.number}</div>
                    <div className="text-white/70 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold mb-6">
            {t('features.title')}
            <span className="text-purple-400"> {t('features.subtitle')}</span>
          </h2>
          <p className="text-2xl text-white/70 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group hover-lift">
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-white/80">{t('about.loved')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-white/80">{t('about.growing')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-white/80">{t('about.secure')}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {t('subtitle')}
            </p>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-white text-purple-900 hover:bg-white/90 px-10 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover-lift"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin mr-3" />
                  Conectando...
                </>
              ) : (
                <>
                  <Github className="w-6 h-6 mr-3" />
                  {t('about.startButton')}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">{t('contact.title')}</h2>
        <p className="text-xl text-white/80 mb-8">
          {t('contact.developer')}
        </p>
        <a 
          href="https://github.com/caiobraga"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Github className="w-6 h-6" />
          <span>github.com/caiobraga</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">GitHub Feed</span>
            </div>
            <p className="text-white/60 text-lg">
              {t('footer.tagline')}
            </p>
            <div className="flex justify-center space-x-8 text-white/50">
              <Button variant="ghost" className="text-white/50 hover:text-white">Privacidade</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">Termos</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">Suporte</Button>
              <Button variant="ghost" className="text-white/50 hover:text-white">API</Button>
            </div>
            <div className="text-white/40 text-sm">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


"use client"

import { useSession } from "next-auth/react"
import { Home, BookOpen, Users, TrendingUp, Settings, Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { data: session } = useSession()

  const menuItems = [
    { id: "feed", label: "Feed", icon: Home, badge: null },
    { id: "repositories", label: "Repositórios", icon: BookOpen, badge: null },
    { id: "trending", label: "Trending", icon: TrendingUp, badge: "Em breve" },
    { id: "network", label: "Rede", icon: Users, badge: "Em breve" },
  ]

  if (!session?.user) return null

  return (
    <div className="w-64 h-full bg-background border-r sticky top-16">
      <div className="p-4 space-y-4">
        {/* Perfil do usuário */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback>
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  @{session.user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold">0</p>
                <p className="text-xs text-muted-foreground">Seguidores</p>
              </div>
              <div>
                <p className="text-lg font-semibold">0</p>
                <p className="text-xs text-muted-foreground">Seguindo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu de navegação */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isDisabled = item.badge === "Em breve"
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-12 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isDisabled && onTabChange(item.id)}
                disabled={isDisabled}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>

        <Separator />

        {/* Ações rápidas */}
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start h-10" disabled>
            <Bell className="h-4 w-4 mr-3" />
            <span className="flex-1 text-left">Notificações</span>
            <Badge variant="outline" className="text-xs">Em breve</Badge>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start h-10" disabled>
            <Search className="h-4 w-4 mr-3" />
            <span className="flex-1 text-left">Buscar</span>
            <Badge variant="outline" className="text-xs">Em breve</Badge>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start h-10" disabled>
            <Settings className="h-4 w-4 mr-3" />
            <span className="flex-1 text-left">Configurações</span>
            <Badge variant="outline" className="text-xs">Em breve</Badge>
          </Button>
        </div>

        {/* Estatísticas rápidas */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-3">Sua Atividade</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Commits hoje</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Repositórios</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Linguagens</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


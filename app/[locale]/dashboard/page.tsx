"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import CommitFeed from "../components/commit-feed"
import RepositoryList from "../components/repository-list"
import Settings from "../components/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useLocalStorage } from "../hooks/use-local-storage"


export default function Dashboard() {
  const t = useTranslations('Dashboard')
  const [activeTab, setActiveTab] = useState("feed")
  const [accessToken, setAccessToken] = useLocalStorage<string>("github-token", "")

  const handleTokenChange = (newToken: string) => {
    setAccessToken(newToken)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="feed">{t('feed')}</TabsTrigger>
          <TabsTrigger value="repositories">{t('repositories')}</TabsTrigger>
          <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <CommitFeed accessToken={accessToken} />
        </TabsContent>

        <TabsContent value="repositories" className="mt-6">
          <RepositoryList accessToken={accessToken} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Settings 
            accessToken={accessToken} 
            onTokenChange={handleTokenChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Octokit } from "@octokit/rest"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"
import { Settings as SettingsIcon, Key, RefreshCw } from "lucide-react"
import { toast } from 'sonner'

interface SettingsProps {
  accessToken: string
  onTokenChange: (newToken: string) => void
  locale?: string
}

export default function Settings({ accessToken, onTokenChange, locale = 'en' }: SettingsProps) {
  const t = useTranslations('Settings')
  const [newToken, setNewToken] = useState("")
  const [rateLimit, setRateLimit] = useState<{
    limit: number
    remaining: number
    reset: Date
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const octokit = new Octokit({
    auth: accessToken,
  })

  const fetchRateLimit = async () => {
    try {
      const { data } = await octokit.rest.rateLimit.get()
      setRateLimit({
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000)
      })
    } catch (error) {
      console.error('Error fetching rate limit:', error)
      toast.error(t('rateLimitError'))
    }
  }

  useEffect(() => {
    void fetchRateLimit()
    // Refresh rate limit every minute
    const interval = setInterval(fetchRateLimit, 60000)
    return () => clearInterval(interval)
  }, [accessToken])

  const handleSaveToken = () => {
    if (!newToken) {
      toast.error(t('tokenRequired'))
      return
    }

    setLoading(true)
    // Test the new token
    const testOctokit = new Octokit({ auth: newToken })
    testOctokit.rest.users.getAuthenticated()
      .then(() => {
        onTokenChange(newToken)
        setNewToken("")
        toast.success(t('tokenSaved'))
        void fetchRateLimit()
      })
      .catch(() => {
        toast.error(t('invalidToken'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* API Key Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="w-5 h-5" />
                {t('apiKeyTitle')}
              </h3>
              <div className="flex gap-4">
                <Input
                  type="password"
                  placeholder={t('tokenPlaceholder')}
                  value={newToken}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewToken(e.target.value)}
                />
                <Button 
                  onClick={handleSaveToken}
                  disabled={loading}
                >
                  {t('saveToken')}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                {t('tokenInstructions')}
              </p>
            </div>

            {/* Rate Limit Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t('rateLimitTitle')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRateLimit}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('refresh')}
                </Button>
              </div>
              {rateLimit && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{t('total')}</p>
                    <Badge variant="outline">{rateLimit.limit}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{t('remaining')}</p>
                    <Badge 
                      variant={rateLimit.remaining < 100 ? "destructive" : "outline"}
                    >
                      {rateLimit.remaining}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{t('reset')}</p>
                    <Badge variant="outline">
                      {new Date(rateLimit.reset).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

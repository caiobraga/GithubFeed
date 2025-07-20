"use client"

import { useLocalStorage } from "../hooks/use-local-storage"
import Settings from "../components/settings"
import { Button } from "../ui/button"

export default function SettingsPage() {
  const [accessToken, setAccessToken] = useLocalStorage<string>("github-token", "")

  const handleTokenChange = (newToken: string) => {
    setAccessToken(newToken)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
      </div>
      <Settings 
        accessToken={accessToken} 
        onTokenChange={handleTokenChange}
      />
    </div>
  )
}

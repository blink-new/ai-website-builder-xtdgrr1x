import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { LandingPage } from './components/LandingPage'
import { BuilderInterface } from './components/BuilderInterface'
import { blink } from './blink/client'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'builder'>('landing')
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleStartBuilding = (prompt: string) => {
    setCurrentProject(prompt)
    setCurrentView('builder')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
    setCurrentProject(null)
  }

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">AI</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to AI Builder</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to start building amazing websites with AI
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'landing' ? (
        <LandingPage onStartBuilding={handleStartBuilding} />
      ) : (
        <BuilderInterface 
          initialPrompt={currentProject || ''} 
          onBackToLanding={handleBackToLanding}
        />
      )}
      <Toaster position="top-right" />
    </div>
  )
}

export default App
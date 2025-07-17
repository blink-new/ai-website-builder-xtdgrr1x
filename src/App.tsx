import { useState } from 'react'
import { Toaster } from 'sonner'
import { LandingPage } from './components/LandingPage'
import { BuilderInterface } from './components/BuilderInterface'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'builder'>('landing')
  const [currentProject, setCurrentProject] = useState<string | null>(null)

  const handleStartBuilding = (prompt: string) => {
    setCurrentProject(prompt)
    setCurrentView('builder')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
    setCurrentProject(null)
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
import { useState, useEffect } from 'react'
import './styles/globals.css'
import './App.css'
import ComponentsDemo from './pages/ComponentsDemo'
import { Button } from './components/ui'
import { Palette, Home } from 'lucide-react'

type Page = 'home' | 'components'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'components') {
        setCurrentPage('components')
      } else {
        setCurrentPage('home')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'components':
        return <ComponentsDemo />
      case 'home':
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      {currentPage !== 'home' && (
        <nav className="fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.hash = ''
              setCurrentPage('home')
            }}
            icon={<Home className="w-4 h-4" />}
          >
            Home
          </Button>
        </nav>
      )}
      {renderPage()}
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 font-fantasy text-gradient-primary">
            DM's Codex
          </h1>
          <p className="text-muted-foreground">
            Il compagno digitale definitivo per i Dungeon Master
          </p>
        </header>
        
        <main className="text-center">
          <div className="bg-card rounded-lg p-8 max-w-md mx-auto border shadow-fantasy">
            <p className="text-card-foreground mb-6">
              Benvenuto in DM's Codex! L'applicazione è stata riorganizzata seguendo la Clean Architecture.
            </p>
            <div className="text-sm text-muted-foreground mb-6 space-y-1">
              <p>• Processo Main: Gestione database e IPC</p>
              <p>• Processo Renderer: React UI</p>
              <p>• Codice Condiviso: Types e utilities</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.hash = '#components'}
                icon={<Palette className="w-4 h-4" />}
                className="w-full"
              >
                Visualizza Design System
              </Button>
              <p className="text-xs text-muted-foreground">
                Esplora i componenti UI implementati
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
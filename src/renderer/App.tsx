import { useState, useEffect } from 'react'
import ComponentsDemo from './pages/ComponentsDemo'
import UIShowcase from './pages/UIShowcase'
import { Button } from './components/ui'
import { Palette, Home, Layout } from 'lucide-react'

type Page = 'home' | 'components' | 'showcase'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'components') {
        setCurrentPage('components')
      } else if (hash === 'showcase') {
        setCurrentPage('showcase')
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
      case 'showcase':
        return <UIShowcase />
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
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.hash = '#components'}
                  icon={<Palette className="w-4 h-4" />}
                  className="w-full"
                >
                  Design System (Classic)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Panoramica completa di tutti i componenti UI
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.location.hash = '#showcase'}
                  icon={<Layout className="w-4 h-4" />}
                  className="w-full"
                  variant="secondary"
                >
                  UI Showcase (Interactive)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Demo interattiva con layout dell'app finale
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
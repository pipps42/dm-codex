import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">DM's Codex</h1>
          <p className="text-gray-400">Il compagno digitale definitivo per i Dungeon Master</p>
        </header>
        
        <main className="text-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-300 mb-4">
              Benvenuto in DM's Codex! L'applicazione è stata riorganizzata seguendo la Clean Architecture.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Processo Main: Gestione database e IPC</p>
              <p>• Processo Renderer: React UI</p>
              <p>• Codice Condiviso: Types e utilities</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
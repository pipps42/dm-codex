import React, { useState } from 'react'
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  Separator
} from '../components/ui'
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  User, 
  Mail, 
  Search,
  Settings,
  Trash2
} from 'lucide-react'

export default function ComponentsDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value.length < 3) {
      setInputError('Minimo 3 caratteri richiesti')
    } else {
      setInputError('')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-fantasy text-gradient-primary">
            DM's Codex Design System
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Componenti UI fondamentali con tema dark fantasy per l'esperienza definitiva del Dungeon Master
          </p>
          <Separator variant="decorative" className="max-w-md mx-auto" />
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-fantasy">Buttons</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Diverse varianti per diversi contesti d'uso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Primary Buttons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Primary Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button loading={isLoading} onClick={handleLoadingDemo}>
                    {isLoading ? 'Casting...' : 'Cast Spell'}
                  </Button>
                  <Button icon={<Sword className="w-4 h-4" />}>
                    Attack
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Secondary Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary" icon={<Shield className="w-4 h-4" />}>
                    Defend
                  </Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Destructive Buttons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Destructive Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="destructive">Delete</Button>
                  <Button variant="destructive" icon={<Trash2 className="w-4 h-4" />}>
                    Remove Character
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Button Sizes</h4>
                <div className="flex items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-fantasy">Form Controls</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>Campi di input per la raccolta dati</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Input */}
                <div className="space-y-2">
                  <Label htmlFor="character-name" required>Nome Personaggio</Label>
                  <Input 
                    id="character-name"
                    placeholder="Es. Gandalf il Grigio" 
                  />
                </div>

                {/* Input with Icon */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="dm@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Input with Error */}
                <div className="space-y-2">
                  <Label htmlFor="validation-test" required>Campo con Validazione</Label>
                  <Input 
                    id="validation-test"
                    placeholder="Scrivi almeno 3 caratteri"
                    value={inputValue}
                    onChange={handleInputChange}
                    error={!!inputError}
                    helperText={inputError || 'Aiuto per compilare il campo'}
                  />
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <Label htmlFor="search">Cerca Incantesimo</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="search"
                      placeholder="Fireball, Magic Missile..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Disabled Input */}
                <div className="space-y-2">
                  <Label htmlFor="disabled">Campo Disabilitato</Label>
                  <Input 
                    id="disabled"
                    placeholder="Non modificabile"
                    disabled
                    value="Valore fisso"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-fantasy">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Character Card */}
            <Card hover>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personaggio
                </CardTitle>
                <CardDescription>
                  Scheda base di un personaggio giocante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livello:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classe:</span>
                    <span className="font-medium">Wizard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HP:</span>
                    <span className="font-medium text-green-400">78/90</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Visualizza Scheda
                </Button>
              </CardFooter>
            </Card>

            {/* Spell Card */}
            <Card hover>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Palla di Fuoco
                </CardTitle>
                <CardDescription>
                  Incantesimo di 3° livello • Evocazione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tempo di lancio:</strong> 1 azione
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Gittata:</strong> 45 metri
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Danno:</strong> 8d6 fuoco
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Combat Card */}
            <Card hover>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Combattimento
                </CardTitle>
                <CardDescription>
                  Stato attuale della battaglia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Round:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turno:</span>
                    <span className="font-medium">Theron</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nemici:</span>
                    <span className="font-medium text-red-400">2 attivi</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="destructive" size="sm" className="flex-1">
                  Fine Turno
                </Button>
                <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4" />}>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Separators Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-fantasy">Separators</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Divisori</CardTitle>
              <CardDescription>Elementi per separare sezioni di contenuto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Separatore Standard</h4>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Contenuto dopo il separatore standard
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Separatore Decorativo</h4>
                <Separator variant="decorative" />
                <p className="text-sm text-muted-foreground">
                  Contenuto dopo il separatore decorativo con effetto gradiente
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm">Separatore Verticale</p>
                <Separator orientation="vertical" className="h-6" />
                <p className="text-sm">Altro contenuto</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center pt-12 pb-6">
          <Separator variant="decorative" className="mb-6" />
          <p className="text-muted-foreground">
            Design System per DM's Codex • Tema Dark Fantasy
          </p>
        </div>
      </div>
    </div>
  )
}
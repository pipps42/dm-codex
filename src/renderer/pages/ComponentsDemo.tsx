import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Switch,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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

        {/* Forms Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-fantasy">Form Components</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Form Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Form Controls</CardTitle>
                <CardDescription>Componenti base per la creazione di form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Select */}
                <div className="space-y-2">
                  <Label htmlFor="character-class">Classe Personaggio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fighter">Guerriero</SelectItem>
                      <SelectItem value="wizard">Mago</SelectItem>
                      <SelectItem value="rogue">Ladro</SelectItem>
                      <SelectItem value="cleric">Chierico</SelectItem>
                      <SelectItem value="ranger">Ranger</SelectItem>
                      <SelectItem value="barbarian">Barbaro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="character-background">Background</Label>
                  <Textarea 
                    id="character-background"
                    placeholder="Descrivi la storia del tuo personaggio..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Switch */}
                <div className="flex items-center space-x-2">
                  <Switch id="multiclass" />
                  <Label htmlFor="multiclass">Personaggio multiclasse</Label>
                </div>
              </CardContent>
            </Card>

            {/* Checkboxes and Radio Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Selection Controls</CardTitle>
                <CardDescription>Controlli per selezioni singole e multiple</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Checkboxes */}
                <div className="space-y-3">
                  <Label>Competenze (multipla selezione)</Label>
                  <div className="space-y-2">
                    {['Acrobazia', 'Arcano', 'Atletica', 'Inganno', 'Storia'].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox id={skill.toLowerCase()} />
                        <Label htmlFor={skill.toLowerCase()}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radio Group */}
                <div className="space-y-3">
                  <Label>Allineamento (selezione singola)</Label>
                  <RadioGroup defaultValue="neutral">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good">Buono</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral">Neutrale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evil" id="evil" />
                      <Label htmlFor="evil">Malvagio</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complete Form Example */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Form Example</CardTitle>
              <CardDescription>Esempio di form completo con react-hook-form e validazione</CardDescription>
            </CardHeader>
            <CardContent>
              <CharacterFormExample />
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

const characterSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  class: z.string({ required_error: "Seleziona una classe" }),
  level: z.coerce.number().min(1).max(20, { message: "Il livello deve essere tra 1 e 20" }),
  background: z.string().min(10, { message: "Il background deve avere almeno 10 caratteri" }),
  multiclass: z.boolean(),
  skills: z.array(z.string()).min(1, { message: "Seleziona almeno una competenza" }),
  alignment: z.string({ required_error: "Seleziona un allineamento" })
})

type CharacterFormValues = z.infer<typeof characterSchema>

function CharacterFormExample() {
  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      multiclass: false,
      skills: [],
      alignment: "neutral"
    }
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const onSubmit = (values: CharacterFormValues) => {
    console.log(values)
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    const newSkills = checked 
      ? [...selectedSkills, skill]
      : selectedSkills.filter(s => s !== skill)
    setSelectedSkills(newSkills)
    form.setValue('skills', newSkills)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Personaggio</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Aragorn" {...field} />
                </FormControl>
                <FormDescription>
                  Il nome del tuo personaggio
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona classe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fighter">Guerriero</SelectItem>
                    <SelectItem value="wizard">Mago</SelectItem>
                    <SelectItem value="rogue">Ladro</SelectItem>
                    <SelectItem value="cleric">Chierico</SelectItem>
                    <SelectItem value="ranger">Ranger</SelectItem>
                    <SelectItem value="barbarian">Barbaro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Livello</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multiclass Switch */}
          <FormField
            control={form.control}
            name="multiclass"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Multiclasse
                  </FormLabel>
                  <FormDescription>
                    Abilita se il personaggio ha più classi
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Background Textarea */}
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrivi la storia e le motivazioni del personaggio..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Una breve storia del personaggio e delle sue motivazioni
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skills Checkboxes */}
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Competenze</FormLabel>
                <FormDescription>
                  Seleziona le competenze del personaggio
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Acrobazia', 'Arcano', 'Atletica', 'Inganno', 'Storia', 'Medicina'].map((skill) => (
                  <FormField
                    key={skill}
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {skill}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alignment Radio Group */}
        <FormField
          control={form.control}
          name="alignment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Allineamento</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="good" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Buono
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="neutral" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Neutrale
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="evil" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Malvagio
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">
            Crea Personaggio
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  )
}
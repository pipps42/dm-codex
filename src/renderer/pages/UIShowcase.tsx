import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Toaster } from 'sonner'
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
  FormMessage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  showToast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  LoadingSpinner,
  Skeleton,
  LoadingOverlay,
  AppShell,
  AppShellMain,
  AppShellContainer,
  Grid,
  Flex,
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  HeaderTitle,
  HeaderSearch,
  HeaderActions,
  PageHeader,
  PageHeaderTop,
  PageHeaderLeft,
  PageHeaderRight,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Breadcrumb,
  ScrollArea,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
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
  Trash2,
  Info,
  ChevronDown,
  Edit,
  Copy,
  Star,
  Bell,
  HelpCircle,
  Home,
  Book,
  Users,
  Map,
  Dice6,
  Menu,
  ChevronRight,
  FileText,
  Calendar,
  Crown,
  Swords,
  Layout,
  Type,
  MousePointer,
  MessageSquare,
  Grid3X3,
  Package
} from 'lucide-react'

export default function UIShowcase() {
  const [activeSection, setActiveSection] = useState('foundation')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigationSections = [
    { id: 'foundation', label: 'Foundation', icon: <Package className="w-4 h-4" /> },
    { id: 'form', label: 'Form Controls', icon: <Type className="w-4 h-4" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
    { id: 'data', label: 'Data Display', icon: <Grid3X3 className="w-4 h-4" /> },
  ]

  const getBreadcrumbItems = (section: string) => {
    const sectionMap = {
      foundation: 'Foundation Components',
      form: 'Form Components',
      feedback: 'Feedback Components',
      layout: 'Layout Components',
      data: 'Data Display Components'
    }

    return [
      { label: 'UI Showcase', onClick: () => setActiveSection('foundation') },
      { label: sectionMap[section as keyof typeof sectionMap] || 'Components' }
    ]
  }

  return (
    <div className="h-screen bg-background">
      <Toaster richColors />
      <TooltipProvider>
        <AppShell
          header={
            <Header>
              <HeaderLeft>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <HeaderTitle>DM's Codex UI Showcase</HeaderTitle>
              </HeaderLeft>
              <HeaderCenter>
                <HeaderSearch placeholder="Cerca componenti..." />
              </HeaderCenter>
              <HeaderRight>
                <HeaderActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifiche</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Impostazioni</TooltipContent>
                  </Tooltip>
                </HeaderActions>
              </HeaderRight>
            </Header>
          }
          sidebar={
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
            >
              <SidebarHeader>
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    <span className="font-bold">UI Components</span>
                  </div>
                )}
              </SidebarHeader>
              <SidebarContent>
                <SidebarNav>
                  {navigationSections.map((section) => (
                    <SidebarNavItem
                      key={section.id}
                      active={activeSection === section.id}
                      icon={section.icon}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {!sidebarCollapsed && section.label}
                    </SidebarNavItem>
                  ))}
                </SidebarNav>

                {!sidebarCollapsed && (
                  <>
                    <Separator className="my-4" />
                    <SidebarGroup title="Quick Actions">
                      <SidebarNavItem icon={<Home className="w-4 h-4" />}>
                        Home
                      </SidebarNavItem>
                      <SidebarNavItem icon={<Book className="w-4 h-4" />}>
                        Documentation
                      </SidebarNavItem>
                    </SidebarGroup>
                  </>
                )}
              </SidebarContent>
              <SidebarFooter>
                {!sidebarCollapsed && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Design System v2.1.0
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                  </div>
                )}
              </SidebarFooter>
            </Sidebar>
          }
        >
          <AppShellMain>
            <AppShellContainer maxWidth="full">
              <div className="p-6">
                <PageHeader>
                  <PageHeaderTop>
                    <PageHeaderLeft>
                      <Breadcrumb items={getBreadcrumbItems(activeSection)} />
                      <PageHeaderTitle>
                        {navigationSections.find(s => s.id === activeSection)?.label} Components
                      </PageHeaderTitle>
                      <PageHeaderDescription>
                        Showcase interattivo dei componenti UI per DM's Codex
                      </PageHeaderDescription>
                    </PageHeaderLeft>
                    <PageHeaderRight>
                      <PageHeaderActions>
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </Button>
                        <Button size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Add to Favorites
                        </Button>
                      </PageHeaderActions>
                    </PageHeaderRight>
                  </PageHeaderTop>
                </PageHeader>

                <div className="mt-8">
                  {activeSection === 'foundation' && <FoundationSection />}
                  {activeSection === 'form' && <FormSection />}
                  {activeSection === 'feedback' && <FeedbackSection />}
                  {activeSection === 'layout' && <LayoutSection />}
                  {activeSection === 'data' && <DataSection />}
                </div>
              </div>
            </AppShellContainer>
          </AppShellMain>
        </AppShell>
      </TooltipProvider>
    </div>
  )
}

function FoundationSection() {
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <Tabs defaultValue="buttons" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="inputs">Inputs</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="separators">Separators</TabsTrigger>
      </TabsList>

      <TabsContent value="buttons" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Diverse varianti per diversi contesti d'uso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Primary Actions</h4>
              <Flex direction="row" gap="md" wrap>
                <Button>Default</Button>
                <Button loading={isLoading} onClick={handleLoadingDemo}>
                  {isLoading ? 'Casting...' : 'Cast Spell'}
                </Button>
                <Button icon={<Sword className="w-4 h-4" />}>
                  Attack
                </Button>
                <Button disabled>Disabled</Button>
              </Flex>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Secondary Actions</h4>
              <Flex direction="row" gap="md" wrap>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </Flex>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Sizes</h4>
              <Flex direction="row" gap="md" align="center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Flex>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inputs" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>Campi di input per la raccolta dati</CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <div className="space-y-2">
                <Label htmlFor="character-name" required>Nome Personaggio</Label>
                <Input
                  id="character-name"
                  placeholder="Es. Gandalf il Grigio"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="disabled">Campo Disabilitato</Label>
                <Input
                  id="disabled"
                  placeholder="Non modificabile"
                  disabled
                  value="Valore fisso"
                />
              </div>
            </Grid>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cards" className="space-y-6">
        <Grid cols={3} gap="lg">
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
          </Card>
        </Grid>
      </TabsContent>

      <TabsContent value="separators" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Separators</CardTitle>
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function FormSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
          <CardDescription>Componenti per la creazione di form interattivi</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Controls</TabsTrigger>
              <TabsTrigger value="selection">Selection</TabsTrigger>
              <TabsTrigger value="complete">Complete Form</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Grid cols={2} gap="lg">
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="character-background">Background</Label>
                  <Textarea
                    id="character-background"
                    placeholder="Descrivi la storia del tuo personaggio..."
                    className="min-h-[100px]"
                  />
                </div>
              </Grid>

              <div className="flex items-center space-x-2">
                <Switch id="multiclass" />
                <Label htmlFor="multiclass">Personaggio multiclasse</Label>
              </div>
            </TabsContent>

            <TabsContent value="selection" className="space-y-6">
              <Grid cols={2} gap="lg">
                <div className="space-y-3">
                  <Label>Competenze (multipla selezione)</Label>
                  <div className="space-y-2">
                    {['Acrobazia', 'Arcano', 'Atletica', 'Inganno'].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox id={skill.toLowerCase()} />
                        <Label htmlFor={skill.toLowerCase()}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

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
              </Grid>
            </TabsContent>

            <TabsContent value="complete">
              <CharacterFormExample />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function FeedbackSection() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dialogs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
          <TabsTrigger value="tooltips">Tooltips</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
        </TabsList>

        <TabsContent value="dialogs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dialogs & Alerts</CardTitle>
              <CardDescription>Modali e dialoghi per interazioni critiche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Flex direction="row" gap="md">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Apri Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Creazione Nuovo Personaggio</DialogTitle>
                      <DialogDescription>
                        Compila i dati per creare un nuovo personaggio per la tua campagna.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="char-name">Nome</Label>
                        <Input id="char-name" placeholder="Gandalf" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Annulla</Button>
                      <Button>Crea Personaggio</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Elimina Campagna</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Questa azione cancellerà permanentemente la campagna.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction>Elimina</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Flex>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tooltips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tooltips & Popovers</CardTitle>
              <CardDescription>Contenuto informativo contestuale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Flex direction="row" gap="md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Questo pulsante serve per ottenere aiuto</p>
                  </TooltipContent>
                </Tooltip>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Info className="w-4 h-4 mr-2" />
                      Info Incantesimo
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Fireball</h4>
                      <p className="text-sm text-muted-foreground">
                        Un incantesimo di evocazione di 3° livello.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </Flex>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dropdown & Context Menu</CardTitle>
              <CardDescription>Menu contestuali e dropdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Flex direction="row" gap="md">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Azioni Personaggio
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Azioni disponibili</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplica
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Card className="w-48 h-24 flex items-center justify-center border-dashed cursor-pointer hover:bg-accent">
                      <p className="text-muted-foreground text-sm">Clicca destro</p>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifica
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Copia
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Flex>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading States</CardTitle>
              <CardDescription>Notifiche e stati di caricamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Flex direction="row" gap="md">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast.success('Operazione completata!')}
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast.error('Errore nel salvataggio')}
                  >
                    Error Toast
                  </Button>
                </Flex>

                <div className="space-y-4">
                  <Flex direction="row" gap="md" align="center">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="md" />
                    <LoadingSpinner size="lg" />
                  </Flex>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LayoutSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Layout Components Demo</CardTitle>
          <CardDescription>Componenti per strutturare l'interfaccia</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid & Flex</TabsTrigger>
              <TabsTrigger value="scroll">Scroll Areas</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Grid Layout Example</h4>
                <Grid cols={4} gap="md" responsive>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="p-4 text-center">
                      <div className="text-lg font-semibold">Item {i + 1}</div>
                    </Card>
                  ))}
                </Grid>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Flex Layout Example</h4>
                <Flex direction="row" justify="between" align="center" className="p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span className="font-medium">DM Tools</span>
                  </div>
                  <Flex direction="row" gap="sm">
                    <Button size="sm">Action 1</Button>
                    <Button size="sm" variant="outline">Action 2</Button>
                  </Flex>
                </Flex>
              </div>
            </TabsContent>

            <TabsContent value="scroll" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">ScrollArea Example</h4>
                <Card>
                  <ScrollArea className="h-48 w-full p-4">
                    <div className="space-y-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border rounded">
                          <User className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">Personaggio {i + 1}</div>
                            <div className="text-sm text-muted-foreground">Livello {i + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-6">
              <div className="text-center py-8">
                <Layout className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  I componenti di struttura (AppShell, Header, Sidebar) sono già visibili
                  nell'interfaccia corrente di questa demo.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function DataSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Display Components</CardTitle>
          <CardDescription>Componenti per visualizzare dati (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Data Display Components</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              I componenti per la visualizzazione dei dati (Table, DataTable, Badge, Avatar, ecc.)
              saranno implementati nella prossima fase di sviluppo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const characterSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  class: z.string().min(1, { message: "Seleziona una classe" }),
  level: z.number().min(1).max(20, { message: "Il livello deve essere tra 1 e 20" }),
})

type CharacterFormValues = z.infer<typeof characterSchema>

function CharacterFormExample() {
  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      level: 1,
    }
  })

  const onSubmit = (values: CharacterFormValues) => {
    showToast.success('Personaggio creato con successo!')
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Grid cols={2} gap="lg">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Personaggio</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Aragorn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Grid>

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livello</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Flex direction="row" gap="md">
          <Button type="submit">Crea Personaggio</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset Form
          </Button>
        </Flex>
      </form>
    </Form>
  )
}
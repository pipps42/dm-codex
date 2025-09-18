# DM's Codex - UI Components Development Roadmap

## 🎯 Obiettivo
Costruire un sistema di componenti completo e coerente per DM's Codex, procedendo dai componenti atomici a quelli più complessi.

## 📋 Fasi di Sviluppo

### ✅ Fase 1: Foundation (Completata nel primo prompt)
- [x] Sistema di design (colori, tipografia, spacing)
- [x] Button
- [x] Input
- [x] Card
- [x] Label
- [x] Separator
- [x] Pagina ComponentsDemo

### ✅ Fase 2: Form Components (Completata)
**Prompt**: "Implementa i componenti form basandoti sul design system esistente"

Componenti completati:
- [x] **Select** (con Radix UI)
- [x] **Checkbox** (con Radix UI)
- [x] **RadioGroup** (con Radix UI)
- [x] **Textarea**
- [x] **Switch** (con Radix UI)
- [x] **Form** (wrapper con react-hook-form)
- [x] **FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage**

Update ComponentsDemo con sezione Forms.

### ✅ Fase 3: Feedback & Overlay Components (Completata)
**Prompt**: "Implementa componenti per feedback e overlay"

Componenti completati:
- [x] **Dialog** (con Radix UI)
- [x] **AlertDialog** (con Radix UI)
- [x] **Toast** (configurazione Sonner)
- [x] **Tooltip** (con Radix UI)
- [x] **Popover** (con Radix UI)
- [x] **DropdownMenu** (con Radix UI)
- [x] **ContextMenu** (con Radix UI)
- [x] **Loading** (spinner/skeleton)

### ✅ Fase 4: Layout Components (Completata)
**Prompt**: "Implementa componenti layout per strutturare l'app"

Componenti:
- [x] **AppShell** (layout principale con sidebar)
- [x] **Sidebar** (navigazione principale)
- [x] **Header** (top bar con actions)
- [x] **PageHeader** (titolo pagina con breadcrumb)
- [x] **Tabs** (con Radix UI)
- [x] **ScrollArea** (con Radix UI)
- [x] **Grid/Flex** (utility layout components)

### 📦 Fase 5: Data Display Components
**Prompt**: "Implementa componenti per visualizzare dati"

Componenti:
- **Table** (con sorting, filtering)
- **DataTable** (wrapper avanzato)
- **Badge** (per stati, tag)
- **Avatar** (per PG/NPC)
- **Progress** (barre progresso)
- **Stat** (display statistiche)
- **EmptyState** (quando non ci sono dati)

### 📦 Fase 6: Domain-Specific Components
**Prompt**: "Implementa componenti specifici per D&D"

Componenti:
- **CreatureTypeIcon** (icone per tipo creatura)
- **AlignmentBadge** (badge per allineamento)
- **DiceRoller** (component per tirare dadi)
- **StatBlock** (block statistiche mostro)
- **InitiativeTracker** (tracker iniziativa)
- **HealthBar** (barra HP)
- **ConditionToken** (token per status)

### 📦 Fase 7: Complex Composite Components
**Prompt**: "Implementa componenti compositi complessi"

Componenti:
- **CampaignCard** (card per campagne)
- **NPCCard** (card per PNG)
- **LocationTree** (albero gerarchico luoghi)
- **MapAnnotator** (annotazioni su mappa)
- **EncounterBuilder** (builder incontri)
- **QuestTree** (visualizzazione quest)

### 📦 Fase 8: Advanced Features
**Prompt**: "Implementa feature avanzate"

Componenti:
- **SearchCommand** (command palette)
- **ThemeToggle** (light/dark mode)
- **Shortcuts** (keyboard shortcuts display)
- **DragDropUpload** (upload con drag & drop)
- **ImageGallery** (galleria immagini)
- **MarkdownEditor** (editor per note)

## 🧪 Testing & Documentation

### Pagine Demo da Mantenere:
1. **`/components-demo`** - Tutti i componenti base
2. **`/forms-demo`** - Esempi form complessi
3. **`/patterns-demo`** - Pattern UI comuni
4. **`/theme-demo`** - Variazioni tema

### Storybook (Opzionale per futuro):
- Setup Storybook per documentazione componenti
- Stories per ogni componente
- Documentazione props e varianti

## 📐 Convenzioni da Seguire

### File Structure:
```
components/
  ui/
    button/
      button.tsx
      button.test.tsx
      index.ts
    index.ts (barrel export)
```

### Naming:
- Component files: `kebab-case.tsx`
- Component names: `PascalCase`
- Props interfaces: `{ComponentName}Props`

### Exports:
- Named exports per componenti
- Barrel exports in `ui/index.ts`
- Re-export da Radix con styling custom

### Testing:
- Test di rendering base
- Test di accessibilità
- Test di interazione

## 🎨 Design Tokens da Mantenere

### Spacing:
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem

### Border Radius:
- sm: 0.25rem
- md: 0.375rem
- lg: 0.5rem
- full: 9999px

### Shadows:
- sm: sottile per card
- md: media per dropdown
- lg: forte per modal

### Z-Index Scale:
- dropdown: 50
- modal: 100
- toast: 200
- tooltip: 300

## 🚀 Come Procedere

1. Completa una fase alla volta
2. Aggiorna ComponentsDemo dopo ogni fase
3. Testa l'integrazione con componenti esistenti
4. Mantieni coerenza con design system
5. Documenta pattern riutilizzabili

## 📝 Note per il Development

- Priorità su accessibilità e keyboard navigation
- Performance: lazy load componenti pesanti
- Responsive design: mobile-first approach
- Dark mode: sempre come default
- Animazioni: rispetta prefers-reduced-motion
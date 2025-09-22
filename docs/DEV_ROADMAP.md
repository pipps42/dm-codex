  ---
  🗺️ DM's Codex - Development Roadmap v1

  🎯 Obiettivo

  Implementare il core dell'applicazione partendo dai componenti UI fino alla prima sezione
  funzionale (Campaigns), stabilendo i pattern architetturali per lo sviluppo futuro.

  📋 Roadmap Dettagliata

  🔧 Step 1: Image Upload Component

  Obiettivo: Componente riutilizzabile per upload immagini

  Deliverables:
  - ImageUpload component con drag & drop
  - Supporto formati: PNG, JPG, JPEG, WEBP
  - Preview dell'immagine caricata
  - Validazione dimensioni e formato
  - Stati: idle, dragging, uploading, success, error
  - Integrazione con react-hook-form

  Technical Requirements:
  - File validation (tipo, dimensione max 10MB)
  - Progress indicator durante upload
  - Accessibilità (keyboard navigation, screen readers)
  - Responsive design

  ---
  🎨 Step 2: Content Card Component

  Obiettivo: Card component versatile per content display

  Deliverables:
  - ContentCard component (aspect ratio 4:5)
  - Overlay gradient (transparent → black, top → bottom)
  - Content positioning (title, subtitle, stats nella parte bassa)
  - Hover effects (scale transform)
  - Click handlers e right-click context menu
  - Responsive behavior

  Design Specifications:
  ┌─────────────────┐
  │                 │ ← Image background
  │                 │
  │  ░░░░░░░░░░░░░  │ ← Gradient overlay starts
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓  │
  │  ████████████  │ ← Text content area
  │  Title          │
  │  Subtitle       │
  │  Stats/Badges   │
  └─────────────────┘

  Variants:
  - Campaign, Character, NPC, Location, Quest cards
  - Configurable content slots
  - Optional action buttons

  ---
  🏗️ Step 1.5: File Management Service (Aggiunto)

  Obiettivo: Sistema per gestione file e ottimizzazione immagini

  Deliverables:
  - FileSystemService (main process)
  - Path management per tipologie (campaigns/{id}/covers/, portraits/, etc.)
  - Image optimization (resize, compression)
  - File validation e security checks
  - IPC channels per file operations

  ---
  🖼️ Step 3: Main App Layout

  Obiettivo: Layout principale basandosi su UIShowcase esistente

  Deliverables:
  - Refactor da demo a production layout
  - Navigation system con routing
  - Sidebar with sections (Campaigns, NPCs, Locations, etc.)
  - Header con search, user actions, settings
  - Responsive sidebar (collapsible su mobile)
  - Theme integration (dark mode default)

  Layout Structure:
  ┌─────────────────────────────────────┐
  │ Header (search, actions, settings)  │
  ├─────────┬───────────────────────────┤
  │ Sidebar │ Main Content Area         │
  │         │                           │
  │ • Camp. │ ┌─────────────────────┐  │
  │ • NPCs  │ │ Page Content        │  │
  │ • Items │ │                     │  │
  │ • Maps  │ │                     │  │
  │ • Etc.  │ └─────────────────────┘  │
  └─────────┴───────────────────────────┘

  ---
  🧠 Step 3.5: State Management Setup (Aggiunto)

  Objetivo: Infrastruttura per state management e data flow

  Deliverables:
  - Zustand stores setup (useCampaignStore, useUIStore)
  - IPC services per communication main ↔ renderer
  - Mock data generators per development
  - Error handling e loading states
  - Type-safe IPC channels

  ---
  🎮 Step 4: Campaign-Specific Components

  Obiettivo: Componenti specifici per la gestione campagne

  Deliverables:
  - CampaignCard (extends ContentCard)
  - CampaignForm (create/edit con validation)
  - CampaignStats component
  - CampaignActions (export, backup, archive)

  CampaignCard Specifications:
  - Cover image con fallback default
  - Campaign name, description preview
  - Stats: sessions played, last session date, player count
  - Status badges (active, paused, completed)
  - Context menu: Open, Edit, Duplicate, Archive, Delete

  CampaignForm Features:
  - Name, description, cover image upload
  - Player management (add/remove players)
  - Campaign settings (dice rules, house rules)
  - Form validation con error handling

  ---
  🎛️ Step 4.5: Context Menu System (Aggiunto)

  Obiettivo: Sistema di menu contestuali riutilizzabile

  Deliverables:
  - ContextMenu component (già esistente in UI)
  - useContextActions hook
  - Action definitions (open, edit, duplicate, delete, etc.)
  - Keyboard shortcuts integration
  - Permission-based action filtering

  ---
  🚀 Step 5: Campaigns Section Implementation

  Obiettivo: Prima sezione completa dell'app con backend integration

  Deliverables:
  - /campaigns route con layout
  - Campaigns list view (grid di CampaignCard)
  - Create campaign flow
  - Campaign detail view
  - Search e filtering
  - Backend integration (Prisma + IPC)

  Features:
  - Grid responsive di campaign cards
  - Empty state quando nessuna campagna
  - Search bar con filtro real-time
  - Sort options (name, last played, created date)
  - Bulk actions (archive multiple, export)
  - Infinite scroll o pagination per performance

  ---
  🧪 Testing & Quality Assurance

  Per ogni step:
  - Unit tests per componenti
  - Integration tests per IPC communication
  - Accessibility testing
  - Performance testing (rendering, file operations)
  - Cross-platform testing (Windows, macOS, Linux)

  📐 Design System Compliance

  Standards da mantenere:
  - Consistent spacing usando design tokens
  - Color palette secondo tema dark
  - Typography scale
  - Animation timing (prefers-reduced-motion)
  - Keyboard navigation support
  - Screen reader compatibility

  🎯 Success Criteria

  Step completato quando:
  1. ✅ Tutti i componenti implementati e testati
  2. ✅ Design system compliance verificato
  3. ✅ Documentazione aggiornata
  4. ✅ Performance benchmarks raggiunti
  5. ✅ Accessibilità validated (WCAG 2.1 AA)

  🔄 Iteration Process

  1. Implement → Build component/feature
  2. Test → Unit + integration tests
  3. Review → Code review + design review
  4. Refine → Bug fixes + improvements
  5. Document → Update documentation
  6. Deploy → Merge e prepare for next step
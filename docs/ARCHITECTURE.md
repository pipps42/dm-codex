# DM's Codex - Documento di Architettura Software

## 1. Panoramica Architetturale

### 1.1 Pattern Architetturale
L'applicazione utilizza una **Clean Architecture** adattata per Electron, con separazione netta tra:
- **Presentation Layer** (React UI)
- **Application Layer** (Business Logic)
- **Domain Layer** (Entità e Regole di Business)
- **Infrastructure Layer** (Database, File System)

### 1.2 Stack Tecnologico
- **Framework**: Electron 28+ 
- **Frontend**: React 18 + TypeScript 5
- **State Management**: Zustand (leggero e TypeScript-friendly)
- **Database**: SQLite + Prisma ORM
- **Build Tool**: Vite (per performance ottimali)
- **UI Framework**: Radix UI + Tailwind CSS
- **Testing**: Vitest + React Testing Library

## 2. Architettura Electron

### 2.1 Struttura dei Processi

```
┌─────────────────────────────────────────────────────┐
│                   Main Process                       │
│  ┌─────────────────────────────────────────────┐   │
│  │          Application Controller              │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Database Service │ File System │ IPC Hub   │   │
│  │    (Prisma)       │   Manager   │           │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────┘
                          │ IPC
┌─────────────────────────┴───────────────────────────┐
│                  Renderer Process                    │
│  ┌─────────────────────────────────────────────┐   │
│  │              React Application               │   │
│  ├─────────────────────────────────────────────┤   │
│  │  UI Layer  │  State Layer  │  Service Layer │   │
│  │            │   (Zustand)   │  (IPC Client)  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.2 Responsabilità dei Processi

**Main Process:**
- Gestione del database (CRUD operations via Prisma)
- File system operations (immagini, backup)
- Window management
- Menu e shortcuts globali
- Auto-updater

**Renderer Process:**
- UI e interazione utente
- State management locale
- Validazione input client-side
- Caching e ottimizzazioni UI

## 3. Struttura delle Directory

```
dm-codex/
├── src/
│   ├── main/                    # Main process
│   │   ├── database/            # Prisma client e repositories
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   ├── repositories/    # Repository pattern per entità
│   │   │   └── migrations/
│   │   ├── services/            # Business logic
│   │   │   ├── CampaignService.ts
│   │   │   ├── EncounterService.ts
│   │   │   └── FileSystemService.ts
│   │   ├── ipc/                 # IPC handlers
│   │   │   ├── handlers/
│   │   │   └── channels.ts      # Definizione canali IPC
│   │   └── main.ts
│   │
│   ├── renderer/                # Renderer process
│   │   ├── components/          # React components
│   │   │   ├── common/          # Componenti riutilizzabili
│   │   │   ├── campaign/        # Feature-specific
│   │   │   ├── encounter/
│   │   │   └── layout/
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # Zustand stores
│   │   ├── services/            # IPC client services
│   │   ├── types/               # TypeScript types/interfaces
│   │   ├── utils/
│   │   └── App.tsx
│   │
│   ├── shared/                  # Codice condiviso
│   │   ├── types/               # Tipi condivisi main/renderer
│   │   ├── enums/               # Enum definitions
│   │   └── constants/
│   │
│   └── preload/                 # Preload scripts
│       └── index.ts
│
├── assets/                      # Asset statici
├── data/                        # Database e file utente
│   ├── database.db
│   └── campaigns/               # File per campagna
└── tests/
```

## 4. Flusso Dati e Comunicazione

### 4.1 Pattern di Comunicazione IPC

```typescript
// Definizione tipo-safe dei canali IPC
// shared/types/ipc.ts
export interface IpcChannels {
  'campaign:create': {
    input: CreateCampaignDto;
    output: Campaign;
  };
  'campaign:list': {
    input: void;
    output: Campaign[];
  };
  'npc:create': {
    input: CreateNpcDto;
    output: Npc;
  };
  // ... altri canali
}

// Main process handler
ipcMain.handle('campaign:create', async (event, data: CreateCampaignDto) => {
  return await campaignService.create(data);
});

// Renderer process service
class CampaignService {
  async create(data: CreateCampaignDto): Promise<Campaign> {
    return await ipcRenderer.invoke('campaign:create', data);
  }
}
```

### 4.2 State Management Strategy

```typescript
// Zustand store example
interface CampaignStore {
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  isLoading: boolean;
  
  // Actions
  loadCampaigns: () => Promise<void>;
  selectCampaign: (id: string) => Promise<void>;
  createCampaign: (data: CreateCampaignDto) => Promise<void>;
}

// Store implementation con persistenza locale
const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      // ... implementation
    }),
    {
      name: 'campaign-storage',
      partialize: (state) => ({ currentCampaign: state.currentCampaign })
    }
  )
);
```

## 5. Pattern e Principi di Design

### 5.1 Repository Pattern
Ogni entità principale ha un repository che astrae le operazioni database:

```typescript
// main/database/repositories/NpcRepository.ts
export class NpcRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findByCampaign(campaignId: string): Promise<Npc[]> {
    return this.prisma.npc.findMany({
      where: { campaignId },
      include: { locations: true, interactions: true }
    });
  }
  
  async createWithRelations(data: CreateNpcDto): Promise<Npc> {
    // Complex creation logic
  }
}
```

### 5.2 Service Layer Pattern
I services contengono la business logic e orchestrano repositories:

```typescript
// main/services/EncounterService.ts
export class EncounterService {
  constructor(
    private encounterRepo: EncounterRepository,
    private monsterRepo: MonsterRepository
  ) {}
  
  async startEncounter(encounterId: string): Promise<ActiveEncounter> {
    // Business logic for starting encounter
    // Roll initiative, setup positions, etc.
  }
}
```

### 5.3 DTO Pattern
Data Transfer Objects per comunicazione type-safe:

```typescript
// shared/types/dtos/npc.dto.ts
export interface CreateNpcDto {
  name: string;
  role: NPCRole;
  campaignId: string;
  // ... altri campi validati
}
```

## 6. Gestione File e Asset

### 6.1 Struttura File System
```
data/
└── campaigns/
    └── {campaign-id}/
        ├── portraits/
        │   ├── npcs/
        │   └── pcs/
        ├── maps/
        │   └── {map-id}.jpg
        ├── backups/
        │   └── {timestamp}.backup
        └── exports/
```

### 6.2 File Management Service
```typescript
export class FileSystemService {
  private basePath: string;
  
  async savePortrait(
    campaignId: string, 
    entityType: 'npc' | 'pc', 
    entityId: string, 
    imageBuffer: Buffer
  ): Promise<string> {
    // Salva e ottimizza immagine, ritorna path
  }
  
  async createBackup(campaignId: string): Promise<void> {
    // Crea backup incrementale
  }
}
```

## 7. Sicurezza e Performance

### 7.1 Sicurezza
- **Context Isolation**: Abilitato per tutti i renderer
- **Node Integration**: Disabilitato nei renderer
- **Preload Scripts**: Espongono solo API necessarie
- **Content Security Policy**: Restrictive CSP headers
- **Validazione Input**: Sia client che server-side

### 7.2 Performance
- **Lazy Loading**: Componenti e routes React
- **Database Indexing**: Su campi frequentemente cercati
- **Image Optimization**: Resize e compressione automatica
- **Pagination**: Per liste lunghe (NPCs, Items)
- **Caching Strategy**: 
  - In-memory cache per dati frequenti
  - Invalidazione cache su modifiche

### 7.3 Database Optimization
```prisma
// Esempi di ottimizzazioni Prisma
model Npc {
  @@index([campaignId, name]) // Ricerca veloce
  @@index([createdAt])        // Ordinamento
}
```

## 8. Testing Strategy

### 8.1 Livelli di Test
1. **Unit Tests**: Services, utilities, reducers
2. **Integration Tests**: IPC communication, database
3. **Component Tests**: React components isolati
4. **E2E Tests**: Flussi utente completi con Playwright

### 8.2 Test Structure
```typescript
// Example test
describe('NpcService', () => {
  it('should create NPC with locations', async () => {
    // Test implementation
  });
});
```

## 9. Build e Deployment

### 9.1 Build Configuration
- **Development**: Hot reload per velocità
- **Production**: Minification, tree-shaking
- **Packaging**: electron-builder per multi-platform

### 9.2 Auto-Update Strategy
- Controllo updates al lancio
- Download in background
- Notifica utente con changelog

## 10. Convenzioni e Standard

### 10.1 Naming Conventions
- **Components**: PascalCase (`NpcCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase con prefissi (`INpc`, `CreateNpcDto`)
- **Enums**: PascalCase per type, UPPER_CASE per valori

### 10.2 Code Organization
- Una feature per directory
- Barrel exports per clean imports
- Shared code in `/shared`

### 10.3 Git Workflow
- Feature branches
- Conventional commits
- Automated versioning con semantic-release
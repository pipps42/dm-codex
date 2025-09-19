# DM's Codex - Modello Dati (Entity-Relationship Diagram) v2

## Enum Condivisi

Prima di definire le entità, elenchiamo gli enum che verranno riutilizzati in più tabelle:

### **CreatureType**
`humanoid`, `undead`, `construct`, `dragon`, `fey`, `fiend`, `celestial`, `elemental`, `aberration`, `beast`, `monstrosity`, `ooze`, `plant`, `giant`

### **Size**
`tiny`, `small`, `medium`, `large`, `huge`, `gargantuan`

### **Alignment**
`lawful_good`, `neutral_good`, `chaotic_good`, `lawful_neutral`, `true_neutral`, `chaotic_neutral`, `lawful_evil`, `neutral_evil`, `chaotic_evil`, `unaligned`

### **Language**
`common`, `dwarvish`, `elvish`, `giant`, `gnomish`, `goblin`, `halfling`, `orc`, `abyssal`, `celestial`, `draconic`, `deep_speech`, `infernal`, `primordial`, `sylvan`, `undercommon`, `thieves_cant`, `druidic`

### **CharacterClass**
`barbarian`, `bard`, `cleric`, `druid`, `fighter`, `monk`, `paladin`, `ranger`, `rogue`, `sorcerer`, `warlock`, `wizard`, `artificer`, `blood_hunter`

### **Race**
`human`, `elf`, `dwarf`, `halfling`, `dragonborn`, `gnome`, `half_elf`, `half_orc`, `tiefling`, `aasimar`, `firbolg`, `goliath`, `kenku`, `tabaxi`, `triton`, `yuan_ti`, `tortle`, `changeling`, `kalashtar`, `warforged`, `gith`, `centaur`, `loxodon`, `minotaur`, `simic_hybrid`, `vedalken`, `verdan`, `leonin`, `satyr`, `fairy`, `harengon`, `owlin`, `custom`

### **NPCRole**
`merchant`, `guard`, `noble`, `commoner`, `criminal`, `cultist`, `scholar`, `priest`, `soldier`, `artisan`, `entertainer`, `innkeeper`, `spy`, `assassin`, `mage`, `healer`, `scout`, `leader`, `advisor`, `other`

### **NPCAttitude**
`hostile`, `unfriendly`, `indifferent`, `friendly`, `helpful`, `devoted`

### **BackgroundType**
`acolyte`, `charlatan`, `criminal`, `entertainer`, `folk_hero`, `guild_artisan`, `hermit`, `noble`, `outlander`, `sage`, `sailor`, `soldier`, `urchin`, `haunted_one`, `investigator`, `knight`, `pirate`, `custom`

### **ItemType**
`weapon`, `armor`, `potion`, `scroll`, `wondrous`, `ring`, `rod`, `staff`, `wand`, `key_item`, `treasure`, `consumable`, `tool`, `other`

### **ItemRarity**
`common`, `uncommon`, `rare`, `very_rare`, `legendary`, `artifact`, `unique`

### **Difficulty**
`trivial`, `easy`, `medium`, `hard`, `deadly`

### **QuestStatus**
`available`, `active`, `completed`, `failed`, `abandoned`

### **ResetType**
`none`, `short_rest`, `long_rest`, `dawn`, `dusk`

## Entità Principali

### 1. **Campaign** (Campagna)
La radice di tutto. Ogni campagna è un universo narrativo autonomo.

**Attributi:**
- `id` (UUID, PK)
- `name` (string, required)
- `description` (text)
- `cover_image_path` (string) - Path dell'immagine di copertina
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `last_played_at` (timestamp)

### 2. **NPC** (Personaggio Non Giocante)
PNG con focus narrativo, senza statistiche di combattimento.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `name` (string, required)
- `title` (string) - es. "Capitano della Guardia"
- `race` (Race enum)
- `creature_type` (CreatureType enum)
- `role` (NPCRole enum)
- `class` (CharacterClass enum, nullable)
- `alignment` (Alignment enum)
- `attitude_to_party` (NPCAttitude enum)
- `languages` (Language enum[])
- `appearance` (text)
- `personality` (text)
- `motivations` (text)
- `backstory` (text)
- `dm_notes` (text) - Note private del DM
- `portrait_path` (string) - Path dell'immagine
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. **Location** (Luogo)
Qualsiasi ambientazione: città, dungeon, regioni, edifici.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `parent_location_id` (UUID, FK → Location, nullable) - Per gerarchie
- `name` (string, required)
- `type` (enum: 'city', 'dungeon', 'region', 'building', 'room', 'wilderness', 'other')
- `description` (text)
- `notable_features` (text[]) - Array di punti di interesse
- `cover_image_path` (string) - Path dell'immagine di copertina
- `dm_notes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 4. **Map** (Mappa)
Immagini di mappe con annotazioni.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `location_id` (UUID, FK → Location, nullable)
- `name` (string, required)
- `image_path` (string, required) - Path locale del file
- `grid_size` (integer) - Dimensione griglia in pixel
- `grid_enabled` (boolean)
- `scale` (string) - es. "5ft per quadrato"
- `width` (integer) - Larghezza in pixel
- `height` (integer) - Altezza in pixel
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. **MapAnnotation** (Annotazione Mappa)
Pin, note, tesori, passaggi segreti sulla mappa.

**Attributi:**
- `id` (UUID, PK)
- `map_id` (UUID, FK → Map)
- `type` (enum: 'note', 'treasure', 'secret', 'trap', 'poi', 'encounter') - L'icona sarà derivata dal type
- `x` (float) - Coordinata X (0-1 normalizzata)
- `y` (float) - Coordinata Y (0-1 normalizzata)
- `title` (string)
- `content` (text)
- `is_hidden` (boolean) - Se visibile solo al DM

### 6. **Monster** (Mostro)
Creature con statistiche complete per il combattimento.

**Attributi:**
- `id` (UUID, PK)
- `name` (string, required)
- `size` (Size enum)
- `creature_type` (CreatureType enum)
- `alignment` (Alignment enum)
- `portrait_path` (string) - Path dell'immagine
- `hp_max` (integer, required)
- `hp_dice` (string) - es. "3d8+3"
- `ac` (integer, required)
- `ac_description` (string) - es. "natural armor"
- `speed` (JSON) - {walk: 30, fly: 60, swim: 30}
- `abilities` (JSON) - {str: 10, dex: 14, con: 12, int: 10, wis: 10, cha: 10}
- `saving_throws` (JSON) - {dex: 4, con: 3}
- `skills` (JSON) - {perception: 4, stealth: 6}
- `damage_resistances` (string[])
- `damage_immunities` (string[])
- `condition_immunities` (string[])
- `senses` (string) - es. "darkvision 60ft"
- `languages` (Language enum[])
- `challenge_rating` (float)
- `actions` (JSON[]) - Array di azioni
- `reactions` (JSON[])
- `legendary_actions` (JSON[])
- `description` (text)
- `dm_notes` (text)
- `is_template` (boolean) - Se è un template riutilizzabile
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 7. **Condition** (Condizione/Status)
Stati e condizioni applicabili a creature.

**Attributi:**
- `id` (UUID, PK)
- `name` (string, required) - es. "Poisoned", "Stunned"
- `icon` (string) - Path o identifier dell'icona
- `description` (text) - Effetti della condizione
- `mechanical_effects` (text) - Regole meccaniche
- `is_custom` (boolean) - Se creata dal DM

### 8. **Encounter** (Incontro)
Preparazione di un combattimento con mappa e mostri.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `map_id` (UUID, FK → Map, nullable)
- `location_id` (UUID, FK → Location, nullable)
- `name` (string, required)
- `description` (text)
- `difficulty` (Difficulty enum)
- `status` (enum: 'planned', 'active', 'completed')
- `dm_notes` (text)
- `created_at` (timestamp)
- `started_at` (timestamp)
- `completed_at` (timestamp)

### 9. **EncounterParticipant** (Partecipante Incontro)
Istanza di un mostro o PG in un incontro specifico.

**Attributi:**
- `id` (UUID, PK)
- `encounter_id` (UUID, FK → Encounter)
- `participant_type` (enum: 'monster', 'player')
- `monster_id` (UUID, FK → Monster, nullable) - Se type = 'monster'
- `player_character_id` (UUID, FK → PlayerCharacter, nullable) - Se type = 'player'
- `custom_name` (string) - es. "Goblin #1"
- `initiative` (integer)
- `hp_current` (integer)
- `hp_max` (integer) - Può essere diverso dal template
- `ac` (integer)
- `conditions` (UUID[]) - FK → Condition
- `position_x` (float) - Posizione sulla mappa
- `position_y` (float)
- `is_visible` (boolean)
- `dm_notes` (text)

### 10. **PlayerCharacter** (Personaggio Giocante)
Dati dei PG per la gestione del combattimento e delle interazioni.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `player_name` (string, required)
- `character_name` (string, required)
- `race` (Race enum)
- `class` (CharacterClass enum)
- `level` (integer)
- `alignment` (Alignment enum)
- `background_type` (BackgroundType enum)
- `background` (text) - Storia del personaggio
- `languages` (Language enum[])
- `portrait_path` (string) - Path dell'immagine
- `hp_max` (integer, required)
- `ac` (integer, required)
- `passive_perception` (integer)
- `is_active` (boolean) - Se attualmente nella campagna
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 11. **Quest** (Missione)
Obiettivi e trame narrative.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `parent_quest_id` (UUID, FK → Quest, nullable) - Per sotto-quest
- `name` (string, required)
- `description` (text)
- `objectives` (JSON[]) - Array di obiettivi
- `status` (QuestStatus enum)
- `quest_giver_npc_id` (UUID, FK → NPC, nullable)
- `reward_description` (text)
- `reward_items` (UUID[]) - FK → Item
- `is_milestone` (boolean) - Se al completamento i PG salgono di livello
- `dm_notes` (text)
- `created_at` (timestamp)
- `started_at` (timestamp)
- `completed_at` (timestamp)

### 12. **Item** (Oggetto)
Oggetti magici, tesori, item chiave.

**Attributi:**
- `id` (UUID, PK)
- `name` (string, required)
- `type` (ItemType enum)
- `rarity` (ItemRarity enum)
- `description` (text)
- `mechanical_effects` (text) - Effetti meccanici base
- `granted_abilities` (JSON[]) - Array di {name, description, uses_current, uses_max, reset_type}
- `value` (string) - es. "500gp"
- `weight` (float)
- `quantity` (integer) - Per oggetti stackabili
- `is_magical` (boolean)
- `attunement_required` (boolean)
- `dm_notes` (text)
- `created_at` (timestamp)

### 13. **Chronicle** (Cronaca Sessione)
Diario di una singola sessione di gioco.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `session_number` (integer)
- `session_date` (date)
- `title` (string)
- `summary` (text)
- `player_deeds` (JSON[]) - Imprese memorabili dei giocatori
- `important_decisions` (text[])
- `dm_notes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 14. **Interaction** (Interazione)
Registro delle interazioni tra NPC e PG/Party.

**Attributi:**
- `id` (UUID, PK)
- `campaign_id` (UUID, FK → Campaign)
- `npc_id` (UUID, FK → NPC)
- `interaction_date` (timestamp) - Quando è avvenuta in-game
- `session_date` (date) - Sessione reale in cui è avvenuta
- `interaction_type` (enum: 'conversation', 'transaction', 'conflict', 'quest_given', 'quest_completed', 'other')
- `summary` (text) - Breve riassunto dell'interazione
- `details` (text) - Dettagli completi
- `attitude_change` (NPCAttitude enum, nullable) - Nuovo atteggiamento dopo l'interazione
- `involved_pcs` (UUID[]) - FK → PlayerCharacter, PG coinvolti
- `dm_notes` (text)
- `created_at` (timestamp)

## Tabelle di Relazione (Many-to-Many)

### **Monster_Campaign**
Collega mostri a campagne (un mostro può apparire in più campagne).
- `monster_id` (UUID, FK → Monster)
- `campaign_id` (UUID, FK → Campaign)

### **Item_Campaign**
Collega oggetti a campagne (un oggetto può esistere in più campagne).
- `item_id` (UUID, FK → Item)
- `campaign_id` (UUID, FK → Campaign)

### **NPC_Location**
Collega PNG a luoghi dove possono essere trovati.
- `npc_id` (UUID, FK → NPC)
- `location_id` (UUID, FK → Location)
- `is_primary` (boolean) - Se è la loro posizione principale

### **Quest_NPC**
Collega quest a PNG coinvolti (oltre al quest giver).
- `quest_id` (UUID, FK → Quest)
- `npc_id` (UUID, FK → NPC)
- `role` (string) - Ruolo nella quest

### **Quest_Location**
Collega quest a luoghi rilevanti.
- `quest_id` (UUID, FK → Quest)
- `location_id` (UUID, FK → Location)

### **Chronicle_Quest**
Collega eventi della cronaca a quest completate/fallite nella sessione.
- `chronicle_id` (UUID, FK → Chronicle)
- `quest_id` (UUID, FK → Quest)
- `status_change` (string) - es. "completed", "failed"

### **Item_Location**
Dove si trovano gli oggetti.
- `item_id` (UUID, FK → Item)
- `location_id` (UUID, FK → Location)
- `is_hidden` (boolean)
- `notes` (text)

### **Item_NPC**
Oggetti posseduti da PNG.
- `item_id` (UUID, FK → Item)
- `npc_id` (UUID, FK → NPC)

### **Interaction_Item**
Oggetti scambiati/dati durante un'interazione.
- `interaction_id` (UUID, FK → Interaction)
- `item_id` (UUID, FK → Item)
- `transaction_type` (enum: 'given_to_party', 'received_from_party', 'shown', 'discussed')

## Note Tecniche

1. **UUID vs Integer ID**: Uso di UUID per facilitare sincronizzazione futura e evitare conflitti.

2. **Soft Delete**: Considerare l'aggiunta di `deleted_at` (timestamp) a tutte le entità per soft delete.

3. **Versioning**: Per Monster e Item (condivisi tra campagne) implementare un sistema di versioning per permettere modifiche locali.

4. **Full-Text Search**: Indicizzare campi text principali per ricerca rapida.

5. **File Storage**: 
   - Immagini copertina campagne: `campaigns/{campaign_id}/cover/`
   - Immagini mappe: `campaigns/{campaign_id}/maps/`
   - Ritratti PNG/PG: `campaigns/{campaign_id}/portraits/`
   - Icone condizioni: `shared/conditions/`
   - Backup: `campaigns/{campaign_id}/backups/`

6. **Relazioni Gerarchiche**:
   - Location può avere parent_location_id per creare gerarchie
   - Quest può avere parent_quest_id per sotto-missioni

7. **JSON Fields**: 
   - `granted_abilities` per Item: `[{name: string, description: string, uses_current: number, uses_max: number, reset_type: ResetType}]`
   - `speed` per Monster: `{walk?: number, fly?: number, swim?: number, climb?: number, burrow?: number}`
   - `abilities` per Monster: `{str: number, dex: number, con: number, int: number, wis: number, cha: number}`

8. **Enum Management**: Creare un sistema centralizzato per gestire gli enum, permettendo facili aggiunte di valori custom per campagna.
-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_image_path" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_played_at" DATETIME,
    "settings" JSONB
);

-- CreateTable
CREATE TABLE "npcs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "race" TEXT,
    "creature_type" TEXT,
    "role" TEXT,
    "class" TEXT,
    "alignment" TEXT,
    "attitude_to_party" TEXT,
    "languages" JSONB,
    "appearance" TEXT,
    "personality" TEXT,
    "motivations" TEXT,
    "backstory" TEXT,
    "dm_notes" TEXT,
    "portrait_path" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "npcs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "parent_location_id" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "notable_features" JSONB,
    "cover_image_path" TEXT,
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "locations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "locations_parent_location_id_fkey" FOREIGN KEY ("parent_location_id") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "maps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "location_id" TEXT,
    "name" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "grid_size" INTEGER,
    "grid_enabled" BOOLEAN NOT NULL DEFAULT false,
    "scale" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "maps_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "maps_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "map_annotations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "map_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "map_annotations_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "monsters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "creature_type" TEXT NOT NULL,
    "alignment" TEXT NOT NULL,
    "portrait_path" TEXT,
    "hp_max" INTEGER NOT NULL,
    "hp_dice" TEXT,
    "ac" INTEGER NOT NULL,
    "ac_description" TEXT,
    "speed" JSONB NOT NULL,
    "abilities" JSONB NOT NULL,
    "saving_throws" JSONB,
    "skills" JSONB,
    "damage_resistances" JSONB,
    "damage_immunities" JSONB,
    "condition_immunities" JSONB,
    "senses" TEXT,
    "languages" JSONB,
    "challenge_rating" REAL NOT NULL,
    "actions" JSONB,
    "reactions" JSONB,
    "legendary_actions" JSONB,
    "description" TEXT,
    "dm_notes" TEXT,
    "is_template" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "conditions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "mechanical_effects" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "encounters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "map_id" TEXT,
    "location_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" DATETIME,
    "completed_at" DATETIME,
    CONSTRAINT "encounters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "encounters_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "encounters_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "encounter_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "encounter_id" TEXT NOT NULL,
    "participant_type" TEXT NOT NULL,
    "monster_id" TEXT,
    "player_character_id" TEXT,
    "custom_name" TEXT,
    "initiative" INTEGER,
    "hp_current" INTEGER NOT NULL,
    "hp_max" INTEGER NOT NULL,
    "ac" INTEGER NOT NULL,
    "conditions" JSONB,
    "position_x" REAL,
    "position_y" REAL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "dm_notes" TEXT,
    CONSTRAINT "encounter_participants_encounter_id_fkey" FOREIGN KEY ("encounter_id") REFERENCES "encounters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "encounter_participants_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "encounter_participants_player_character_id_fkey" FOREIGN KEY ("player_character_id") REFERENCES "player_characters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "player_characters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "character_name" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "alignment" TEXT NOT NULL,
    "background_type" TEXT NOT NULL,
    "background" TEXT,
    "languages" JSONB,
    "portrait_path" TEXT,
    "hp_max" INTEGER NOT NULL,
    "ac" INTEGER NOT NULL,
    "passive_perception" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "player_characters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "parent_quest_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "objectives" JSONB,
    "status" TEXT NOT NULL DEFAULT 'available',
    "quest_giver_npc_id" TEXT,
    "reward_description" TEXT,
    "reward_items" JSONB,
    "is_milestone" BOOLEAN NOT NULL DEFAULT false,
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" DATETIME,
    "completed_at" DATETIME,
    CONSTRAINT "quests_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quests_parent_quest_id_fkey" FOREIGN KEY ("parent_quest_id") REFERENCES "quests" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "quests_quest_giver_npc_id_fkey" FOREIGN KEY ("quest_giver_npc_id") REFERENCES "npcs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "description" TEXT,
    "mechanical_effects" TEXT,
    "granted_abilities" JSONB,
    "value" TEXT,
    "weight" REAL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_magical" BOOLEAN NOT NULL DEFAULT false,
    "attunement_required" BOOLEAN NOT NULL DEFAULT false,
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chronicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "session_number" INTEGER NOT NULL,
    "session_date" DATETIME NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "player_deeds" JSONB,
    "important_decisions" JSONB,
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "chronicles_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "npc_id" TEXT NOT NULL,
    "interaction_date" DATETIME NOT NULL,
    "session_date" DATETIME NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "summary" TEXT,
    "details" TEXT,
    "attitude_change" TEXT,
    "involved_pcs" JSONB,
    "dm_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interactions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interactions_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "monster_campaigns" (
    "monster_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,

    PRIMARY KEY ("monster_id", "campaign_id"),
    CONSTRAINT "monster_campaigns_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "monster_campaigns_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item_campaigns" (
    "item_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,

    PRIMARY KEY ("item_id", "campaign_id"),
    CONSTRAINT "item_campaigns_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "item_campaigns_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "npc_locations" (
    "npc_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("npc_id", "location_id"),
    CONSTRAINT "npc_locations_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "npc_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_npcs" (
    "quest_id" TEXT NOT NULL,
    "npc_id" TEXT NOT NULL,
    "role" TEXT,

    PRIMARY KEY ("quest_id", "npc_id"),
    CONSTRAINT "quest_npcs_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quest_npcs_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_locations" (
    "quest_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,

    PRIMARY KEY ("quest_id", "location_id"),
    CONSTRAINT "quest_locations_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quest_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chronicle_quests" (
    "chronicle_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "status_change" TEXT NOT NULL,

    PRIMARY KEY ("chronicle_id", "quest_id"),
    CONSTRAINT "chronicle_quests_chronicle_id_fkey" FOREIGN KEY ("chronicle_id") REFERENCES "chronicles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chronicle_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item_locations" (
    "item_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    PRIMARY KEY ("item_id", "location_id"),
    CONSTRAINT "item_locations_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "item_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item_npcs" (
    "item_id" TEXT NOT NULL,
    "npc_id" TEXT NOT NULL,

    PRIMARY KEY ("item_id", "npc_id"),
    CONSTRAINT "item_npcs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "item_npcs_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interaction_items" (
    "interaction_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,

    PRIMARY KEY ("interaction_id", "item_id"),
    CONSTRAINT "interaction_items_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interaction_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "campaigns_name_idx" ON "campaigns"("name");

-- CreateIndex
CREATE INDEX "npcs_campaign_id_idx" ON "npcs"("campaign_id");

-- CreateIndex
CREATE INDEX "npcs_campaign_id_name_idx" ON "npcs"("campaign_id", "name");

-- CreateIndex
CREATE INDEX "locations_campaign_id_idx" ON "locations"("campaign_id");

-- CreateIndex
CREATE INDEX "locations_campaign_id_name_idx" ON "locations"("campaign_id", "name");

-- CreateIndex
CREATE INDEX "locations_parent_location_id_idx" ON "locations"("parent_location_id");

-- CreateIndex
CREATE INDEX "maps_campaign_id_idx" ON "maps"("campaign_id");

-- CreateIndex
CREATE INDEX "maps_location_id_idx" ON "maps"("location_id");

-- CreateIndex
CREATE INDEX "map_annotations_map_id_idx" ON "map_annotations"("map_id");

-- CreateIndex
CREATE INDEX "monsters_name_idx" ON "monsters"("name");

-- CreateIndex
CREATE INDEX "monsters_creature_type_idx" ON "monsters"("creature_type");

-- CreateIndex
CREATE INDEX "monsters_challenge_rating_idx" ON "monsters"("challenge_rating");

-- CreateIndex
CREATE UNIQUE INDEX "conditions_name_key" ON "conditions"("name");

-- CreateIndex
CREATE INDEX "conditions_name_idx" ON "conditions"("name");

-- CreateIndex
CREATE INDEX "encounters_campaign_id_idx" ON "encounters"("campaign_id");

-- CreateIndex
CREATE INDEX "encounters_status_idx" ON "encounters"("status");

-- CreateIndex
CREATE INDEX "encounter_participants_encounter_id_idx" ON "encounter_participants"("encounter_id");

-- CreateIndex
CREATE INDEX "player_characters_campaign_id_idx" ON "player_characters"("campaign_id");

-- CreateIndex
CREATE INDEX "player_characters_campaign_id_character_name_idx" ON "player_characters"("campaign_id", "character_name");

-- CreateIndex
CREATE INDEX "quests_campaign_id_idx" ON "quests"("campaign_id");

-- CreateIndex
CREATE INDEX "quests_status_idx" ON "quests"("status");

-- CreateIndex
CREATE INDEX "quests_quest_giver_npc_id_idx" ON "quests"("quest_giver_npc_id");

-- CreateIndex
CREATE INDEX "items_name_idx" ON "items"("name");

-- CreateIndex
CREATE INDEX "items_type_idx" ON "items"("type");

-- CreateIndex
CREATE INDEX "items_rarity_idx" ON "items"("rarity");

-- CreateIndex
CREATE INDEX "chronicles_campaign_id_idx" ON "chronicles"("campaign_id");

-- CreateIndex
CREATE INDEX "chronicles_session_date_idx" ON "chronicles"("session_date");

-- CreateIndex
CREATE UNIQUE INDEX "chronicles_campaign_id_session_number_key" ON "chronicles"("campaign_id", "session_number");

-- CreateIndex
CREATE INDEX "interactions_campaign_id_idx" ON "interactions"("campaign_id");

-- CreateIndex
CREATE INDEX "interactions_npc_id_idx" ON "interactions"("npc_id");

-- CreateIndex
CREATE INDEX "interactions_session_date_idx" ON "interactions"("session_date");

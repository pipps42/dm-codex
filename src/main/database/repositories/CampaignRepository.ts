// Campaign Repository - Data access layer for Campaign entity
// Wraps PrismaClient operations with type safety and error handling

import { db } from '../client'
import type { Campaign } from '../generated/prisma'
import type { CreateCampaignInput, UpdateCampaignInput, CampaignWithStats } from '../../../shared/types/ipc'

// Define extended types for Campaign with count relations
interface CampaignWithCount extends Campaign {
  _count?: {
    npcs?: number
    locations?: number
    quests?: number
    encounters?: number
    chronicles?: number
    [key: string]: number | undefined
  }
}

// Define Prisma error types
interface PrismaError extends Error {
  code?: string
  meta?: {
    target?: string[]
  }
}

// Type guard to check if an error is a Prisma error
function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as PrismaError).code === 'string'
  )
}

export class CampaignRepository {
  /**
   * Create a new campaign
   */
  async create(data: CreateCampaignInput): Promise<Campaign> {
    try {
      const client = await db()
      // Use dynamic access with proper typing
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        create(args: {
          data: {
            name: string
            description?: string
            coverImagePath?: string
            settings?: unknown
          }
        }): Promise<unknown>
      }

      const campaign = await campaignModel.create({
        data: {
          name: data.name,
          description: data.description,
          coverImagePath: data.coverImagePath,
          settings: data.settings
        }
      })

      return campaign as Campaign
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2002') {
        throw new Error(`Campaign with name "${data.name}" already exists`)
      }
      throw error
    }
  }

  /**
   * Find all campaigns with statistics
   */
  async findAll(): Promise<CampaignWithStats[]> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        findMany(args?: {
          include?: {
            _count?: {
              select?: {
                npcs?: boolean
                locations?: boolean
                quests?: boolean
                encounters?: boolean
                chronicles?: boolean
              }
            }
          }
          orderBy?: Array<{ [key: string]: string | { sort: string; nulls?: string } }>
        }): Promise<unknown[]>
      }

      const campaigns = await campaignModel.findMany({
        include: {
          _count: {
            select: {
              npcs: true,
              locations: true,
              quests: true,
              encounters: true,
              chronicles: true
            }
          }
        },
        orderBy: [
          { lastPlayedAt: { sort: 'desc', nulls: 'last' } },
          { updatedAt: 'desc' }
        ]
      })

      const typedCampaigns = campaigns as CampaignWithCount[]
      return typedCampaigns.map((campaign) => ({
        ...campaign,
        stats: {
          npcCount: campaign._count?.npcs || 0,
          locationCount: campaign._count?.locations || 0,
          questCount: campaign._count?.quests || 0,
          encounterCount: campaign._count?.encounters || 0,
          chronicleCount: campaign._count?.chronicles || 0
        }
      }))
    } catch (error) {
      throw error
    }
  }

  /**
   * Find campaign by ID with statistics
   */
  async findById(id: string): Promise<CampaignWithStats | null> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        findUnique(args: {
          where: { id: string }
          include?: {
            _count?: {
              select?: {
                npcs?: boolean
                locations?: boolean
                quests?: boolean
                encounters?: boolean
                chronicles?: boolean
              }
            }
          }
        }): Promise<unknown | null>
      }

      const campaign = await campaignModel.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              npcs: true,
              locations: true,
              quests: true,
              encounters: true,
              chronicles: true
            }
          }
        }
      })

      if (!campaign) {
        return null
      }

      const typedCampaign = campaign as CampaignWithCount
      return {
        ...typedCampaign,
        stats: {
          npcCount: typedCampaign._count?.npcs || 0,
          locationCount: typedCampaign._count?.locations || 0,
          questCount: typedCampaign._count?.quests || 0,
          encounterCount: typedCampaign._count?.encounters || 0,
          chronicleCount: typedCampaign._count?.chronicles || 0
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Update campaign
   */
  async update(data: UpdateCampaignInput): Promise<Campaign> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        update(args: {
          where: { id: string }
          data: {
            name?: string
            description?: string
            coverImagePath?: string
            settings?: unknown
            lastPlayedAt?: Date
          }
        }): Promise<unknown>
      }

      const campaign = await campaignModel.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          coverImagePath: data.coverImagePath,
          settings: data.settings,
          lastPlayedAt: data.lastPlayedAt
        }
      })

      return campaign as Campaign
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === 'P2025') {
          throw new Error(`Campaign with ID "${data.id}" not found`)
        }
        if (error.code === 'P2002') {
          throw new Error(`Campaign with name "${data.name}" already exists`)
        }
      }
      throw error
    }
  }

  /**
   * Delete campaign and all related data
   */
  async delete(id: string): Promise<void> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        delete(args: {
          where: { id: string }
        }): Promise<unknown>
      }

      // Prisma will handle cascade deletes for related entities
      await campaignModel.delete({
        where: { id }
      })
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new Error(`Campaign with ID "${id}" not found`)
      }
      throw error
    }
  }

  /**
   * Update last played timestamp
   */
  async updateLastPlayed(id: string): Promise<Campaign> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        update(args: {
          where: { id: string }
          data: {
            lastPlayedAt: Date
          }
        }): Promise<unknown>
      }

      const campaign = await campaignModel.update({
        where: { id },
        data: {
          lastPlayedAt: new Date()
        }
      })

      return campaign as Campaign
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new Error(`Campaign with ID "${id}" not found`)
      }
      throw error
    }
  }

  /**
   * Check if campaign name exists (excluding specific ID)
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        findFirst(args: {
          where: {
            name: string
            id?: { not: string }
          }
        }): Promise<unknown | null>
      }

      const campaign = await campaignModel.findFirst({
        where: {
          name,
          ...(excludeId && { id: { not: excludeId } })
        }
      })

      return campaign !== null
    } catch (error) {
      throw error
    }
  }

  /**
   * Get campaign statistics
   */
  async getStatistics(id: string): Promise<CampaignWithStats['stats'] | null> {
    try {
      const client = await db()
      const campaignModel = (client as unknown as { campaign: unknown }).campaign as {
        findUnique(args: {
          where: { id: string }
          include: {
            _count: {
              select: {
                npcs: boolean
                locations: boolean
                quests: boolean
                encounters: boolean
                chronicles: boolean
              }
            }
          }
        }): Promise<unknown | null>
      }

      const campaign = await campaignModel.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              npcs: true,
              locations: true,
              quests: true,
              encounters: true,
              chronicles: true
            }
          }
        }
      })

      if (!campaign) {
        return null
      }

      const typedCampaign = campaign as CampaignWithCount
      return {
        npcCount: typedCampaign._count?.npcs || 0,
        locationCount: typedCampaign._count?.locations || 0,
        questCount: typedCampaign._count?.quests || 0,
        encounterCount: typedCampaign._count?.encounters || 0,
        chronicleCount: typedCampaign._count?.chronicles || 0
      }
    } catch (error) {
      throw error
    }
  }
}
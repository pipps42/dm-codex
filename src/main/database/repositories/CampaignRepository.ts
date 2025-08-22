// Campaign Repository - Data access layer for Campaign entity
// Wraps PrismaClient operations with type safety and error handling

import { PrismaClient } from '../generated/prisma'
import type { Campaign } from '../generated/prisma'
import type { CreateCampaignInput, UpdateCampaignInput, CampaignWithStats } from '../../../shared/types/ipc'


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
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new campaign
   */
  async create(data: CreateCampaignInput): Promise<Campaign> {
    try {
      const campaign = await this.prisma.campaign.create({
        data: {
          name: data.name,
          description: data.description,
          coverImagePath: data.coverImagePath
        }
      })

      return campaign
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
      const campaigns = await this.prisma.campaign.findMany({
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

      return campaigns.map((campaign) => ({
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
      const campaign = await this.prisma.campaign.findUnique({
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

      return {
        ...campaign,
        stats: {
          npcCount: campaign._count?.npcs || 0,
          locationCount: campaign._count?.locations || 0,
          questCount: campaign._count?.quests || 0,
          encounterCount: campaign._count?.encounters || 0,
          chronicleCount: campaign._count?.chronicles || 0
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
      const campaign = await this.prisma.campaign.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          coverImagePath: data.coverImagePath,
          lastPlayedAt: data.lastPlayedAt
        }
      })

      return campaign
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
      // Prisma will handle cascade deletes for related entities
      await this.prisma.campaign.delete({
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
      const campaign = await this.prisma.campaign.update({
        where: { id },
        data: {
          lastPlayedAt: new Date()
        }
      })

      return campaign
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
      const campaign = await this.prisma.campaign.findFirst({
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
      const campaign = await this.prisma.campaign.findUnique({
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

      return {
        npcCount: campaign._count?.npcs || 0,
        locationCount: campaign._count?.locations || 0,
        questCount: campaign._count?.quests || 0,
        encounterCount: campaign._count?.encounters || 0,
        chronicleCount: campaign._count?.chronicles || 0
      }
    } catch (error) {
      throw error
    }
  }
}
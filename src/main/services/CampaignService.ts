// Campaign Service - Business logic layer for Campaign operations
// Handles validation, file system operations, and orchestrates repository calls

import { CampaignRepository } from '../database/repositories/CampaignRepository'
import { getPrismaClient } from '../database/client'
import { FileSystemService } from './FileSystemService'
import type { Campaign } from '../database/generated/prisma'
import type { CreateCampaignInput, UpdateCampaignInput, CampaignWithStats } from '../../shared/types/ipc'
import fs from 'fs-extra'
import path from 'path'
import { app } from 'electron'
import { z } from 'zod'

// Validation schemas
const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100, 'Campaign name must be less than 100 characters'),
  description: z.string().optional(),
  coverImagePath: z.string().optional()
})

const updateCampaignSchema = z.object({
  id: z.string().uuid('Invalid campaign ID'),
  name: z.string().min(1, 'Campaign name is required').max(100, 'Campaign name must be less than 100 characters').optional(),
  description: z.string().optional(),
  coverImagePath: z.string().optional(),
  lastPlayedAt: z.date().optional()
})

export class CampaignService {
  private repository: CampaignRepository | null = null
  private fileSystemService: FileSystemService

  constructor() {
    this.fileSystemService = new FileSystemService()
  }

  private async getRepository(): Promise<CampaignRepository> {
    if (!this.repository) {
      const prisma = await getPrismaClient()
      this.repository = new CampaignRepository(prisma)
    }
    return this.repository
  }

  /**
   * Create a new campaign with folder structure
   */
  async create(data: CreateCampaignInput): Promise<Campaign> {
    // Validate input
    const validatedData = createCampaignSchema.parse(data)
    const repository = await this.getRepository()

    // Check if name already exists
    const nameExists = await repository.nameExists(validatedData.name)
    if (nameExists) {
      throw new Error(`Campaign with name "${validatedData.name}" already exists`)
    }

    // Create campaign in database
    const campaign = await repository.create(validatedData)

    // Create campaign folder structure
    try {
      await this.createCampaignFolders(campaign.id)
    } catch (error) {
      // If folder creation fails, cleanup the database entry
      try {
        await repository.delete(campaign.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup campaign after folder creation error:', cleanupError)
      }
      throw new Error(`Failed to create campaign folders: ${error}`)
    }

    return campaign
  }

  /**
   * Find all campaigns with statistics
   */
  async findAll(): Promise<CampaignWithStats[]> {
    const repository = await this.getRepository()
    return await repository.findAll()
  }

  /**
   * Find campaign by ID
   */
  async findById(id: string): Promise<CampaignWithStats | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid campaign ID format')
    }

    const repository = await this.getRepository()
    return await repository.findById(id)
  }

  /**
   * Update campaign
   */
  async update(data: UpdateCampaignInput): Promise<Campaign> {
    // Validate input
    const validatedData = updateCampaignSchema.parse(data)
    const repository = await this.getRepository()

    // Check if campaign exists
    const existingCampaign = await repository.findById(validatedData.id)
    if (!existingCampaign) {
      throw new Error(`Campaign with ID "${validatedData.id}" not found`)
    }

    // Check if name conflicts with other campaigns
    if (validatedData.name && validatedData.name !== existingCampaign.name) {
      const nameExists = await repository.nameExists(validatedData.name, validatedData.id)
      if (nameExists) {
        throw new Error(`Campaign with name "${validatedData.name}" already exists`)
      }
    }

    // Update campaign
    return await repository.update(validatedData)
  }

  /**
   * Delete campaign and its folders
   */
  async delete(id: string): Promise<void> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid campaign ID format')
    }

    const repository = await this.getRepository()

    // Check if campaign exists
    const campaign = await repository.findById(id)
    if (!campaign) {
      throw new Error(`Campaign with ID "${id}" not found`)
    }

    // Delete from database first
    await repository.delete(id)

    // Then cleanup folders
    try {
      await this.deleteCampaignFolders(id)
    } catch (error) {
      console.error(`Failed to delete campaign folders for ${id}:`, error)
      // Don't throw here since the database deletion succeeded
    }
  }

  /**
   * Update last played timestamp
   */
  async updateLastPlayed(id: string): Promise<Campaign> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid campaign ID format')
    }

    const repository = await this.getRepository()
    return await repository.updateLastPlayed(id)
  }

  /**
   * Get campaign data directory path
   */
  getCampaignDataPath(campaignId: string): string {
    const isDev = process.env.NODE_ENV === 'development'
    
    if (isDev) {
      return path.join(process.cwd(), 'data', 'campaigns', campaignId)
    } else {
      const userDataPath = app.getPath('userData')
      return path.join(userDataPath, 'data', 'campaigns', campaignId)
    }
  }

  /**
   * Create campaign folder structure
   */
  private async createCampaignFolders(campaignId: string): Promise<void> {
    const basePath = this.getCampaignDataPath(campaignId)

    const folders = [
      basePath,
      path.join(basePath, 'cover'),      // Campaign cover images
      path.join(basePath, 'maps'),       // Map images
      path.join(basePath, 'portraits'),  // NPC and PC portraits
      path.join(basePath, 'assets'),     // General assets
      path.join(basePath, 'backups'),    // Campaign backups
      path.join(basePath, 'exports')     // Exported data
    ]

    for (const folder of folders) {
      await fs.ensureDir(folder)
    }

    // Create a README file with folder structure explanation
    const readmeContent = `# Campaign Data Folder

This folder contains all data files for this campaign.

## Folder Structure:
- \`cover/\` - Campaign cover images
- \`maps/\` - Battle maps and world maps
- \`portraits/\` - Character and NPC portraits
- \`assets/\` - General campaign assets (documents, handouts, etc.)
- \`backups/\` - Automated campaign backups
- \`exports/\` - Exported campaign data

## Notes:
- This folder is automatically managed by DM's Codex
- Do not modify the structure unless you know what you're doing
- Files in \`backups/\` are automatically created and cleaned up
`

    await fs.writeFile(path.join(basePath, 'README.md'), readmeContent)
  }

  /**
   * Delete campaign folders
   */
  private async deleteCampaignFolders(campaignId: string): Promise<void> {
    const basePath = this.getCampaignDataPath(campaignId)

    if (await fs.pathExists(basePath)) {
      await fs.remove(basePath)
    }
  }

  /**
   * Set campaign cover image with optimization
   */
  async setCoverImage(campaignId: string, sourcePath: string): Promise<string> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const repository = await this.getRepository()

    // Check if campaign exists
    const campaign = await repository.findById(campaignId)
    if (!campaign) {
      throw new Error(`Campaign with ID "${campaignId}" not found`)
    }

    // Use FileSystemService to save and optimize the image
    const result = await this.fileSystemService.saveFile(
      campaignId,
      'cover',
      sourcePath,
      {
        fileName: `cover${path.extname(sourcePath)}`,
        optimize: true,
        optimizationOptions: this.fileSystemService.getOptimizationPresets('cover'),
        overwrite: true
      }
    )

    if (!result.success) {
      throw new Error(result.error || 'Failed to save cover image')
    }

    // Update campaign with new cover path
    await repository.update({
      id: campaignId,
      coverImagePath: result.finalPath
    })

    return result.finalPath
  }

  /**
   * Remove campaign cover image
   */
  async removeCoverImage(campaignId: string): Promise<void> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const repository = await this.getRepository()

    // Get campaign to check current cover
    const campaign = await repository.findById(campaignId)
    if (!campaign) {
      throw new Error(`Campaign with ID "${campaignId}" not found`)
    }

    // Remove cover image file using FileSystemService
    if (campaign.coverImagePath) {
      try {
        const fileName = path.basename(campaign.coverImagePath)
        await this.fileSystemService.deleteFile(campaignId, 'cover', fileName)
      } catch (error) {
        console.warn('Failed to delete cover image file:', error)
        // Continue with database update even if file deletion fails
      }
    }

    // Update campaign to remove cover path
    await repository.update({
      id: campaignId,
      coverImagePath: undefined
    })
  }
}
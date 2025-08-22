// Campaign IPC Handlers - Handle IPC communication for Campaign operations
// Registers handlers for all campaign-related IPC channels

import { ipcMain } from 'electron'
import { CampaignService } from '../../services/CampaignService'
import type {
  IpcChannelName,
  IpcChannelInput,
  IpcResult,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignWithStats
} from '../../../shared/types/ipc'
import { createSuccessResult, createErrorResult, IpcErrorCode } from '../../../shared/types/ipc'
import type { Campaign } from '../../database/generated/prisma'

export class CampaignHandlers {
  private service: CampaignService

  constructor() {
    this.service = new CampaignService()
  }

  /**
   * Register all campaign IPC handlers
   */
  register(): void {
    // Create campaign
    ipcMain.handle('campaign:create', async (_, input: CreateCampaignInput): Promise<IpcResult<Campaign>> => {
      return this.handleWithErrorManagement(async () => {
        const campaign = await this.service.create(input)
        return createSuccessResult(campaign)
      })
    })

    // Find all campaigns
    ipcMain.handle('campaign:findAll', async (_): Promise<IpcResult<CampaignWithStats[]>> => {
      return this.handleWithErrorManagement(async () => {
        const campaigns = await this.service.findAll()
        return createSuccessResult(campaigns)
      })
    })

    // Find campaign by ID
    ipcMain.handle('campaign:findById', async (_, input: { id: string }): Promise<IpcResult<CampaignWithStats | null>> => {
      return this.handleWithErrorManagement(async () => {
        const campaign = await this.service.findById(input.id)
        return createSuccessResult(campaign)
      })
    })

    // Update campaign
    ipcMain.handle('campaign:update', async (_, input: UpdateCampaignInput): Promise<IpcResult<Campaign>> => {
      return this.handleWithErrorManagement(async () => {
        const campaign = await this.service.update(input)
        return createSuccessResult(campaign)
      })
    })

    // Delete campaign
    ipcMain.handle('campaign:delete', async (_, input: { id: string }): Promise<IpcResult<void>> => {
      return this.handleWithErrorManagement(async () => {
        await this.service.delete(input.id)
        return createSuccessResult(undefined)
      })
    })

    // Update last played
    ipcMain.handle('campaign:updateLastPlayed', async (_, input: { id: string }): Promise<IpcResult<Campaign>> => {
      return this.handleWithErrorManagement(async () => {
        const campaign = await this.service.updateLastPlayed(input.id)
        return createSuccessResult(campaign)
      })
    })

    console.log('✅ Campaign IPC handlers registered')
  }

  /**
   * Unregister all campaign IPC handlers
   */
  unregister(): void {
    const channels: IpcChannelName[] = [
      'campaign:create',
      'campaign:findAll',
      'campaign:findById',
      'campaign:update',
      'campaign:delete',
      'campaign:updateLastPlayed'
    ]

    channels.forEach(channel => {
      ipcMain.removeAllListeners(channel)
    })

    console.log('✅ Campaign IPC handlers unregistered')
  }

  /**
   * Error management wrapper for IPC handlers
   */
  private async handleWithErrorManagement<T>(
    handler: () => Promise<IpcResult<T>>
  ): Promise<IpcResult<T>> {
    try {
      return await handler()
    } catch (error) {
      console.error('Campaign IPC Handler Error:', error)
      
      // Convert known errors to appropriate error codes
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      let errorCode = IpcErrorCode.UNKNOWN_ERROR
      
      if (errorMessage.includes('already exists')) {
        errorCode = IpcErrorCode.ALREADY_EXISTS
      } else if (errorMessage.includes('not found')) {
        errorCode = IpcErrorCode.NOT_FOUND
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('required')) {
        errorCode = IpcErrorCode.VALIDATION_ERROR
      } else if (errorMessage.includes('database') || errorMessage.includes('Prisma')) {
        errorCode = IpcErrorCode.DATABASE_ERROR
      } else if (errorMessage.includes('file') || errorMessage.includes('folder') || errorMessage.includes('path')) {
        errorCode = IpcErrorCode.FILE_SYSTEM_ERROR
      }

      return createErrorResult(errorMessage, errorCode, error)
    }
  }
}

// Singleton instance
let campaignHandlers: CampaignHandlers | null = null

/**
 * Get singleton instance of campaign handlers
 */
export function getCampaignHandlers(): CampaignHandlers {
  if (!campaignHandlers) {
    campaignHandlers = new CampaignHandlers()
  }
  return campaignHandlers
}

/**
 * Register campaign handlers
 */
export function registerCampaignHandlers(): void {
  getCampaignHandlers().register()
}

/**
 * Unregister campaign handlers
 */
export function unregisterCampaignHandlers(): void {
  if (campaignHandlers) {
    campaignHandlers.unregister()
    campaignHandlers = null
  }
}
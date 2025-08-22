// Campaign Service Client - Renderer-side service for Campaign operations
// Wraps IPC calls with user-friendly error handling and loading states

import type {
  IpcResult,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignWithStats,
  IpcErrorCode
} from '../../shared/types/ipc'
import type { Campaign } from '../../main/database/generated/prisma'

export interface CampaignServiceError {
  message: string
  code: IpcErrorCode
  details?: unknown
}

export class CampaignServiceClient {
  /**
   * Create a new campaign
   */
  async create(input: CreateCampaignInput): Promise<Campaign> {
    try {
      const result = await window.dmCodex.campaign.create(input)
      
      if (!result.success) {
        throw this.createError(result.error!)
      }

      return result.data!
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Get all campaigns with statistics
   */
  async findAll(): Promise<CampaignWithStats[]> {
    try {
      const result = await window.dmCodex.campaign.findAll()
      
      if (!result.success) {
        throw this.createError(result.error!)
      }

      return result.data!
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Get campaign by ID
   */
  async findById(id: string): Promise<CampaignWithStats | null> {
    try {
      const result = await window.dmCodex.campaign.findById(id)
      
      if (!result.success) {
        throw this.createError(result.error!)
      }

      return result.data!
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Update campaign
   */
  async update(input: UpdateCampaignInput): Promise<Campaign> {
    try {
      const result = await window.dmCodex.campaign.update(input)
      
      if (!result.success) {
        throw this.createError(result.error!)
      }

      return result.data!
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Delete campaign
   */
  async delete(id: string): Promise<void> {
    try {
      const result = await window.dmCodex.campaign.delete(id)
      
      if (!result.success) {
        throw this.createError(result.error!)
      }
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Update campaign's last played timestamp
   */
  async updateLastPlayed(id: string): Promise<Campaign> {
    try {
      const result = await window.dmCodex.campaign.updateLastPlayed(id)
      
      if (!result.success) {
        throw this.createError(result.error!)
      }

      return result.data!
    } catch (error) {
      if (error instanceof CampaignServiceError) {
        throw error
      }
      throw this.createUnknownError(error)
    }
  }

  /**
   * Create user-friendly error from IPC error
   */
  private createError(error: NonNullable<IpcResult['error']>): CampaignServiceError {
    return new CampaignServiceError(
      this.getUserFriendlyMessage(error.message, error.code as IpcErrorCode),
      error.code as IpcErrorCode,
      error.details
    )
  }

  /**
   * Create error for unknown/unexpected errors
   */
  private createUnknownError(error: unknown): CampaignServiceError {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new CampaignServiceError(
      `Something went wrong: ${message}`,
      'UNKNOWN_ERROR' as IpcErrorCode,
      error
    )
  }

  /**
   * Convert technical error messages to user-friendly ones
   */
  private getUserFriendlyMessage(message: string, code: IpcErrorCode): string {
    switch (code) {
      case 'VALIDATION_ERROR':
        if (message.includes('name is required')) {
          return 'Campaign name is required'
        }
        if (message.includes('name must be less than')) {
          return 'Campaign name is too long (maximum 100 characters)'
        }
        if (message.includes('Invalid campaign ID')) {
          return 'Invalid campaign selected'
        }
        return `Validation error: ${message}`

      case 'ALREADY_EXISTS':
        if (message.includes('already exists')) {
          return 'A campaign with this name already exists. Please choose a different name.'
        }
        return 'This item already exists'

      case 'NOT_FOUND':
        if (message.includes('not found')) {
          return 'Campaign not found. It may have been deleted.'
        }
        return 'The requested item was not found'

      case 'DATABASE_ERROR':
        return 'Database error occurred. Please try again or restart the application.'

      case 'FILE_SYSTEM_ERROR':
        if (message.includes('folder')) {
          return 'Failed to create campaign folders. Please check disk space and permissions.'
        }
        return 'File system error occurred. Please check disk space and permissions.'

      case 'UNKNOWN_ERROR':
      default:
        return `An error occurred: ${message}`
    }
  }
}

// Custom error class for campaign service errors
export class CampaignServiceError extends Error {
  constructor(
    message: string,
    public code: IpcErrorCode,
    public details?: unknown
  ) {
    super(message)
    this.name = 'CampaignServiceError'
  }
}

// Export singleton instance
export const campaignService = new CampaignServiceClient()

// Export types for use in components
export type { CampaignWithStats, CreateCampaignInput, UpdateCampaignInput } from '../../shared/types/ipc'
export type { Campaign } from '../../main/database/generated/prisma'
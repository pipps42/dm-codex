// Type-safe IPC channel definitions for DM's Codex
// Each channel defines input and output types

import type { Campaign } from '../../main/database/generated/prisma'

// Base IPC types
export interface IpcResult<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
  }
}

// Campaign input types
export interface CreateCampaignInput {
  name: string
  description?: string
  coverImagePath?: string
}

export interface UpdateCampaignInput {
  id: string
  name?: string
  description?: string
  coverImagePath?: string
  lastPlayedAt?: Date
}

export interface CampaignWithStats extends Campaign {
  stats: {
    npcCount: number
    locationCount: number
    questCount: number
    encounterCount: number
    chronicleCount: number
  }
}

// IPC Channel definitions - each channel has input and output types
export interface IpcChannels {
  // Campaign channels
  'campaign:create': {
    input: CreateCampaignInput
    output: Campaign
  }
  'campaign:findAll': {
    input: void
    output: CampaignWithStats[]
  }
  'campaign:findById': {
    input: { id: string }
    output: CampaignWithStats | null
  }
  'campaign:update': {
    input: UpdateCampaignInput
    output: Campaign
  }
  'campaign:delete': {
    input: { id: string }
    output: void
  }
  'campaign:updateLastPlayed': {
    input: { id: string }
    output: Campaign
  }

  // File System channels
  'filesystem:saveFile': {
    input: {
      campaignId: string
      fileType: 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'
      sourcePath: string
      fileName?: string
      optimize?: boolean
      optimizationOptions?: {
        maxWidth?: number
        maxHeight?: number
        quality?: number
        format?: 'jpeg' | 'png' | 'webp'
        progressive?: boolean
      }
      overwrite?: boolean
      generateUniqueId?: boolean
    }
    output: FileOperationResult
  }
  'filesystem:deleteFile': {
    input: {
      campaignId: string
      fileType: 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'
      fileName: string
    }
    output: void
  }
  'filesystem:listFiles': {
    input: {
      campaignId: string
      fileType: 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'
    }
    output: string[]
  }
  'filesystem:getFileInfo': {
    input: {
      campaignId: string
      fileType: 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'
      fileName: string
    }
    output: FileInfo
  }
  'filesystem:createBackup': {
    input: {
      campaignId: string
    }
    output: string
  }
  'filesystem:cleanupBackups': {
    input: {
      campaignId: string
      keepCount?: number
    }
    output: void
  }
  'filesystem:getCampaignPath': {
    input: {
      campaignId: string
      subPath?: string
    }
    output: string
  }
  'filesystem:getTypedPath': {
    input: {
      campaignId: string
      fileType: 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'
      fileName?: string
    }
    output: string
  }
  'filesystem:validateFile': {
    input: {
      filePath: string
      maxSize?: number
      allowedExtensions?: string[]
    }
    output: void
  }
}

// Helper type to extract channel names
export type IpcChannelName = keyof IpcChannels

// Helper types to extract input/output types for a specific channel
export type IpcChannelInput<T extends IpcChannelName> = IpcChannels[T]['input']
export type IpcChannelOutput<T extends IpcChannelName> = IpcChannels[T]['output']

// Type for IPC handler functions
export type IpcHandler<T extends IpcChannelName> = (
  input: IpcChannelInput<T>
) => Promise<IpcResult<IpcChannelOutput<T>>>

// File System input types
export interface FileOperationResult {
  success: boolean
  originalPath: string
  finalPath: string
  optimized: boolean
  sizeReduction?: number
  error?: string
}

export interface FileInfo {
  path: string
  size: number
  created: Date
  modified: Date
  isImage: boolean
  dimensions?: { width: number; height: number }
}

// Error codes for consistent error handling
export enum IpcErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Helper function to create success result
export function createSuccessResult<T>(data: T): IpcResult<T> {
  return {
    success: true,
    data
  }
}

// Helper function to create error result
export function createErrorResult(
  message: string,
  code: IpcErrorCode = IpcErrorCode.UNKNOWN_ERROR,
  details?: unknown
): IpcResult<never> {
  return {
    success: false,
    error: {
      message,
      code,
      details
    }
  }
}
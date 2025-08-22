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

// Error codes for consistent error handling
export enum IpcErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
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
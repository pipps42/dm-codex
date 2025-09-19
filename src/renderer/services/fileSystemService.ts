// File System Service - Renderer side client for file operations
// Provides type-safe interface to file system IPC handlers

import type {
  IpcChannelInput,
  IpcChannelOutput,
  IpcResult,
  FileOperationResult,
  FileInfo
} from '../../shared/types/ipc'

// File type definitions
export type FileType = 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  progressive?: boolean
}

export interface SaveFileOptions {
  fileName?: string
  optimize?: boolean
  optimizationOptions?: ImageOptimizationOptions
  overwrite?: boolean
  generateUniqueId?: boolean
}

export class FileSystemService {
  /**
   * Save file to campaign directory with optimization
   */
  async saveFile(
    campaignId: string,
    fileType: FileType,
    sourcePath: string,
    options: SaveFileOptions = {}
  ): Promise<FileOperationResult> {
    const input: IpcChannelInput<'filesystem:saveFile'> = {
      campaignId,
      fileType,
      sourcePath,
      ...options
    }

    const result = await window.dmCodex.fileSystem.saveFile(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to save file')
    }

    return result.data!
  }

  /**
   * Delete file from campaign directory
   */
  async deleteFile(
    campaignId: string,
    fileType: FileType,
    fileName: string
  ): Promise<void> {
    const input: IpcChannelInput<'filesystem:deleteFile'> = {
      campaignId,
      fileType,
      fileName
    }

    const result = await window.dmCodex.fileSystem.deleteFile(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to delete file')
    }
  }

  /**
   * List files in campaign directory
   */
  async listFiles(
    campaignId: string,
    fileType: FileType
  ): Promise<string[]> {
    const input: IpcChannelInput<'filesystem:listFiles'> = {
      campaignId,
      fileType
    }

    const result = await window.dmCodex.fileSystem.listFiles(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to list files')
    }

    return result.data!
  }

  /**
   * Get file information and metadata
   */
  async getFileInfo(
    campaignId: string,
    fileType: FileType,
    fileName: string
  ): Promise<FileInfo> {
    const input: IpcChannelInput<'filesystem:getFileInfo'> = {
      campaignId,
      fileType,
      fileName
    }

    const result = await window.dmCodex.fileSystem.getFileInfo(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get file info')
    }

    return result.data!
  }

  /**
   * Create backup of campaign data
   */
  async createBackup(campaignId: string): Promise<string> {
    const input: IpcChannelInput<'filesystem:createBackup'> = {
      campaignId
    }

    const result = await window.dmCodex.fileSystem.createBackup(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create backup')
    }

    return result.data!
  }

  /**
   * Clean up old backups (keep only the last N backups)
   */
  async cleanupBackups(
    campaignId: string,
    keepCount = 5
  ): Promise<void> {
    const input: IpcChannelInput<'filesystem:cleanupBackups'> = {
      campaignId,
      keepCount
    }

    const result = await window.dmCodex.fileSystem.cleanupBackups(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to cleanup backups')
    }
  }

  /**
   * Get campaign data directory path
   */
  async getCampaignPath(campaignId: string, subPath?: string): Promise<string> {
    const input: IpcChannelInput<'filesystem:getCampaignPath'> = {
      campaignId,
      subPath
    }

    const result = await window.dmCodex.fileSystem.getCampaignPath(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get campaign path')
    }

    return result.data!
  }

  /**
   * Get typed file path for campaign assets
   */
  async getTypedPath(
    campaignId: string,
    fileType: FileType,
    fileName?: string
  ): Promise<string> {
    const input: IpcChannelInput<'filesystem:getTypedPath'> = {
      campaignId,
      fileType,
      fileName
    }

    const result = await window.dmCodex.fileSystem.getTypedPath(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get typed path')
    }

    return result.data!
  }

  /**
   * Validate file before processing
   */
  async validateFile(
    filePath: string,
    options: {
      maxSize?: number
      allowedExtensions?: string[]
    } = {}
  ): Promise<void> {
    const input: IpcChannelInput<'filesystem:validateFile'> = {
      filePath,
      ...options
    }

    const result = await window.dmCodex.fileSystem.validateFile(input)

    if (!result.success) {
      throw new Error(result.error?.message || 'File validation failed')
    }
  }

  /**
   * Helper: Save uploaded file from ImageUpload component
   */
  async saveUploadedFile(
    campaignId: string,
    fileType: FileType,
    file: File,
    options: Omit<SaveFileOptions, 'sourcePath'> = {}
  ): Promise<FileOperationResult> {
    // Create a temporary file path - in a real scenario you'd need to:
    // 1. Save the file to a temp location first
    // 2. Use that path for the actual save operation
    // For now, we'll throw an error with guidance
    throw new Error(
      'Direct File object upload not yet implemented. ' +
      'Please use file path or implement temporary file handling.'
    )
  }

  /**
   * Helper: Get optimized save options for different file types
   */
  getOptimizationPresets(fileType: FileType): ImageOptimizationOptions {
    const presets: Record<FileType, ImageOptimizationOptions> = {
      cover: {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 90,
        format: 'webp',
        progressive: true
      },
      portrait: {
        maxWidth: 512,
        maxHeight: 512,
        quality: 85,
        format: 'webp',
        progressive: true
      },
      map: {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 95,
        progressive: true
      },
      asset: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        progressive: true
      },
      backup: {
        // No optimization for backups
      },
      export: {
        // No optimization for exports
      }
    }

    return presets[fileType] || {}
  }

  /**
   * Helper: Check if file type supports optimization
   */
  supportsOptimization(fileType: FileType): boolean {
    return ['cover', 'portrait', 'map', 'asset'].includes(fileType)
  }

  /**
   * Helper: Get file size limit for file type
   */
  getFileSizeLimit(fileType: FileType): number {
    const limits: Record<FileType, number> = {
      cover: 10 * 1024 * 1024,      // 10MB
      portrait: 5 * 1024 * 1024,    // 5MB
      map: 50 * 1024 * 1024,        // 50MB
      asset: 25 * 1024 * 1024,      // 25MB
      backup: 1024 * 1024 * 1024,   // 1GB
      export: 100 * 1024 * 1024     // 100MB
    }

    return limits[fileType] || 10 * 1024 * 1024 // Default 10MB
  }
}

// Singleton instance
export const fileSystemService = new FileSystemService()
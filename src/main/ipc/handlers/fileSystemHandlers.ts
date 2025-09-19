// File System IPC Handlers - Handle IPC communication for file operations
// Registers handlers for all file management operations

import { ipcMain } from 'electron'
import { FileSystemService, type FileType, type ImageOptimizationOptions } from '../../services/FileSystemService'
import type {
  IpcResult
} from '../../../shared/types/ipc'
import { createSuccessResult, createErrorResult, IpcErrorCode } from '../../../shared/types/ipc'

// File operation input types
export interface SaveFileInput {
  campaignId: string
  fileType: FileType
  sourcePath: string
  fileName?: string
  optimize?: boolean
  optimizationOptions?: ImageOptimizationOptions
  overwrite?: boolean
  generateUniqueId?: boolean
}

export interface DeleteFileInput {
  campaignId: string
  fileType: FileType
  fileName: string
}

export interface ListFilesInput {
  campaignId: string
  fileType: FileType
}

export interface GetFileInfoInput {
  campaignId: string
  fileType: FileType
  fileName: string
}

export interface SaveFileFromBufferInput {
  campaignId: string
  fileType: FileType
  fileName: string
  buffer: ArrayBuffer
  mimeType: string
  optimize?: boolean
  optimizationOptions?: ImageOptimizationOptions
  overwrite?: boolean
}

export interface CreateBackupInput {
  campaignId: string
}

export interface CleanupBackupsInput {
  campaignId: string
  keepCount?: number
}

export class FileSystemHandlers {
  private service: FileSystemService

  constructor() {
    this.service = new FileSystemService()
  }

  /**
   * Register all file system IPC handlers
   */
  register(): void {
    // Save file to campaign directory
    ipcMain.handle('filesystem:saveFile', async (_, input: SaveFileInput): Promise<IpcResult<any>> => {
      return this.handleWithErrorManagement(async () => {
        const result = await this.service.saveFile(
          input.campaignId,
          input.fileType,
          input.sourcePath,
          {
            fileName: input.fileName,
            optimize: input.optimize,
            optimizationOptions: input.optimizationOptions,
            overwrite: input.overwrite,
            generateUniqueId: input.generateUniqueId
          }
        )
        return createSuccessResult(result)
      })
    })

    // Save file from buffer (for File objects)
    ipcMain.handle('filesystem:saveFileFromBuffer', async (_, input: SaveFileFromBufferInput): Promise<IpcResult<any>> => {
      return this.handleWithErrorManagement(async () => {
        const result = await this.service.saveFileFromBuffer(
          input.campaignId,
          input.fileType,
          input.fileName,
          input.buffer,
          input.mimeType,
          {
            optimize: input.optimize,
            optimizationOptions: input.optimizationOptions,
            overwrite: input.overwrite
          }
        )
        return createSuccessResult(result)
      })
    })

    // Delete file from campaign directory
    ipcMain.handle('filesystem:deleteFile', async (_, input: DeleteFileInput): Promise<IpcResult<void>> => {
      return this.handleWithErrorManagement(async () => {
        await this.service.deleteFile(input.campaignId, input.fileType, input.fileName)
        return createSuccessResult(undefined)
      })
    })

    // List files in campaign directory
    ipcMain.handle('filesystem:listFiles', async (_, input: ListFilesInput): Promise<IpcResult<string[]>> => {
      return this.handleWithErrorManagement(async () => {
        const files = await this.service.listFiles(input.campaignId, input.fileType)
        return createSuccessResult(files)
      })
    })

    // Get file information and metadata
    ipcMain.handle('filesystem:getFileInfo', async (_, input: GetFileInfoInput): Promise<IpcResult<any>> => {
      return this.handleWithErrorManagement(async () => {
        const info = await this.service.getFileInfo(input.campaignId, input.fileType, input.fileName)
        return createSuccessResult(info)
      })
    })

    // Create campaign backup
    ipcMain.handle('filesystem:createBackup', async (_, input: CreateBackupInput): Promise<IpcResult<string>> => {
      return this.handleWithErrorManagement(async () => {
        const backupPath = await this.service.createBackup(input.campaignId)
        return createSuccessResult(backupPath)
      })
    })

    // Clean up old backups
    ipcMain.handle('filesystem:cleanupBackups', async (_, input: CleanupBackupsInput): Promise<IpcResult<void>> => {
      return this.handleWithErrorManagement(async () => {
        await this.service.cleanupBackups(input.campaignId, input.keepCount)
        return createSuccessResult(undefined)
      })
    })

    // Get campaign data path
    ipcMain.handle('filesystem:getCampaignPath', async (_, input: { campaignId: string; subPath?: string }): Promise<IpcResult<string>> => {
      return this.handleWithErrorManagement(async () => {
        const path = this.service.getCampaignPath(input.campaignId, input.subPath)
        return createSuccessResult(path)
      })
    })

    // Get typed file path
    ipcMain.handle('filesystem:getTypedPath', async (_, input: { campaignId: string; fileType: FileType; fileName?: string }): Promise<IpcResult<string>> => {
      return this.handleWithErrorManagement(async () => {
        const path = this.service.getTypedPath(input.campaignId, input.fileType, input.fileName)
        return createSuccessResult(path)
      })
    })

    // Validate file before processing
    ipcMain.handle('filesystem:validateFile', async (_, input: { filePath: string; maxSize?: number; allowedExtensions?: string[] }): Promise<IpcResult<void>> => {
      return this.handleWithErrorManagement(async () => {
        await this.service.validateFile(input.filePath, {
          maxSize: input.maxSize,
          allowedExtensions: input.allowedExtensions
        })
        return createSuccessResult(undefined)
      })
    })

    console.log('✅ File System IPC handlers registered')
  }

  /**
   * Unregister all file system IPC handlers
   */
  unregister(): void {
    const channels = [
      'filesystem:saveFile',
      'filesystem:saveFileFromBuffer',
      'filesystem:deleteFile',
      'filesystem:listFiles',
      'filesystem:getFileInfo',
      'filesystem:createBackup',
      'filesystem:cleanupBackups',
      'filesystem:getCampaignPath',
      'filesystem:getTypedPath',
      'filesystem:validateFile'
    ]

    channels.forEach(channel => {
      ipcMain.removeAllListeners(channel)
    })

    console.log('✅ File System IPC handlers unregistered')
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
      console.error('File System IPC Handler Error:', error)

      // Convert known errors to appropriate error codes
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      let errorCode = IpcErrorCode.UNKNOWN_ERROR

      if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        errorCode = IpcErrorCode.NOT_FOUND
      } else if (errorMessage.includes('already exists')) {
        errorCode = IpcErrorCode.ALREADY_EXISTS
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('required') || errorMessage.includes('Unsupported')) {
        errorCode = IpcErrorCode.VALIDATION_ERROR
      } else if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        errorCode = IpcErrorCode.PERMISSION_DENIED
      } else if (errorMessage.includes('file') || errorMessage.includes('folder') || errorMessage.includes('path') || errorMessage.includes('File too large')) {
        errorCode = IpcErrorCode.FILE_SYSTEM_ERROR
      }

      return createErrorResult(errorMessage, errorCode, error)
    }
  }
}

// Singleton instance
let fileSystemHandlers: FileSystemHandlers | null = null

/**
 * Get singleton instance of file system handlers
 */
export function getFileSystemHandlers(): FileSystemHandlers {
  if (!fileSystemHandlers) {
    fileSystemHandlers = new FileSystemHandlers()
  }
  return fileSystemHandlers
}

/**
 * Register file system handlers
 */
export function registerFileSystemHandlers(): void {
  getFileSystemHandlers().register()
}

/**
 * Unregister file system handlers
 */
export function unregisterFileSystemHandlers(): void {
  if (fileSystemHandlers) {
    fileSystemHandlers.unregister()
    fileSystemHandlers = null
  }
}
// File utilities for renderer process
// Handles File object conversion, validation, and temporary storage

import { fileSystemService } from '../services/fileSystemService'
import type { FileType } from '../services/fileSystemService'

// Temporary file storage interface
interface TempFileInfo {
  file: File
  tempId: string
  path?: string
  cleanup: () => Promise<void>
}

// Global temp file registry
const tempFiles = new Map<string, TempFileInfo>()

/**
 * Generate a unique temporary ID
 */
function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convert File object to temporary path for processing
 * This creates a temporary reference that can be used with FileSystemService
 */
export async function fileToTempPath(file: File): Promise<{
  tempId: string
  cleanup: () => Promise<void>
}> {
  const tempId = generateTempId()

  const tempInfo: TempFileInfo = {
    file,
    tempId,
    cleanup: async () => {
      tempFiles.delete(tempId)
      // In a real implementation, we might need to clean up actual temp files
    }
  }

  tempFiles.set(tempId, tempInfo)

  return {
    tempId,
    cleanup: tempInfo.cleanup
  }
}

/**
 * Get File object from temporary ID
 */
export function getTempFile(tempId: string): File | null {
  const tempInfo = tempFiles.get(tempId)
  return tempInfo?.file || null
}

/**
 * Save File directly using FileSystemService
 */
export async function saveFileDirectly(
  file: File,
  campaignId: string,
  fileType: FileType,
  options: {
    fileName?: string
    optimize?: boolean
    overwrite?: boolean
  } = {}
): Promise<{
  success: boolean
  finalPath?: string
  originalSize: number
  optimizedSize?: number
  sizeReduction?: number
  error?: string
}> {
  try {
    // Validate file on client side first
    await validateFileClient(file, fileType)

    // Use the new FileSystemService method
    const result = await fileSystemService.saveUploadedFile(
      campaignId,
      fileType,
      file,
      {
        fileName: options.fileName,
        optimize: options.optimize,
        optimizationOptions: fileSystemService.getOptimizationPresets(fileType),
        overwrite: options.overwrite
      }
    )

    return {
      success: result.success,
      finalPath: result.finalPath,
      originalSize: file.size,
      optimizedSize: result.success ? file.size : undefined,
      sizeReduction: result.sizeReduction,
      error: result.error
    }

  } catch (error) {
    return {
      success: false,
      originalSize: file.size,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Client-side file validation
 */
export async function validateFileClient(
  file: File,
  fileType: FileType
): Promise<void> {
  // Check file type
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`)
  }

  // Check file size based on type
  const sizeLimit = getSizeLimit(fileType)
  if (file.size > sizeLimit) {
    const sizeLimitMB = (sizeLimit / (1024 * 1024)).toFixed(1)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(`File too large: ${fileSizeMB}MB (max: ${sizeLimitMB}MB)`)
  }
}

/**
 * Get size limit for file type
 */
function getSizeLimit(fileType: FileType): number {
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

/**
 * Create a data URL from File object for preview
 */
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get file extension from File object
 */
export function getFileExtension(file: File): string {
  const parts = file.name.split('.')
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : ''
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Cleanup all temporary files
 */
export async function cleanupAllTempFiles(): Promise<void> {
  const cleanupPromises = Array.from(tempFiles.values()).map(info => info.cleanup())
  await Promise.all(cleanupPromises)
  tempFiles.clear()
}

/**
 * Enhanced ImageUpload onChange handler
 * Provides additional file information and validation
 */
export interface EnhancedFileInfo {
  file: File
  preview: string
  tempId: string
  isValid: boolean
  validationError?: string
  formattedSize: string
  extension: string
  cleanup: () => Promise<void>
}

export async function processUploadedFile(
  file: File,
  fileType: FileType = 'asset'
): Promise<EnhancedFileInfo> {
  const { tempId, cleanup } = await fileToTempPath(file)
  const preview = await createFilePreview(file)
  const extension = getFileExtension(file)
  const formattedSize = formatFileSize(file.size)

  let isValid = true
  let validationError: string | undefined

  try {
    await validateFileClient(file, fileType)
  } catch (error) {
    isValid = false
    validationError = error instanceof Error ? error.message : 'Validation failed'
  }

  return {
    file,
    preview,
    tempId,
    isValid,
    validationError,
    formattedSize,
    extension,
    cleanup
  }
}
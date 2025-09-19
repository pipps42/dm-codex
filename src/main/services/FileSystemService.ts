// File System Service - Generic file management for DM's Codex
// Handles image optimization, file validation, path management, and batch operations

import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { app } from 'electron'
import { z } from 'zod'
import crypto from 'crypto'

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'] as const
export type SupportedImageFormat = typeof SUPPORTED_IMAGE_FORMATS[number]

// File type categories
export type FileType = 'cover' | 'portrait' | 'map' | 'asset' | 'backup' | 'export'

// File validation schema
const fileValidationSchema = z.object({
  path: z.string().min(1, 'File path is required'),
  maxSize: z.number().positive().default(10 * 1024 * 1024), // 10MB default
  allowedExtensions: z.array(z.string()).default([...SUPPORTED_IMAGE_FORMATS])
})

// Image optimization options
export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  progressive?: boolean
}

// File move/copy operation result
export interface FileOperationResult {
  success: boolean
  originalPath: string
  finalPath: string
  optimized: boolean
  sizeReduction?: number
  error?: string
}

export class FileSystemService {
  private readonly baseDataPath: string

  constructor() {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
      this.baseDataPath = path.join(process.cwd(), 'data')
    } else {
      const userDataPath = app.getPath('userData')
      this.baseDataPath = path.join(userDataPath, 'data')
    }
  }

  /**
   * Get base data directory path
   */
  getDataPath(): string {
    return this.baseDataPath
  }

  /**
   * Get campaign-specific path
   */
  getCampaignPath(campaignId: string, subPath?: string): string {
    const campaignPath = path.join(this.baseDataPath, 'campaigns', campaignId)
    return subPath ? path.join(campaignPath, subPath) : campaignPath
  }

  /**
   * Get typed file path for campaign assets
   */
  getTypedPath(campaignId: string, fileType: FileType, fileName?: string): string {
    const typePath = this.getCampaignPath(campaignId, fileType === 'cover' ? 'cover' :
                                        fileType === 'portrait' ? 'portraits' :
                                        fileType === 'map' ? 'maps' :
                                        fileType === 'asset' ? 'assets' :
                                        fileType === 'backup' ? 'backups' : 'exports')

    return fileName ? path.join(typePath, fileName) : typePath
  }

  /**
   * Validate file before processing
   */
  async validateFile(filePath: string, options?: Partial<z.infer<typeof fileValidationSchema>>): Promise<void> {
    const validationOptions = fileValidationSchema.parse({
      path: filePath,
      ...options
    })

    // Check if file exists
    if (!(await fs.pathExists(validationOptions.path))) {
      throw new Error(`File does not exist: ${validationOptions.path}`)
    }

    // Check file stats
    const stats = await fs.stat(validationOptions.path)

    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${validationOptions.path}`)
    }

    // Check file size
    if (stats.size > validationOptions.maxSize) {
      const maxSizeMB = (validationOptions.maxSize / (1024 * 1024)).toFixed(1)
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1)
      throw new Error(`File too large: ${fileSizeMB}MB (max: ${maxSizeMB}MB)`)
    }

    // Check file extension
    const ext = path.extname(validationOptions.path).toLowerCase()
    if (!validationOptions.allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file format: ${ext}. Allowed: ${validationOptions.allowedExtensions.join(', ')}`)
    }
  }

  /**
   * Generate a unique filename to avoid conflicts
   */
  generateUniqueFileName(originalPath: string, destinationDir: string): string {
    const ext = path.extname(originalPath)
    const baseName = path.basename(originalPath, ext)
    let fileName = `${baseName}${ext}`
    let counter = 1

    while (fs.existsSync(path.join(destinationDir, fileName))) {
      fileName = `${baseName}_${counter}${ext}`
      counter++
    }

    return fileName
  }

  /**
   * Generate a hash-based filename for deduplication
   */
  async generateHashFileName(filePath: string, prefix = ''): Promise<string> {
    const ext = path.extname(filePath)
    const buffer = await fs.readFile(filePath)
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16)
    return `${prefix}${prefix ? '_' : ''}${hash}${ext}`
  }

  /**
   * Optimize image with sharp
   */
  async optimizeImage(
    sourcePath: string,
    destinationPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<{ success: boolean; originalSize: number; optimizedSize: number; sizeReduction: number }> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      format,
      progressive = true
    } = options

    try {
      // Get original file size
      const originalStats = await fs.stat(sourcePath)
      const originalSize = originalStats.size

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destinationPath))

      // Process image with sharp
      let sharpInstance = sharp(sourcePath)

      // Get image metadata
      const metadata = await sharpInstance.metadata()

      // Resize if necessary
      if (metadata.width && metadata.width > maxWidth || metadata.height && metadata.height > maxHeight) {
        sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }

      // Apply format-specific optimizations
      if (format === 'jpeg' || (!format && ['.jpg', '.jpeg'].includes(path.extname(sourcePath).toLowerCase()))) {
        sharpInstance = sharpInstance.jpeg({ quality, progressive })
      } else if (format === 'png' || (!format && path.extname(sourcePath).toLowerCase() === '.png')) {
        sharpInstance = sharpInstance.png({ quality, progressive })
      } else if (format === 'webp' || (!format && path.extname(sourcePath).toLowerCase() === '.webp')) {
        sharpInstance = sharpInstance.webp({ quality })
      }

      // Save optimized image
      await sharpInstance.toFile(destinationPath)

      // Get optimized file size
      const optimizedStats = await fs.stat(destinationPath)
      const optimizedSize = optimizedStats.size
      const sizeReduction = ((originalSize - optimizedSize) / originalSize) * 100

      return {
        success: true,
        originalSize,
        optimizedSize,
        sizeReduction: Math.max(0, sizeReduction)
      }
    } catch (error) {
      console.error('Image optimization failed:', error)

      // Fallback: copy original file
      await fs.copy(sourcePath, destinationPath, { overwrite: true })
      const stats = await fs.stat(destinationPath)

      return {
        success: false,
        originalSize: stats.size,
        optimizedSize: stats.size,
        sizeReduction: 0
      }
    }
  }

  /**
   * Save file from buffer (for File objects from renderer)
   */
  async saveFileFromBuffer(
    campaignId: string,
    fileType: FileType,
    fileName: string,
    buffer: ArrayBuffer,
    mimeType: string,
    options: {
      optimize?: boolean
      optimizationOptions?: ImageOptimizationOptions
      overwrite?: boolean
    } = {}
  ): Promise<FileOperationResult> {
    const {
      optimize = true,
      optimizationOptions = {},
      overwrite = false
    } = options

    try {
      // Validate campaign ID
      if (!z.string().uuid().safeParse(campaignId).success) {
        throw new Error('Invalid campaign ID format')
      }

      // Ensure campaign directories exist
      await this.ensureCampaignDirectories(campaignId)

      // Create temporary file from buffer
      const tempDir = require('os').tmpdir()
      const tempFileName = `temp_${Date.now()}_${fileName}`
      const tempPath = path.join(tempDir, tempFileName)

      // Write buffer to temporary file
      await fs.writeFile(tempPath, Buffer.from(buffer))

      try {
        // Use existing saveFile method with temporary file
        const result = await this.saveFile(campaignId, fileType, tempPath, {
          fileName,
          optimize,
          optimizationOptions,
          overwrite
        })

        // Clean up temporary file
        await fs.remove(tempPath)

        return result
      } catch (error) {
        // Clean up temporary file on error
        await fs.remove(tempPath).catch(() => {})
        throw error
      }
    } catch (error) {
      return {
        success: false,
        originalPath: `buffer:${fileName}`,
        finalPath: '',
        optimized: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Save file to campaign directory with optimization
   */
  async saveFile(
    campaignId: string,
    fileType: FileType,
    sourcePath: string,
    options: {
      fileName?: string
      optimize?: boolean
      optimizationOptions?: ImageOptimizationOptions
      overwrite?: boolean
      generateUniqueId?: boolean
    } = {}
  ): Promise<FileOperationResult> {
    const {
      fileName,
      optimize = true,
      optimizationOptions = {},
      overwrite = false,
      generateUniqueId = false
    } = options

    try {
      // Validate campaign ID
      if (!z.string().uuid().safeParse(campaignId).success) {
        throw new Error('Invalid campaign ID format')
      }

      // Validate source file
      await this.validateFile(sourcePath)

      // Ensure campaign directories exist
      await this.ensureCampaignDirectories(campaignId)

      // Generate destination filename
      let finalFileName: string
      if (fileName) {
        finalFileName = fileName
      } else if (generateUniqueId) {
        finalFileName = await this.generateHashFileName(sourcePath, fileType)
      } else {
        const destDir = this.getTypedPath(campaignId, fileType)
        finalFileName = this.generateUniqueFileName(sourcePath, destDir)
      }

      const finalPath = this.getTypedPath(campaignId, fileType, finalFileName)

      // Check if file exists and handle overwrite
      if (!overwrite && await fs.pathExists(finalPath)) {
        throw new Error(`File already exists: ${finalFileName}`)
      }

      // Process file
      let optimized = false
      let sizeReduction = 0

      if (optimize && this.isImageFile(sourcePath)) {
        try {
          const result = await this.optimizeImage(sourcePath, finalPath, optimizationOptions)
          optimized = result.success
          sizeReduction = result.sizeReduction
        } catch (error) {
          console.warn('Image optimization failed, copying original:', error)
          await fs.copy(sourcePath, finalPath, { overwrite: true })
        }
      } else {
        await fs.copy(sourcePath, finalPath, { overwrite: true })
      }

      return {
        success: true,
        originalPath: sourcePath,
        finalPath,
        optimized,
        sizeReduction: optimized ? sizeReduction : undefined
      }
    } catch (error) {
      return {
        success: false,
        originalPath: sourcePath,
        finalPath: '',
        optimized: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete file from campaign directory
   */
  async deleteFile(campaignId: string, fileType: FileType, fileName: string): Promise<void> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const filePath = this.getTypedPath(campaignId, fileType, fileName)

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath)
    }
  }

  /**
   * List files in campaign directory
   */
  async listFiles(campaignId: string, fileType: FileType): Promise<string[]> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const dirPath = this.getTypedPath(campaignId, fileType)

    if (!(await fs.pathExists(dirPath))) {
      return []
    }

    const files = await fs.readdir(dirPath)
    return files.filter(file => {
      const filePath = path.join(dirPath, file)
      return fs.statSync(filePath).isFile()
    })
  }

  /**
   * Get file stats and metadata
   */
  async getFileInfo(campaignId: string, fileType: FileType, fileName: string): Promise<{
    path: string
    size: number
    created: Date
    modified: Date
    isImage: boolean
    dimensions?: { width: number; height: number }
  }> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const filePath = this.getTypedPath(campaignId, fileType, fileName)

    if (!(await fs.pathExists(filePath))) {
      throw new Error(`File not found: ${fileName}`)
    }

    const stats = await fs.stat(filePath)
    const isImage = this.isImageFile(filePath)

    let dimensions: { width: number; height: number } | undefined

    if (isImage) {
      try {
        const metadata = await sharp(filePath).metadata()
        if (metadata.width && metadata.height) {
          dimensions = { width: metadata.width, height: metadata.height }
        }
      } catch (error) {
        console.warn('Failed to get image dimensions:', error)
      }
    }

    return {
      path: filePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isImage,
      dimensions
    }
  }

  /**
   * Create backup of campaign data
   */
  async createBackup(campaignId: string): Promise<string> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `backup_${timestamp}.zip`
    const backupPath = this.getTypedPath(campaignId, 'backup', backupFileName)

    // This would require a zip library - for now just create a placeholder
    await fs.ensureDir(path.dirname(backupPath))
    await fs.writeFile(backupPath, JSON.stringify({
      campaignId,
      timestamp,
      note: 'Backup functionality to be implemented with zip library'
    }))

    return backupPath
  }

  /**
   * Clean up old backups (keep only the last N backups)
   */
  async cleanupBackups(campaignId: string, keepCount = 5): Promise<void> {
    if (!z.string().uuid().safeParse(campaignId).success) {
      throw new Error('Invalid campaign ID format')
    }

    const backupDir = this.getTypedPath(campaignId, 'backup')

    if (!(await fs.pathExists(backupDir))) {
      return
    }

    const files = await fs.readdir(backupDir)
    const backupFiles = files
      .filter(file => file.startsWith('backup_') && file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        stat: fs.statSync(path.join(backupDir, file))
      }))
      .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime())

    // Delete old backups
    const filesToDelete = backupFiles.slice(keepCount)
    for (const file of filesToDelete) {
      await fs.remove(file.path)
    }
  }

  /**
   * Ensure all campaign directories exist
   */
  private async ensureCampaignDirectories(campaignId: string): Promise<void> {
    const basePath = this.getCampaignPath(campaignId)

    const directories = [
      basePath,
      this.getTypedPath(campaignId, 'cover'),
      this.getTypedPath(campaignId, 'portrait'),
      this.getTypedPath(campaignId, 'map'),
      this.getTypedPath(campaignId, 'asset'),
      this.getTypedPath(campaignId, 'backup'),
      this.getTypedPath(campaignId, 'export')
    ]

    for (const dir of directories) {
      await fs.ensureDir(dir)
    }
  }

  /**
   * Check if file is an image based on extension
   */
  private isImageFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase()
    return SUPPORTED_IMAGE_FORMATS.includes(ext as SupportedImageFormat)
  }

  /**
   * Get optimization presets for different file types
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
}
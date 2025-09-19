// Singleton PrismaClient for DM's Codex
// Ensures single database connection across the application

import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'
import fs from 'fs-extra'

// Module-level variables for the singleton
let prismaClient: PrismaClient | null = null

export const getPrismaClient = async (): Promise<PrismaClient> => {
  if (!prismaClient) {
    // Get the correct database path based on environment
    const isDev = process.env.NODE_ENV === 'development'
    
    let databasePath: string
    let dataDir: string
    
    if (isDev) {
      // In development, use relative path from the project root
      dataDir = path.join(process.cwd(), 'data')
      databasePath = path.join(dataDir, 'database.db')
    } else {
      // In production, use userData directory
      const userDataPath = app.getPath('userData')
      dataDir = path.join(userDataPath, 'data')
      databasePath = path.join(dataDir, 'database.db')
    }

    // Create data directory if it doesn't exist
    await fs.ensureDir(dataDir)

    // Ensure the path uses forward slashes for SQLite URL
    const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: isDev ? ['query', 'info', 'warn', 'error'] : ['error']
    })

    // Handle graceful shutdown
    process.on('beforeExit', async () => {
      await DatabaseManager.disconnect()
    })

    process.on('SIGINT', async () => {
      await DatabaseManager.disconnect()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await DatabaseManager.disconnect()
      process.exit(0)
    })
  }

  return prismaClient
}

export class DatabaseManager {
  private static isConnected = false

  private constructor() {}

  public static async getInstance(): Promise<PrismaClient> {
    return await getPrismaClient()
  }

  public static async connect(): Promise<void> {
    if (DatabaseManager.isConnected) {
      return
    }

    try {
      const client = await getPrismaClient()
      await client.$connect()
      DatabaseManager.isConnected = true
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Failed to connect to database:', error)
      throw error
    }
  }

  public static async disconnect(): Promise<void> {
    if (!prismaClient || !DatabaseManager.isConnected) {
      return
    }

    try {
      await prismaClient.$disconnect()
      DatabaseManager.isConnected = false
      prismaClient = null
      console.log('✅ Database disconnected successfully')
    } catch (error) {
      console.error('❌ Failed to disconnect from database:', error)
      throw error
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = await getPrismaClient()
      await client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  public static isReady(): boolean {
    return DatabaseManager.isConnected && prismaClient !== null
  }
}

// Export singleton instance getter
export const db = (): Promise<PrismaClient> => getPrismaClient()
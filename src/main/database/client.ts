// Singleton PrismaClient for DM's Codex
// Ensures single database connection across the application

import path from 'path'
import { app } from 'electron'

// Simple interface for what we need from the database client
interface DatabaseClient {
  $connect(): Promise<void>
  $disconnect(): Promise<void>
  $queryRaw(query: TemplateStringsArray): Promise<unknown>
  [key: string]: unknown // Allow for dynamic properties like 'campaign'
}

// Module-level variables for the singleton
let prismaInstance: DatabaseClient | null = null

async function createPrismaInstance(): Promise<DatabaseClient> {
  // Dynamically import and create PrismaClient
  const { PrismaClient } = await import('./generated/prisma/index.js')
  
  // Get the correct database path based on environment
  const isDev = process.env.NODE_ENV === 'development'
  
  let databasePath: string
  if (isDev) {
    // In development, use relative path from the project root
    databasePath = path.join(process.cwd(), 'data', 'database.db')
  } else {
    // In production, use userData directory
    const userDataPath = app.getPath('userData')
    databasePath = path.join(userDataPath, 'data', 'database.db')
  }

  // Ensure the path uses forward slashes for SQLite URL
  const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`

  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: isDev ? ['query', 'info', 'warn', 'error'] : ['error']
  })

  // Return as our interface type
  return client as unknown as DatabaseClient
}

export class DatabaseManager {
  private static isConnected = false

  private constructor() {}

  public static async getInstance(): Promise<DatabaseClient> {
    if (!prismaInstance) {
      prismaInstance = await createPrismaInstance()

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

    return prismaInstance
  }

  public static async connect(): Promise<void> {
    if (DatabaseManager.isConnected) {
      return
    }

    try {
      const client = await DatabaseManager.getInstance()
      await client.$connect()
      DatabaseManager.isConnected = true
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Failed to connect to database:', error)
      throw error
    }
  }

  public static async disconnect(): Promise<void> {
    if (!prismaInstance || !DatabaseManager.isConnected) {
      return
    }

    try {
      await prismaInstance.$disconnect()
      DatabaseManager.isConnected = false
      prismaInstance = null // Reset instance for clean restart
      console.log('✅ Database disconnected successfully')
    } catch (error) {
      console.error('❌ Failed to disconnect from database:', error)
      throw error
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = await DatabaseManager.getInstance()
      await client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  public static isReady(): boolean {
    return DatabaseManager.isConnected && prismaInstance !== null
  }
}

// Export singleton instance getter
export const db = (): Promise<DatabaseClient> => DatabaseManager.getInstance()

// Export utility functions
export { DatabaseManager as DatabaseClient }
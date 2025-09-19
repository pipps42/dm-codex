// Central IPC Registration System
// Manages registration and unregistration of all IPC handlers

import { registerCampaignHandlers, unregisterCampaignHandlers } from './handlers/campaignHandlers'
import { registerFileSystemHandlers, unregisterFileSystemHandlers } from './handlers/fileSystemHandlers'
import { DatabaseManager } from '../database/client'

export class IpcRegistry {
  private static isRegistered = false

  /**
   * Register all IPC handlers
   */
  static async registerAll(): Promise<void> {
    if (IpcRegistry.isRegistered) {
      console.warn('⚠️ IPC handlers already registered')
      return
    }

    try {
      console.log('🔧 Registering IPC handlers...')

      // Ensure database connection is established
      await DatabaseManager.connect()

      // Register all handler modules
      registerCampaignHandlers()
      registerFileSystemHandlers()

      // TODO: Add other handler registrations here as they are implemented
      // registerNPCHandlers()
      // registerLocationHandlers()
      // registerQuestHandlers()
      // etc.

      IpcRegistry.isRegistered = true
      console.log('✅ All IPC handlers registered successfully')
    } catch (error) {
      console.error('❌ Failed to register IPC handlers:', error)
      throw error
    }
  }

  /**
   * Unregister all IPC handlers
   */
  static async unregisterAll(): Promise<void> {
    if (!IpcRegistry.isRegistered) {
      console.warn('⚠️ IPC handlers not registered')
      return
    }

    try {
      console.log('🔧 Unregistering IPC handlers...')

      // Unregister all handler modules
      unregisterCampaignHandlers()
      unregisterFileSystemHandlers()

      // TODO: Add other handler unregistrations here as they are implemented
      // unregisterNPCHandlers()
      // unregisterLocationHandlers()
      // unregisterQuestHandlers()
      // etc.

      // Disconnect database
      await DatabaseManager.disconnect()

      IpcRegistry.isRegistered = false
      console.log('✅ All IPC handlers unregistered successfully')
    } catch (error) {
      console.error('❌ Failed to unregister IPC handlers:', error)
      throw error
    }
  }

  /**
   * Check if handlers are registered
   */
  static isReady(): boolean {
    return IpcRegistry.isRegistered && DatabaseManager.isReady()
  }

  /**
   * Perform health check on all systems
   */
  static async healthCheck(): Promise<boolean> {
    try {
      if (!IpcRegistry.isRegistered) {
        return false
      }

      const dbHealthy = await DatabaseManager.healthCheck()
      if (!dbHealthy) {
        return false
      }

      return true
    } catch (error) {
      console.error('❌ IPC Registry health check failed:', error)
      return false
    }
  }

  /**
   * Get system status
   */
  static getStatus(): {
    ipcRegistered: boolean
    databaseConnected: boolean
    ready: boolean
  } {
    return {
      ipcRegistered: IpcRegistry.isRegistered,
      databaseConnected: DatabaseManager.isReady(),
      ready: IpcRegistry.isReady()
    }
  }
}

// Convenience functions for external use
export const registerIpcHandlers = () => IpcRegistry.registerAll()
export const unregisterIpcHandlers = () => IpcRegistry.unregisterAll()
export const isIpcReady = () => IpcRegistry.isReady()
export const ipcHealthCheck = () => IpcRegistry.healthCheck()
export const getIpcStatus = () => IpcRegistry.getStatus()
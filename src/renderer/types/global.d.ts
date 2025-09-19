// Global type declarations for the renderer process

import type {
  IpcResult,
  IpcChannelInput,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignWithStats,
  FileOperationResult,
  FileInfo
} from '../../shared/types/ipc'
import type { Campaign } from '../../main/database/generated/prisma'

declare global {
  interface Window {
    // DM's Codex API - Type-safe campaign operations
    dmCodex: {
      campaign: {
        create(input: CreateCampaignInput): Promise<IpcResult<Campaign>>
        findAll(): Promise<IpcResult<CampaignWithStats[]>>
        findById(id: string): Promise<IpcResult<CampaignWithStats | null>>
        update(input: UpdateCampaignInput): Promise<IpcResult<Campaign>>
        delete(id: string): Promise<IpcResult<void>>
        updateLastPlayed(id: string): Promise<IpcResult<Campaign>>
      }

      // File system operations
      fileSystem: {
        saveFile(input: IpcChannelInput<'filesystem:saveFile'>): Promise<IpcResult<FileOperationResult>>
        saveFileFromBuffer(input: IpcChannelInput<'filesystem:saveFileFromBuffer'>): Promise<IpcResult<FileOperationResult>>
        deleteFile(input: IpcChannelInput<'filesystem:deleteFile'>): Promise<IpcResult<void>>
        listFiles(input: IpcChannelInput<'filesystem:listFiles'>): Promise<IpcResult<string[]>>
        getFileInfo(input: IpcChannelInput<'filesystem:getFileInfo'>): Promise<IpcResult<FileInfo>>
        createBackup(input: IpcChannelInput<'filesystem:createBackup'>): Promise<IpcResult<string>>
        cleanupBackups(input: IpcChannelInput<'filesystem:cleanupBackups'>): Promise<IpcResult<void>>
        getCampaignPath(input: IpcChannelInput<'filesystem:getCampaignPath'>): Promise<IpcResult<string>>
        getTypedPath(input: IpcChannelInput<'filesystem:getTypedPath'>): Promise<IpcResult<string>>
        validateFile(input: IpcChannelInput<'filesystem:validateFile'>): Promise<IpcResult<void>>
      }

      // TODO: Add other entity APIs as they are implemented
    }

    // Limited IpcRenderer for non-API communications
    ipcRenderer: {
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      off: (channel: string, listener?: (...args: any[]) => void) => void;
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

export {};
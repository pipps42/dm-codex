// Global type declarations for the renderer process

import type {
  IpcResult,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignWithStats
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
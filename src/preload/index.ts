import { ipcRenderer, contextBridge } from 'electron'
import type {
  IpcChannels,
  IpcChannelName,
  IpcChannelInput,
  IpcChannelOutput,
  IpcResult,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignWithStats
} from '../shared/types/ipc'
import type { Campaign } from '../main/database/generated/prisma'

// Type-safe IPC invoke function
async function invokeIpc<T extends IpcChannelName>(
  channel: T,
  input: IpcChannelInput<T>
): Promise<IpcResult<IpcChannelOutput<T>>> {
  return await ipcRenderer.invoke(channel, input)
}

// Campaign API - Type-safe wrapper for campaign operations
const campaignApi = {
  async create(input: CreateCampaignInput): Promise<IpcResult<Campaign>> {
    return invokeIpc('campaign:create', input)
  },

  async findAll(): Promise<IpcResult<CampaignWithStats[]>> {
    return invokeIpc('campaign:findAll', undefined)
  },

  async findById(id: string): Promise<IpcResult<CampaignWithStats | null>> {
    return invokeIpc('campaign:findById', { id })
  },

  async update(input: UpdateCampaignInput): Promise<IpcResult<Campaign>> {
    return invokeIpc('campaign:update', input)
  },

  async delete(id: string): Promise<IpcResult<void>> {
    return invokeIpc('campaign:delete', { id })
  },

  async updateLastPlayed(id: string): Promise<IpcResult<Campaign>> {
    return invokeIpc('campaign:updateLastPlayed', { id })
  }
}

// --------- Expose DM's Codex API to the Renderer process ---------
contextBridge.exposeInMainWorld('dmCodex', {
  // Campaign operations
  campaign: campaignApi,

  // TODO: Add other entity APIs as they are implemented
  // npc: npcApi,
  // location: locationApi,
  // quest: questApi,
  // etc.
})

// --------- Expose limited IpcRenderer for non-API communications ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
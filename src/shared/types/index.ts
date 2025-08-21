// Base Entity type
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign related types
export interface Campaign extends BaseEntity {
  name: string;
  description?: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
}

// IPC Channel definitions (type-safe)
export interface IpcChannels {
  'campaign:create': {
    input: CreateCampaignDto;
    output: Campaign;
  };
  'campaign:list': {
    input: void;
    output: Campaign[];
  };
}
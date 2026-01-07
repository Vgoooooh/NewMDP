
export enum IoTProjectCategory {
  SMART_BUILDING = 'SMART_BUILDING',
  SMART_FARM = 'SMART_FARM',
  FLEET_MANAGEMENT = 'FLEET_MANAGEMENT',
  ENERGY_MONITORING = 'ENERGY_MONITORING',
  INDUSTRIAL_IOT = 'INDUSTRIAL_IOT',
  SMART_HOME = 'SMART_HOME'
}

export interface ProjectStats {
  deviceCount: number;
  assetCount: number;
  memberCount: number;
}

export interface IoTProject {
  id: string;
  name: string;
  description: string;
  category: IoTProjectCategory;
  stats: ProjectStats;
  updatedAt: string;
  status: 'active' | 'archived' | 'alert';
}

export interface AssetType {
  id: string;
  name: string;
  iconName: string;
  visibility: 'global' | string; // 'global' or projectID
  usageCount: number;
  isPreset: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  enabled: boolean;
}

export interface GlobalDevice {
  id: string;
  name: string;
  sn: string;
  devEUI: string;
  status: 'online' | 'offline' | 'never_seen';
  lastSeen: string;
  productName: string;
  model: string;
  battery: number;
  rssi: string;
  sf: string;
  frameCount: number;
  firmwareVersion: string;
  projectName: string | null;
  rpsStatus: 'active' | 'inactive';
  imageUrl: string;
  shareType?: 'by_me' | 'to_me';
  validUntil?: string;
}

export type GlobalDeviceViewMode = 'main' | 'network' | 'within_project' | 'without_project' | 'shared_to_me' | 'shared_by_me';

export type ViewState = 'home' | 'devices' | 'tasks' | 'projects' | 'resources' | 'asset-types' | 'project-detail';

export type ProjectTab = 'dashboard' | 'devices' | 'assets' | 'alerts' | 'workflow' | 'users' | 'developer';

export interface GeminiSuggestionResponse {
  name: string;
  description: string;
  category: IoTProjectCategory;
  suggestedStats: ProjectStats;
}

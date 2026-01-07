
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter as FilterIcon, 
  Grid2X2, 
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  Wind,
  ChevronRight,
  ChevronDown,
  Box,
  Layers,
  Cpu,
  Clock,
  Building2,
  DoorOpen,
  Map as MapPinned,
  Plus,
  ExternalLink,
  X, 
  Check,
  MoreVertical,
  Trash2,
  Navigation,
  CheckCircle2,
  ChevronDown as ChevronDownIcon,
  PlayCircle,
  Globe,
  AlertTriangle,
  FolderKanban,
  SearchCode,
  ListTree,
  Maximize,
  Minus,
  Move,
  CloudSun,
  UploadCloud,
  FileDown
} from 'lucide-react';

declare var L: any; // Leaflet global

interface DeviceData {
  id: string;
  name: string;
  sn: string;
  status: 'online' | 'offline' | 'never_seen';
  signal: number; 
  telemetry: {
    battery: number;
    temperature: number;
    humidity: number;
    co2: number;
    pm25: number;
    pm10: number;
  };
  lastSeen: string;
  assetId: string;
  x?: number; // Floor plan X
  y?: number; // Floor plan Y
  lat?: number; // Physical Map Lat
  lng?: number; // Physical Map Lng
}

interface TreeNode {
  id: string;
  name: string;
  type: 'Root' | 'Building' | 'Gate' | 'Space' | 'Floor' | 'Project';
  children?: TreeNode[];
}

const IconRegistry: Record<string, any> = {
  Root: Layers,
  Building: Building2,
  Gate: DoorOpen,
  Space: Maximize,
  Floor: Layers,
  Project: FolderKanban
};

// Updated ASSET_TREE to match AssetModule data (Added Terminal T2)
const ASSET_TREE: TreeNode[] = [
  {
    id: 'root-1',
    name: 'Airport Traffic Monitoring',
    type: 'Root',
    children: [
      {
        id: 't1',
        name: 'Terminal T1',
        type: 'Building',
        children: [
          { id: 't1-g1', name: 'Gate 1', type: 'Gate' },
          { id: 't1-g2', name: 'Gate 2', type: 'Gate' }
        ]
      },
      {
        id: 't2',
        name: 'Terminal T2',
        type: 'Building',
        children: [
          { id: 't2-g3', name: 'Gate 3', type: 'Gate' },
          { id: 't2-g4', name: 'Gate 4', type: 'Gate' }
        ]
      }
    ]
  }
];

const ASSETS_WITH_PLANS = new Set(['t1-g1', 't1-g2']);
const DEFAULT_PLAN_IMAGE = 'https://r.jina.ai/i/464858da815c4cc38827367375ce08c9';

const createDevice = (id: string, sn: string, assetId: string, index: number): DeviceData => ({
  id,
  name: 'AM308 IAQ Sensor',
  sn,
  status: index % 3 === 0 ? 'online' : index % 3 === 1 ? 'offline' : 'never_seen',
  signal: 75 + (index % 25),
  telemetry: {
    battery: 65 + (index % 30),
    temperature: 24.5 + (index * 0.2),
    humidity: 45 + (index % 10),
    co2: 500 + (index * 50),
    pm25: 12 + (index % 15),
    pm10: 18 + (index % 20),
  },
  lastSeen: '2025-12-12 15:15:23',
  assetId,
  x: 150 + (index * 140) % 550,
  y: 100 + (index * 90) % 350,
  lat: 31.2304 + (index * 0.005),
  lng: 121.4737 + (index * 0.005)
});

// Expanded Mock Devices to cover new assets
const MOCK_DEVICES: DeviceData[] = [
  ...Array.from({ length: 4 }).map((_, i) => createDevice(`t1-g1-dev-${i}`, `1234556${801 + i}`, 't1-g1', i)),
  ...Array.from({ length: 4 }).map((_, i) => createDevice(`t1-g2-dev-${i}`, `1234556${805 + i}`, 't1-g2', i + 4)),
  ...Array.from({ length: 3 }).map((_, i) => createDevice(`t2-g3-dev-${i}`, `1234556${901 + i}`, 't2-g3', i + 8)),
  ...Array.from({ length: 3 }).map((_, i) => createDevice(`t2-g4-dev-${i}`, `1234556${905 + i}`, 't2-g4', i + 11)),
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#10b981'; // emerald-500
    case 'offline': return '#f97316'; // orange-500
    case 'never_seen': return '#94a3b8'; // slate-400
    default: return '#94a3b8';
  }
};

const getStatusBgClass = (status: string) => {
  switch (status) {
    case 'online': return 'bg-emerald-500';
    case 'offline': return 'bg-orange-500';
    case 'never_seen': return 'bg-slate-400';
    default: return 'bg-slate-400';
  }
};

const MapView: React.FC<{ devices: DeviceData[] }> = ({ devices }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([31.2304, 121.4737], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    markersRef.current.forEach(m => mapInstance.current.removeLayer(m));
    markersRef.current = [];

    // Add new markers
    devices.forEach(dev => {
      if (dev.lat && dev.lng) {
        const marker = L.marker([dev.lat, dev.lng]).addTo(mapInstance.current);
        const statusColor = getStatusColor(dev.status);
        
        marker.bindPopup(`
          <div style="min-width: 180px; font-family: sans-serif;">
            <div style="font-weight: 900; font-size: 14px; margin-bottom: 2px;">${dev.name}</div>
            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-bottom: 10px;">SN: ${dev.sn}</div>
            <div style="display: grid; grid-cols: 2; gap: 8px; font-size: 11px;">
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">Battery</span>
                <span style="font-weight: 700;">${dev.telemetry.battery}%</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">Temp</span>
                <span style="font-weight: 700;">${dev.telemetry.temperature.toFixed(1)}°C</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">Humidity</span>
                <span style="font-weight: 700;">${dev.telemetry.humidity}%</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">CO2</span>
                <span style="font-weight: 700;">${dev.telemetry.co2} ppm</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">PM2.5</span>
                <span style="font-weight: 700;">${dev.telemetry.pm25} μg</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: #94a3b8; font-weight: 900; text-transform: uppercase; font-size: 8px;">Status</span>
                <span style="font-weight: 900; color: ${statusColor}; text-transform: uppercase;">${dev.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        `);
        markersRef.current.push(marker);
      }
    });

    if (devices.length > 0 && mapInstance.current) {
      const group = L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      // Cleanup happens on unmount or if we change map rendering logic
    };
  }, [devices]);

  return <div ref={mapRef} className="h-full w-full rounded-3xl overflow-hidden shadow-inner border border-slate-200" />;
};

const DeviceCard: React.FC<{ 
  device: DeviceData; 
  isSelected: boolean; 
  onToggle: (id: string) => void;
}> = ({ device, isSelected, onToggle }) => {
  const isOnline = device.status === 'online';
  const isNeverSeen = device.status === 'never_seen';
  
  return (
    <div 
      onClick={() => onToggle(device.id)}
      className={`relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer select-none ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl' : 'border-slate-200 shadow-sm hover:border-slate-300'
      }`}
    >
      <div className={`absolute top-3 right-3 transition-all ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
        <div className="bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-md">
          <Check size={12} strokeWidth={4} />
        </div>
      </div>

      <div className={`p-4 flex items-center justify-between border-b ${isSelected ? 'bg-blue-50/40 border-blue-50' : 'border-slate-50'}`}>
        <div className="flex flex-col">
          <h4 className={`text-sm font-black transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{device.name}</h4>
          <p className="text-[10px] font-medium text-slate-400 font-mono tracking-tight">{device.sn}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tighter ${
          isOnline ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : isNeverSeen ? 'text-slate-400 border-slate-100 bg-slate-50' : 'text-orange-500 border-orange-100 bg-orange-50'
        }`}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? `${device.signal}%` : device.status.replace('_', ' ')}
        </div>
      </div>

      <div className="p-4 flex gap-5">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 group-hover:bg-white transition-colors">
          <img src="https://www.milesight-iot.com/wp-content/uploads/2021/08/AM300-Series-Ambience-Monitoring-Sensor.png" alt="Device" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
        </div>
        {/* Expanded Telemetry Grid */}
        <div className="flex-grow grid grid-cols-2 gap-2">
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Battery</span><span className="text-xs font-bold text-slate-700">{device.telemetry.battery}%</span></div>
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Temp</span><span className="text-xs font-bold text-slate-700">{device.telemetry.temperature.toFixed(1)}°C</span></div>
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Humidity</span><span className="text-xs font-bold text-slate-700">{device.telemetry.humidity}%</span></div>
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">CO2</span><span className="text-xs font-bold text-slate-700">{device.telemetry.co2} ppm</span></div>
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">PM2.5</span><span className="text-xs font-bold text-slate-700">{device.telemetry.pm25} μg</span></div>
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">PM10</span><span className="text-xs font-bold text-slate-700">{device.telemetry.pm10} μg</span></div>
        </div>
      </div>
      
      {/* Footer with More Button */}
      <div className="p-3 border-t bg-slate-50/50 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{device.lastSeen}</span>
         </div>
         <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); /* Action handler */ }}>
            <MoreVertical size={14} />
         </button>
      </div>
    </div>
  );
};

const TreeItem: React.FC<{ node: TreeNode; depth: number; selectedId: string; onSelect: (id: string) => void }> = ({ node, depth, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const NodeIcon = IconRegistry[node.type] || Box;

  return (
    <div className="mb-1">
      <div 
        onClick={() => onSelect(node.id)}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <div className="w-4">
          {hasChildren && depth > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="hover:text-current transition-colors">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
        <NodeIcon size={16} className={isSelected ? 'text-white' : 'text-blue-500'} />
        <span className="text-xs font-bold truncate">{node.name}</span>
      </div>
      {isOpen && node.children?.map(child => <TreeItem key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />)}
    </div>
  );
};

export const DeviceManager: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState('root-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'plan' | 'map'>('grid');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<Set<string>>(new Set());
  const [onlyCurrentNode, setOnlyCurrentNode] = useState(false);
  
  // Floor plan states
  const [scale, setScale] = useState(0.85);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const planContainerRef = useRef<HTMLDivElement>(null);

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isBatchMoveModalOpen, setIsBatchMoveModalOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const filteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter(device => {
      let matchesAsset = false;
      if (onlyCurrentNode) matchesAsset = device.assetId === selectedAssetId;
      else matchesAsset = selectedAssetId === 'root-1' || device.assetId === selectedAssetId || (selectedAssetId === 't1' && device.assetId.startsWith('t1-')) || (selectedAssetId === 't2' && device.assetId.startsWith('t2-'));
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) || device.sn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAsset && matchesSearch;
    });
  }, [selectedAssetId, searchQuery, onlyCurrentNode]);

  const hasPlan = ASSETS_WITH_PLANS.has(selectedAssetId);
  const stats = useMemo(() => ({
    online: filteredDevices.filter(d => d.status === 'online').length,
    offline: filteredDevices.filter(d => d.status === 'offline').length,
    neverSeen: filteredDevices.filter(d => d.status === 'never_seen').length,
    selected: selectedDeviceIds.size,
  }), [filteredDevices, selectedDeviceIds]);

  const toggleDeviceSelection = (id: string) => {
    const next = new Set(selectedDeviceIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedDeviceIds(next);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'plan') return;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * factor, 0.2), 5));
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'plan' || e.button !== 0) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    planContainerRef.current?.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    planContainerRef.current?.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) setIsActionMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-full bg-slate-50/30 gap-6 animate-in fade-in duration-500 overflow-hidden relative">
      <aside className="w-72 bg-white rounded-2xl border border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hierarchy</h3>
          <FilterIcon size={14} className="text-slate-300 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>
        <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/30">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight group-hover:text-slate-800">Only Current Node</span>
            <div onClick={() => setOnlyCurrentNode(!onlyCurrentNode)} className={`relative w-8 h-4 rounded-full transition-all duration-300 ${onlyCurrentNode ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${onlyCurrentNode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {ASSET_TREE.map(node => <TreeItem key={node.id} node={node} depth={0} selectedId={selectedAssetId} onSelect={setSelectedAssetId} />)}
        </div>
      </aside>

      <div className="flex-grow flex flex-col gap-6 overflow-hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-emerald-500"><div className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Online</span></div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">{stats.online}</span>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-orange-500"><div className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Offline</span></div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">{stats.offline}</span>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-300"><div className="w-2 h-2 rounded-full bg-current"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Never Seen</span></div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">{stats.neverSeen}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative" ref={actionMenuRef}>
              <div className="flex items-center gap-3">
                {stats.selected > 0 && <div className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 shadow-sm flex items-center gap-1.5 animate-in slide-in-from-right-2"><CheckCircle2 size={12} /> {stats.selected} Selected</div>}
                <button onClick={() => setIsActionMenuOpen(!isActionMenuOpen)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg flex items-center gap-2 active:scale-95 transition-all">Action <ChevronDownIcon size={16} /></button>
              </div>
              {isActionMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] overflow-hidden py-2 animate-in fade-in">
                  {/* Category 1: Add Devices */}
                  <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">Add Devices</div>
                  <button 
                    onClick={() => { alert('Add Device Clicked'); setIsActionMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={16} className="text-blue-500" /> Add Device
                  </button>
                  <button 
                    onClick={() => { alert('Add Devices in Bulk Clicked'); setIsActionMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-blue-50 transition-colors"
                  >
                    <UploadCloud size={16} className="text-blue-500" /> Add Devices in Bulk
                  </button>

                  <div className="h-px bg-slate-100 my-1 mx-2" />

                  {/* Category 2: Devices Management */}
                  <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">Devices Management</div>
                  <button 
                    onClick={() => { setIsBatchMoveModalOpen(true); setIsActionMenuOpen(false); }} 
                    disabled={stats.selected === 0} 
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all ${
                      stats.selected === 0 
                        ? 'text-slate-300 cursor-not-allowed opacity-50' 
                        : 'text-slate-700 hover:bg-blue-50 cursor-pointer'
                    }`}
                  >
                    <Navigation size={16} className={stats.selected > 0 ? 'text-blue-500' : ''} /> Move Selected
                  </button>
                  <button 
                    onClick={() => { alert(`Deleting ${stats.selected} devices...`); setIsActionMenuOpen(false); }}
                    disabled={stats.selected === 0} 
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all ${
                      stats.selected === 0 
                        ? 'text-slate-300 cursor-not-allowed opacity-50' 
                        : 'text-red-500 hover:bg-red-50 cursor-pointer'
                    }`}
                  >
                    <Trash2 size={16} className={stats.selected > 0 ? 'text-red-500' : ''} /> Delete Devices
                  </button>
                </div>
              )}
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`} title="Grid"><Grid2X2 size={16} /></button>
              <button onClick={() => hasPlan && setViewMode('plan')} disabled={!hasPlan} className={`p-2 rounded-lg transition-all ${viewMode === 'plan' ? 'bg-white text-blue-600 shadow-sm' : hasPlan ? 'text-slate-400' : 'text-slate-200 cursor-not-allowed'}`} title="Plan"><MapPinned size={16} /></button>
              <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`} title="Map"><Globe size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-hidden relative">
          {filteredDevices.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="h-full overflow-y-auto custom-scrollbar pb-6 px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredDevices.map(device => <DeviceCard key={device.id} device={device} isSelected={selectedDeviceIds.has(device.id)} onToggle={toggleDeviceSelection} />)}
                </div>
              </div>
            ) : viewMode === 'plan' ? (
              <div ref={planContainerRef} className={`h-full bg-slate-100 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative flex items-center justify-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
                 <div className="relative transition-transform duration-75 ease-out" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
                    <div className="relative bg-white p-6 shadow-2xl rounded-2xl border border-slate-200">
                      <img src={DEFAULT_PLAN_IMAGE} alt="Plan" className="max-w-none block pointer-events-none" style={{ width: '800px' }} />
                      {filteredDevices.map(dev => {
                        // Plan View Tooltip logic
                        const statusBg = getStatusBgClass(dev.status);
                        const isOnline = dev.status === 'online';

                        return (
                          <div 
                            key={dev.id} 
                            className={`absolute w-8 h-8 -ml-4 -mt-4 bg-white border-2 rounded-full shadow-lg flex items-center justify-center transition-all group z-10 ${isOnline ? 'border-emerald-500 text-emerald-500' : 'border-slate-300 text-slate-300'}`} 
                            style={{ left: dev.x, top: dev.y }}
                          >
                            <Cpu size={14} strokeWidth={2.5} />
                            {/* Unified Tooltip content and colors */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all pointer-events-none bg-slate-900 text-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-[100]">
                               <div className="flex items-center justify-between mb-2">
                                  <p className="text-[11px] font-black uppercase truncate">{dev.name}</p>
                                  <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${statusBg}`}>{dev.status.replace('_', ' ')}</div>
                               </div>
                               <p className="text-[9px] font-bold text-slate-400 font-mono mb-3">SN: {dev.sn}</p>
                               
                               <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Battery</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.battery}%</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Temp</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.temperature.toFixed(1)}°C</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Humidity</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.humidity}%</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">CO2</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.co2} ppm</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">PM2.5</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.pm25} μg</span>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">PM10</span>
                                     <span className="text-[10px] font-black">{dev.telemetry.pm10} μg</span>
                                  </div>
                               </div>
                               {isOnline && (
                                  <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-emerald-400">
                                     <Wifi size={10} /> Signal: {dev.signal}%
                                  </div>
                               )}
                               <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                 </div>
                 <div className="absolute top-6 right-6 flex flex-col gap-2 z-50">
                    <button onClick={() => setScale(s => Math.min(s + 0.1, 5))} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-xl transition-all"><Plus size={18} strokeWidth={3} /></button>
                    <button onClick={() => setScale(s => Math.max(s - 0.1, 0.2))} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-xl transition-all"><Minus size={18} strokeWidth={3} /></button>
                    <button onClick={() => { setScale(0.85); setOffset({ x: 0, y: 0 }); }} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-xl transition-all"><Maximize size={18} strokeWidth={3} /></button>
                 </div>
              </div>
            ) : (
              <MapView devices={filteredDevices} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 h-full"><Cpu size={32} className="text-slate-200 mb-4" /><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No hardware found</h3></div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Settings2, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  Settings, 
  Trash2, 
  Plus, 
  UploadCloud, 
  X, 
  Wifi, 
  WifiOff, 
  Battery as BatteryIcon, 
  ArrowRight, 
  Clock,
  FileBarChart,
  Edit,
  Share2,
  UserCheck,
  FileDown,
  Globe,
  RefreshCw,
  CalendarClock,
  Activity,
  Signal,
  BarChart3,
  Hash,
  Cpu,
  Zap,
  HardDrive,
  FolderTree,
  Building2,
  Layers,
  Box
} from 'lucide-react';
import { GlobalDevice, GlobalDeviceViewMode } from '../types';
import { DeviceGroupManager } from './DeviceGroupManager';

const MOCK_GLOBAL_DEVICES: GlobalDevice[] = Array.from({ length: 50 }).map((_, i) => {
  // Logic to simulate devices being in EITHER a project OR a device group
  const isInProject = i % 3 !== 0; // 2/3rds in project
  const projectName = isInProject 
    ? (i % 5 === 0 ? 'Grand Horizon Smart Mall Global Headquarters' : ['CBD Smart Bldg', 'Grand Mall', 'GreenFarm'][i % 3]) 
    : null;
  
  const deviceGroupName = !isInProject 
    ? (i % 2 === 0 ? 'Default Group' : 'Warehouse Staging') 
    : null;

  return {
    id: `dev-${i + 1000}`,
    name: i % 2 === 0 ? 'AM308 IAQ Sensor' : 'EM300 Environment Sensor',
    sn: `SN2510${100 + i}X`,
    devEUI: `24E124C000${200 + i}E`,
    status: i % 5 === 0 ? 'offline' : i % 8 === 0 ? 'never_seen' : 'online',
    lastSeen: '2025-12-30 14:30:05',
    productName: i % 2 === 0 ? '9 in 1 IAQ Sensor' : 'Temp/Humid Sensor',
    model: i % 2 === 0 ? 'AM308' : 'EM300-TH',
    battery: i % 10 === 0 ? 15 : i % 5 === 0 ? 45 : 85,
    rssi: `-${60 + (i % 40)} dBm`,
    sf: `SF${7 + (i % 6)}`,
    frameCount: 1200 + (i * 10),
    firmwareVersion: `V1.${i % 3}.2`,
    projectName: projectName,
    deviceGroupName: deviceGroupName,
    rpsStatus: i % 4 === 0 ? 'inactive' : 'active',
    imageUrl: 'https://www.milesight-iot.com/wp-content/uploads/2021/08/AM300-Series-Ambience-Monitoring-Sensor.png',
    shareType: i % 7 === 0 ? 'by_me' : (i % 11 === 0 ? 'to_me' : undefined),
    validUntil: i % 7 === 0 || i % 11 === 0 ? '2026-05-20 23:59:59' : undefined
  };
});

export const GlobalDeviceManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<GlobalDeviceViewMode>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeActionMenu, setActiveActionMenu] = useState(false);
  
  const [activeMoreMenu, setActiveMoreMenu] = useState<{ id: string, x: number, y: number, shareType?: string } | null>(null);
  
  const [selectedDevice, setSelectedDevice] = useState<GlobalDevice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [showGroupManager, setShowGroupManager] = useState(false);

  const actionRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) setActiveActionMenu(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setActiveMoreMenu(null);
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', () => setActiveMoreMenu(null), true);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', () => setActiveMoreMenu(null), true);
    };
  }, []);

  const filteredDevices = useMemo(() => {
    return MOCK_GLOBAL_DEVICES.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.sn.toLowerCase().includes(searchQuery.toLowerCase());
      if (viewMode === 'shared_to_me') return matchesSearch && d.shareType === 'to_me';
      if (viewMode === 'shared_by_me') return matchesSearch && d.shareType === 'by_me';
      if (viewMode === 'within_project') return matchesSearch && d.projectName !== null;
      if (viewMode === 'without_project') return matchesSearch && d.projectName === null;
      return matchesSearch;
    });
  }, [searchQuery, viewMode]);

  const stats = useMemo(() => ({
    online: MOCK_GLOBAL_DEVICES.filter(d => d.status === 'online').length,
    offline: MOCK_GLOBAL_DEVICES.filter(d => d.status === 'offline').length,
    neverSeen: MOCK_GLOBAL_DEVICES.filter(d => d.status === 'never_seen').length
  }), []);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDevices.length && filteredDevices.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredDevices.map(d => d.id)));
  };

  const handleRowClick = (device: GlobalDevice) => {
    setSelectedDevice(device);
    setIsDrawerOpen(true);
  };

  const hasSelection = selectedIds.size > 0;

  const getBatteryColor = (level: number) => {
    if (level < 30) return 'bg-red-500';
    if (level < 50) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'never_seen': return 'Never Seen';
      default: return status;
    }
  };

  const handleMoreClick = (e: React.MouseEvent, device: GlobalDevice) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMoreMenu({
      id: device.id,
      x: rect.right - 180,
      y: rect.bottom + 8,
      shareType: device.shareType
    });
  };

  const isSharedView = viewMode === 'shared_to_me' || viewMode === 'shared_by_me';
  const isNetworkView = viewMode === 'network';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      <style>{`
        .tooltip-box { visibility: hidden; opacity: 0; transition: all 0.2s; position: absolute; bottom: 100%; left: 50%; transform: translate(-50%, -4px) scale(0.95); pointer-events: none; }
        .tooltip-container:hover .tooltip-box { visibility: visible; opacity: 1; transform: translate(-50%, -8px) scale(1); }
      `}</style>

      {/* Device Group Manager Modal */}
      {showGroupManager && (
        <DeviceGroupManager onClose={() => setShowGroupManager(false)} />
      )}

      {/* Top Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global Devices</h2>
          <p className="text-slate-500 font-medium mt-1 text-sm">Real-time monitoring for all connected hardware.</p>
        </div>
        <div className="flex items-center gap-6 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online</span>
            <span className="text-xl font-black text-slate-800">{stats.online}</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Offline</span>
            <span className="text-xl font-black text-slate-800">{stats.offline}</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Never Seen</span>
            <span className="text-xl font-black text-slate-800">{stats.neverSeen}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6 relative z-[200]">
        <div className="flex items-center gap-3">
          <div className="relative" ref={actionRef}>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveActionMenu(!activeActionMenu)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
              >
                Action <ChevronDown size={14} className={`transition-transform ${activeActionMenu ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={() => setShowGroupManager(true)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <FolderTree size={16} /> Manage Device Groups
              </button>
            </div>
            
            {activeActionMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[300] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 space-y-4">
                  <div>
                    <h5 className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Device</h5>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Plus size={16} /> Single Add</button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><UploadCloud size={16} /> Bulk Add</button>
                    </div>
                  </div>
                  <div>
                    <h5 className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Device Management</h5>
                    <div className="space-y-1">
                      <button disabled={!hasSelection} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all rounded-xl ${hasSelection ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-300 opacity-50 cursor-not-allowed'}`}><Settings size={16} /> Configure</button>
                      <button disabled={!hasSelection} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all rounded-xl ${hasSelection ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-300 opacity-50 cursor-not-allowed'}`}><RefreshCw size={16} /> Firmware Update</button>
                      <button disabled={!hasSelection} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all rounded-xl ${hasSelection ? 'text-red-500 hover:bg-red-50' : 'text-slate-300 opacity-50 cursor-not-allowed'}`}><Trash2 size={16} /> Delete Device</button>
                    </div>
                  </div>
                  <div>
                    <h5 className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Other</h5>
                    <div className="space-y-1">
                      <button disabled={!hasSelection} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all rounded-xl ${hasSelection ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-300 opacity-50 cursor-not-allowed'}`}><FileDown size={16} /> Export Device</button>
                      <button disabled={!hasSelection} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all rounded-xl ${hasSelection ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-300 opacity-50 cursor-not-allowed'}`}><Share2 size={16} /> Share Device</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner overflow-x-auto scrollbar-hide">
            {(['main', 'network', 'within_project', 'without_project', 'shared_to_me', 'shared_by_me'] as GlobalDeviceViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode === 'shared_to_me' ? 'Shared to me' : mode === 'shared_by_me' ? 'Shared by me' : mode.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-grow max-w-xl">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search SN, Name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded-xl shadow-sm text-xs font-bold shrink-0">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="flex-grow bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-grow overflow-auto scrollbar-hide">
          <table className="w-full text-left table-fixed min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[50]">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                <th className="px-2 py-3 w-10 text-center">
                  <input type="checkbox" checked={selectedIds.size === filteredDevices.length && filteredDevices.length > 0} onChange={toggleSelectAll} className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                </th>
                
                {isNetworkView ? (
                  <>
                    <th className="px-3 py-3 w-[20%]">Name</th>
                    <th className="px-3 py-3 w-[20%]">Identifier (SN/DevEUI)</th>
                    <th className="px-3 py-3 w-[15%] text-center">Status</th>
                    <th className="px-3 py-3 w-[10%] text-center">RSSI</th>
                    <th className="px-3 py-3 w-[10%] text-center">SF</th>
                    <th className="px-3 py-3 w-[15%] text-center">Frame Count</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3 w-[15%]">Name</th>
                    <th className="px-3 py-3 w-[15%]">SN / DevEUI</th>
                    <th className="px-3 py-3 w-[18%]">Status / Report Time</th>
                    <th className="px-3 py-3 w-[15%]">Product Info</th>
                    <th className="px-3 py-3 w-16 text-center">Battery</th>
                    {!isSharedView ? (
                      <th className="px-3 py-3 w-[12%]">Project / Device Group</th>
                    ) : (
                      <th className="px-3 py-3 w-[15%]">Valid Until</th>
                    )}
                  </>
                )}
                
                <th className="px-3 py-3 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDevices.map(d => (
                <tr 
                  key={d.id} 
                  onClick={() => handleRowClick(d)}
                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${selectedIds.has(d.id) ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-2 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(d.id)} 
                      onChange={() => {
                        const next = new Set(selectedIds);
                        if (next.has(d.id)) next.delete(d.id); else next.add(d.id);
                        setSelectedIds(next);
                      }} 
                      className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer" 
                    />
                  </td>
                  
                  {isNetworkView ? (
                    <>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-black text-slate-800 truncate block">{d.name}</span>
                          {d.shareType && (
                            <div className="relative tooltip-container shrink-0">
                              {d.shareType === 'by_me' ? (
                                <Share2 size={13} className="text-blue-500 hover:scale-110 transition-transform" />
                              ) : (
                                <UserCheck size={13} className="text-purple-500 hover:scale-110 transition-transform" />
                              )}
                              <div className="tooltip-box z-[1000] px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow-2xl whitespace-nowrap">
                                {d.shareType === 'by_me' ? 'Shared by me' : 'Shared to me'}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-bold text-slate-700 tracking-tight truncate">{d.sn}</span>
                          <span className="text-[8px] font-mono text-slate-400 font-medium uppercase truncate">{d.devEUI}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${d.status === 'online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : d.status === 'offline' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                           {d.status === 'online' ? <Wifi size={10} /> : <WifiOff size={10} />}
                           <span>{getStatusLabel(d.status)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-black text-slate-600">
                          <Signal size={12} className="text-slate-300" />
                          <span>{d.rssi}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded border border-blue-100">{d.sf}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-black text-slate-600">
                          <Activity size={12} className="text-slate-300" />
                          <span>{d.frameCount.toLocaleString()}</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-black text-slate-800 truncate block">{d.name}</span>
                          {d.shareType && (
                            <div className="relative tooltip-container shrink-0">
                              {d.shareType === 'by_me' ? (
                                <Share2 size={13} className="text-blue-500 hover:scale-110 transition-transform" />
                              ) : (
                                <UserCheck size={13} className="text-purple-500 hover:scale-110 transition-transform" />
                              )}
                              <div className="tooltip-box z-[1000] px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow-2xl whitespace-nowrap">
                                {d.shareType === 'by_me' ? 'Shared by me' : 'Shared to me'}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-bold text-slate-700 tracking-tight truncate">{d.sn}</span>
                          <span className="text-[8px] font-mono text-slate-400 font-medium uppercase truncate">{d.devEUI}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-0.5">
                          <div className={`flex items-center gap-1.5 text-[10px] font-black ${d.status === 'online' ? 'text-emerald-500' : d.status === 'offline' ? 'text-orange-500' : 'text-slate-400'}`}>
                            {d.status === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                            <span>{getStatusLabel(d.status)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={10} className="shrink-0" />
                            <span className="text-[10px] font-bold font-mono whitespace-nowrap">{d.lastSeen}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className="text-[10px] font-black text-slate-700 truncate block leading-tight">{d.productName}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate block">{d.model}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-slate-700">{d.battery}%</span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${getBatteryColor(d.battery)}`} 
                              style={{ width: `${d.battery}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      {!isSharedView ? (
                        <td className="px-3 py-3">
                          {d.projectName ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md w-fit max-w-full tooltip-container relative cursor-help">
                              <Building2 size={10} className="shrink-0" />
                              <span className="text-[8px] font-black uppercase truncate max-w-[120px]">{d.projectName}</span>
                              <div className="tooltip-box z-[1000] px-3 py-2 bg-slate-900 text-white rounded-lg shadow-2xl whitespace-nowrap">
                                <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Project</div>
                                <div className="text-xs font-bold">{d.projectName}</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          ) : d.deviceGroupName ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md w-fit max-w-full tooltip-container relative cursor-help">
                              <Layers size={10} className="shrink-0" />
                              <span className="text-[8px] font-black uppercase truncate max-w-[120px]">{d.deviceGroupName}</span>
                              <div className="tooltip-box z-[1000] px-3 py-2 bg-slate-900 text-white rounded-lg shadow-2xl whitespace-nowrap">
                                <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Device Group</div>
                                <div className="text-xs font-bold">{d.deviceGroupName}</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[8px] font-bold text-slate-300 italic uppercase">Unassigned</span>
                          )}
                        </td>
                      ) : (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5 text-slate-500 tooltip-container relative cursor-help">
                            <CalendarClock size={12} className="shrink-0 text-slate-300" />
                            <span className="text-[10px] font-bold font-mono whitespace-nowrap">{d.validUntil || '-'}</span>
                            <div className="tooltip-box z-[1000] px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow-2xl whitespace-nowrap">
                              At this time, the share will expire.
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        </td>
                      )}
                    </>
                  )}
                  
                  <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        title="View Details" 
                        onClick={() => alert(`Navigating to full details for ${d.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                      >
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                      <button title="Config" className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all active:scale-90"><Settings size={15} strokeWidth={2.5} /></button>
                      <button 
                        onClick={(e) => handleMoreClick(e, d)}
                        className={`p-1.5 rounded-md transition-all ${activeMoreMenu?.id === d.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total: {filteredDevices.length}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-200'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating More Menu */}
      {activeMoreMenu && (
        <div 
          ref={moreMenuRef}
          style={{ position: 'fixed', left: activeMoreMenu.x, top: activeMoreMenu.y }}
          className="w-52 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-[1000] overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150 border-slate-200"
        >
          <div className="px-3 py-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Operations</div>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Globe size={15} className="text-slate-400" /> Access Web
          </button>
          <button 
            disabled={!!activeMoreMenu.shareType}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold transition-colors ${activeMoreMenu.shareType ? 'text-slate-200 cursor-not-allowed opacity-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Share2 size={15} className={activeMoreMenu.shareType ? 'text-slate-200' : 'text-slate-400'} /> Share Device
          </button>
          {viewMode === 'shared_by_me' && (
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
              <CalendarClock size={15} /> Extend Sharing
            </button>
          )}
          <div className="h-px bg-slate-100 my-1.5 mx-3"></div>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={15} /> Delete Device
          </button>
        </div>
      )}

      {/* Side Drawer - Quick View */}
      <div className={`fixed inset-0 z-[500] flex justify-end transition-all duration-500 ${isDrawerOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsDrawerOpen(false)}></div>
          <div className={`w-[450px] bg-white h-full relative z-10 shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedDevice && (
              <>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Quick View</h3>
                    {selectedDevice.shareType && (
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${selectedDevice.shareType === 'by_me' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {selectedDevice.shareType === 'by_me' ? 'Shared by me' : 'Shared to me'}
                       </span>
                    )}
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20} /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                  {/* Header Image & Status */}
                  <div className="flex flex-col items-center mb-8">
                      <div className="w-44 h-44 bg-slate-50 rounded-3xl border border-slate-100 p-4 flex items-center justify-center mb-6 shadow-inner">
                        <img src={selectedDevice.imageUrl} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <h4 className="text-xl font-black text-slate-800 text-center leading-tight">{selectedDevice.name}</h4>
                      <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{selectedDevice.model}</span>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${selectedDevice.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                            <div className={`w-1 h-1 rounded-full ${selectedDevice.status === 'online' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                            {getStatusLabel(selectedDevice.status)}
                        </div>
                        {/* RPS Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${selectedDevice.rpsStatus === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Zap size={10} strokeWidth={3} />
                            RPS: {selectedDevice.rpsStatus}
                        </div>
                      </div>
                  </div>

                  {/* Information Grid */}
                  <div className="space-y-6">
                    {/* Identification Group */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Hash size={10} /> SN</span>
                        <span className="text-xs font-bold text-slate-700">{selectedDevice.sn}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Cpu size={10} /> DevEUI</span>
                        <span className="text-xs font-bold text-slate-700 font-mono tracking-tighter">{selectedDevice.devEUI}</span>
                      </div>
                    </div>

                    {/* Connectivity Group */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Signal size={10} /> RSSI</span>
                        <span className="text-xs font-bold text-slate-700">{selectedDevice.rssi}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><BarChart3 size={10} /> SF</span>
                        <span className="text-xs font-bold text-slate-700">{selectedDevice.sf}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Activity size={10} /> Frame</span>
                        <span className="text-xs font-bold text-slate-700">{selectedDevice.frameCount}</span>
                      </div>
                    </div>

                    {/* System Group */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><BatteryIcon size={10} /> Battery</span>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${getBatteryColor(selectedDevice.battery)}`} style={{ width: `${selectedDevice.battery}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{selectedDevice.battery}%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><HardDrive size={10} /> Firmware</span>
                        <span className="text-xs font-bold text-slate-700">{selectedDevice.firmwareVersion}</span>
                      </div>
                    </div>

                    {/* Context Group */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Globe size={10} /> {selectedDevice.shareType ? 'Expiration' : 'Context'}</span>
                        <span className="text-xs font-bold text-slate-700 truncate block">
                          {selectedDevice.shareType ? selectedDevice.validUntil : (selectedDevice.projectName || selectedDevice.deviceGroupName || 'Unassigned')}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/30">
                  <button 
                    onClick={() => alert(`Navigating to full profile for ${selectedDevice.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all group active:scale-[0.98]"
                  >
                      Full Device Profile <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
      </div>
    </div>
  );
};

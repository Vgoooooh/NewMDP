
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Upload, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  Layers, 
  Save, 
  ChevronLeft,
  X, 
  Radio, 
  Wifi, 
  Thermometer, 
  Zap, 
  Grid3X3, 
  MousePointer2, 
  Edit3, 
  Box, 
  Image as ImageIcon, 
  Trash2
} from 'lucide-react';

interface FloorPlanEditorProps {
  asset: {
    id: string;
    name: string;
    type: string;
    parentName?: string;
  };
  onBack: () => void;
  onEditChange?: (isEditing: boolean) => void;
  externalEditingState?: boolean;
}

interface PlacedDevice {
  id: string; // Internal unique ID for the marker
  deviceId: string; // The original ID from the asset tree
  name: string;
  x: number;
  y: number;
  type: string;
  icon: any;
}

interface SidebarAssetNode {
  id: string;
  name: string;
  type: string;
  devices: { id: string; name: string; sn: string; icon: any }[];
  children?: SidebarAssetNode[];
}

const DEFAULT_PLAN_IMAGE = 'https://r.jina.ai/i/464858da815c4cc38827367375ce08c9';

const FULL_PROJECT_TREE: SidebarAssetNode[] = [
  {
    id: 't1',
    name: 'Terminal T1',
    type: 'Building',
    devices: [],
    children: [
      {
        id: 't1-g1',
        name: 'Gate 1',
        type: 'Gate',
        devices: Array.from({ length: 4 }).map((_, i) => ({
          id: `dev-g1-${i}`,
          name: `AM308 - G1-${i + 1}`,
          sn: `SN: 2510G1${i}X`,
          icon: Cpu
        }))
      },
      {
        id: 't1-g2',
        name: 'Gate 2',
        type: 'Gate',
        devices: Array.from({ length: 4 }).map((_, i) => ({
          id: `dev-g2-${i}`,
          name: `AM308 - G2-${i + 1}`,
          sn: `SN: 2510G2${i}X`,
          icon: Cpu
        }))
      }
    ]
  },
  {
    id: 't2',
    name: 'Terminal T2',
    type: 'Building',
    devices: [],
    children: [
      {
        id: 't2-g3',
        name: 'Gate 3',
        type: 'Gate',
        devices: []
      },
      {
        id: 't2-g4',
        name: 'Gate 4',
        type: 'Gate',
        devices: []
      }
    ]
  }
];

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({ asset, onBack, onEditChange, externalEditingState }) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, id: string } | null>(null);
  
  const isEditing = externalEditingState !== undefined ? externalEditingState : internalIsEditing;

  const setIsEditing = (val: boolean) => {
    setInternalIsEditing(val);
    if (onEditChange) onEditChange(val);
    if (!val) setContextMenu(null); // Close context menu when exiting edit mode
  };

  const [planImage, setPlanImage] = useState<string | null>(() => {
    if (asset.name === 'Gate 3' || asset.name === 'Gate 4') {
      return null;
    }
    return DEFAULT_PLAN_IMAGE;
  });

  const [scale, setScale] = useState(0.85);
  // Initial devices now include a deviceId reference to match the mock sidebar data
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([
    { id: 'p1', deviceId: 'dev-g1-0', name: 'AM308 - G1-1', x: 450, y: 320, type: 'Sensor', icon: Cpu },
    { id: 'p2', deviceId: 'dev-g1-1', name: 'AM308 - G1-2', x: 720, y: 180, type: 'Sensor', icon: Cpu }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const planContainerRef = useRef<HTMLDivElement>(null);

  // Close context menu on click elsewhere
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const findSubtree = (nodes: SidebarAssetNode[], targetName: string): SidebarAssetNode | null => {
    for (const node of nodes) {
      if (node.name === targetName) return node;
      if (node.children) {
        const found = findSubtree(node.children, targetName);
        if (found) return found;
      }
    }
    return null;
  };

  const sidebarTree = useMemo(() => {
    const subtree = findSubtree(FULL_PROJECT_TREE, asset.name);
    return subtree ? [subtree] : [];
  }, [asset.name]);

  // Map of placed device IDs for quick lookup in sidebar
  const placedDeviceIds = useMemo(() => new Set(placedDevices.map(pd => pd.deviceId)), [placedDevices]);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => direction === 'in' ? Math.min(prev + 0.1, 3) : Math.max(prev - 0.1, 0.3));
  };

  const handleDragStart = (e: React.DragEvent, device: any) => {
    if (!isEditing || placedDeviceIds.has(device.id)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('device', JSON.stringify({ id: device.id, name: device.name, type: 'Sensor', icon: 'Cpu' }));
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditing || !planContainerRef.current) return;
    e.preventDefault();
    const rect = planContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    try {
      const deviceData = JSON.parse(e.dataTransfer.getData('device'));
      // Ensure we don't drop the same device twice (just in case)
      if (placedDeviceIds.has(deviceData.id)) return;

      setPlacedDevices(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        deviceId: deviceData.id,
        name: deviceData.name, 
        type: deviceData.type, 
        icon: Cpu, 
        x, 
        y 
      }]);
    } catch (err) {}
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

  const deletePlacedDevice = (id: string) => {
    setPlacedDevices(prev => prev.filter(d => d.id !== id));
    setContextMenu(null);
  };

  const SidebarNode = ({ node, depth = 0 }: { node: SidebarAssetNode; depth?: number; key?: React.Key }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = (node.children && node.children.length > 0) || node.devices.length > 0;

    return (
      <div className="space-y-2">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-between group cursor-pointer py-1 ${depth === 0 ? 'text-slate-800' : 'text-slate-600'}`}
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            {depth === 0 && <div className="w-1 h-4 bg-blue-500 rounded-full"></div>}
            {node.name}
          </div>
          {hasChildren && (isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />)}
        </div>

        {isExpanded && (
          <div className={`space-y-3 ${depth === 0 ? 'ml-3 pl-4 border-l-2 border-slate-50' : 'ml-4'}`}>
            {node.devices.length > 0 && (
              <div className="p-3 border border-blue-100 bg-blue-50/20 rounded-2xl space-y-2.5">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-tighter mb-1">Direct Devices ({node.devices.length})</div>
                {node.devices.map(dev => {
                  const isPlaced = placedDeviceIds.has(dev.id);
                  return (
                    <div 
                      key={dev.id}
                      draggable={!isPlaced} 
                      onDragStart={(e) => handleDragStart(e, dev)}
                      title={isPlaced ? "Already deployed" : "Drag to deploy"}
                      className={`text-[10px] font-bold transition-colors flex items-center gap-3 group/item ${
                        isPlaced 
                          ? 'text-slate-300 cursor-not-allowed opacity-60' 
                          : 'text-slate-500 hover:text-blue-600 cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm transition-colors border border-slate-50 ${
                        isPlaced ? 'text-slate-200' : 'text-slate-300 group-hover/item:text-blue-500'
                      }`}>
                        <dev.icon size={12} />
                      </div>
                      {dev.name}
                      {isPlaced && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-200" />}
                    </div>
                  );
                })}
              </div>
            )}
            {node.children?.map(child => (
              <SidebarNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white animate-in fade-in duration-300 overflow-hidden">
      <div className="flex-grow flex flex-col relative bg-[#f1f7ff] overflow-hidden">
        
        {/* Top Floating Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-40">
          {!isEditing && planImage && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all"
            >
              <Edit3 size={16} /> Edit Layout
            </button>
          )}
          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)} 
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <Save size={16} /> Save Layout
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-grow relative overflow-auto scrollbar-hide flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={(e) => isEditing && e.preventDefault()}
          style={{ backgroundImage: `linear-gradient(#e0ebff 1px, transparent 1px), linear-gradient(90deg, #e0ebff 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        >
          {planImage ? (
            <div ref={planContainerRef} className="relative transition-transform duration-300 ease-out bg-white p-8 rounded shadow-2xl my-20 mx-20" style={{ transform: `scale(${scale})` }}>
              <img src={planImage} alt="Floor Plan" className="max-w-none block pointer-events-none select-none" style={{ minWidth: '800px' }} />
              {placedDevices.map(device => (
                <div 
                  key={device.id} 
                  onContextMenu={(e) => handleContextMenu(e, device.id)}
                  className={`absolute w-10 h-10 -ml-5 -mt-5 bg-white border-2 border-blue-500 rounded-full shadow-xl flex items-center justify-center transition-transform group z-10 ${isEditing ? 'cursor-move hover:scale-125' : 'cursor-default'}`} 
                  style={{ left: device.x, top: device.y }}
                >
                  <div className="text-blue-500"><device.icon size={18} strokeWidth={2.5} /></div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                    {device.name}
                    {isEditing && <span className="ml-2 text-slate-400 font-medium">(Right-click to delete)</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 p-12 text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 border-dashed">
                <ImageIcon size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800">No Floor Plan Uploaded</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs font-medium">
                This asset has no floor plan. Please upload an image or enter edit mode to manage layout.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all scale-100 hover:scale-105 active:scale-95"
              >
                <Upload size={20} />
                Upload Floor Plan
              </button>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3 z-30">
          <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-xl"><Grid3X3 size={20} /></button>
          
          {(planImage || isEditing) && (
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs shadow-xl uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <Upload size={18} /> {planImage ? 'Replace Image' : 'Upload Image'}
            </button>
          )}
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { setPlanImage(URL.createObjectURL(f)); setIsEditing(true); } }} />
        </div>

        {planImage && (
          <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
            <button onClick={() => handleZoom('in')} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 shadow-xl"><Plus size={22} strokeWidth={3} /></button>
            <button onClick={() => handleZoom('out')} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 shadow-xl"><Minus size={22} strokeWidth={3} /></button>
          </div>
        )}

        {/* Custom Context Menu */}
        {contextMenu && (
          <div 
            className="fixed z-[100] bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => deletePlacedDevice(contextMenu.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-tight"
            >
              <Trash2 size={16} strokeWidth={2.5} />
              Delete Marker
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Right Sidebar */}
      {isEditing && (
        <div className="w-80 border-l border-slate-100 bg-white flex flex-col shrink-0 z-40 animate-in slide-in-from-right-full duration-300">
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Pending Devices</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={14} /></button>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search within asset..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <div className="space-y-4">
               {sidebarTree.length > 0 ? (
                 sidebarTree.map(node => <SidebarNode key={node.id} node={node} />)
               ) : (
                 <div className="py-10 text-center flex flex-col items-center gap-3">
                    <Box size={24} className="text-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">No hierarchy available</span>
                 </div>
               )}
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center justify-center gap-2">
              <MousePointer2 size={12} /> Only showing devices within scope
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

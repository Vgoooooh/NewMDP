
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Cpu, 
  Users as UsersIcon, 
  Tag, 
  History, 
  Edit3, 
  ChevronLeft, 
  Clock, 
  User, 
  Layers,
  Map as MapIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  AlertTriangle,
  Check,
  Plus,
  PlusCircle,
  Settings2,
  ArrowRight
} from 'lucide-react';
import { FloorPlanEditor } from './FloorPlanEditor';
import { CreatorDisplay } from './WorkflowManager';

interface AssetDetailViewProps {
  asset: {
    id: string;
    name: string;
    type: string;
    parentId?: string;
    parentName?: string;
    creator?: string;
  };
  onBack: () => void;
}

type TabType = 'devices' | 'users' | 'attributes' | 'floor-plan';

interface Attribute {
  id: string;
  name: string;
  type: 'Number' | 'Text' | 'Enum' | 'Boolean';
  value: any;
  lastSync: string;
  config?: any;
}

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({ asset, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [isFloorPlanEditing, setIsFloorPlanEditing] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // List States
  const [devices, setDevices] = useState(() => {
    if (asset.name.includes('Gate')) {
      return Array.from({ length: 4 }).map((_, i) => ({
        id: `dev-${asset.id}-${i}`,
        name: 'AM308',
        sn: `SN: 2510${asset.id.split('-').pop()?.toUpperCase()}${i}X`,
        model: 'AM308 9in1 IAQ Sensor',
        status: i % 4 === 3 ? 'offline' : 'online',
        lastSeen: '2025-12-30 16:00'
      }));
    }
    return [];
  });

  const [users, setUsers] = useState([
    { id: 'u1', username: 'vgo', email: 'vgo.cheng@example.com', status: 'Active', role: 'Administrator' },
    { id: 'u2', username: 'leo', email: 'leo.zhang@example.com', status: 'Active', role: 'Engineer' }
  ]);

  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: 'attr-001298', name: 'Air Quality', type: 'Enum', value: 'Good', lastSync: '2025-12-30 14:37:32' },
    { id: 'attr-002341', name: 'Temperature', type: 'Number', value: '24.5', lastSync: '2025-12-30 14:38:15' }
  ]);

  // Selection States
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<Set<string>>(new Set());
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<Set<string>>(new Set());

  // Modal State for Attribute Creation
  const [isCreateAttrModalOpen, setIsCreateAttrModalOpen] = useState(false);
  const [attrFormData, setAttrFormData] = useState({
    name: '',
    id: '', // Will be generated
    type: 'Number' as Attribute['type'],
    // Number configs
    min: '',
    max: '',
    precision: '1',
    // Text configs
    minLength: '',
    maxLength: '',
    unit: '',
    // Enum configs
    enumOptions: ['Option 1', 'Option 2'],
    // Boolean configs
    trueText: 'Enabled',
    falseText: 'Disabled'
  });

  const generateAttrId = () => 'attr-' + Math.floor(100000 + Math.random() * 900000).toString();

  const handleTabClick = (id: TabType) => {
    if (id === activeTab) return;
    if (activeTab === 'floor-plan' && isFloorPlanEditing) {
      setPendingTab(id);
      setShowExitConfirm(true);
      return;
    }
    setActiveTab(id);
  };

  const toggleSelectAll = (list: any[], selectedSet: Set<string>, setFn: (s: Set<string>) => void) => {
    if (selectedSet.size === list.length && list.length > 0) {
      setFn(new Set());
    } else {
      setFn(new Set(list.map(i => i.id)));
    }
  };

  const toggleItemSelect = (id: string, selectedSet: Set<string>, setFn: (s: Set<string>) => void) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFn(next);
  };

  const batchRemove = (type: 'device' | 'user' | 'attribute') => {
    const count = type === 'device' ? selectedDeviceIds.size : 
                  type === 'user' ? selectedUserIds.size : 
                  selectedAttributeIds.size;
    
    if (count === 0) return;
    if (!window.confirm(`Are you sure you want to remove ${count} selected items?`)) return;

    if (type === 'device') {
      setDevices(prev => prev.filter(d => !selectedDeviceIds.has(d.id)));
      setSelectedDeviceIds(new Set());
    } else if (type === 'user') {
      setUsers(prev => prev.filter(u => !selectedUserIds.has(u.id)));
      setSelectedUserIds(new Set());
    } else {
      setAttributes(prev => prev.filter(a => !selectedAttributeIds.has(a.id)));
      setSelectedAttributeIds(new Set());
    }
  };

  const saveNewAttribute = () => {
    if (!attrFormData.name) return;
    const newAttr: Attribute = {
      id: attrFormData.id,
      name: attrFormData.name,
      type: attrFormData.type,
      value: attrFormData.type === 'Boolean' ? 'False' : 'N/A',
      lastSync: new Date().toISOString().replace('T', ' ').substr(0, 19),
      config: { ...attrFormData }
    };
    setAttributes(prev => [...prev, newAttr]);
    setIsCreateAttrModalOpen(false);
  };

  const openCreateAttr = () => {
    setAttrFormData({
      name: '',
      id: generateAttrId(),
      type: 'Number',
      min: '0',
      max: '100',
      precision: '1',
      minLength: '0',
      maxLength: '255',
      unit: '',
      enumOptions: ['Option 1', 'Option 2'],
      trueText: 'Enabled',
      falseText: 'Disabled'
    });
    setIsCreateAttrModalOpen(true);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={`flex items-center gap-2 px-6 py-3 text-xs font-bold border-b-2 transition-all ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
          : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  const currentSelectedCount = activeTab === 'devices' ? selectedDeviceIds.size : 
                              activeTab === 'users' ? selectedUserIds.size : 
                              activeTab === 'attributes' ? selectedAttributeIds.size : 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-300 overflow-hidden relative">
      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{asset.name}</h2>
              <span className="text-[10px] text-slate-400 font-bold ml-2 uppercase tracking-tighter">ID: {asset.id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</span>
            <span className="text-xs font-bold text-slate-700">{asset.type}</span>
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Node</span>
            <span className="text-xs font-bold text-slate-700">{asset.parentName || 'Project Root'}</span>
            {asset.parentId && <span className="text-[9px] text-slate-300 font-mono">({asset.parentId})</span>}
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Creator</span>
            <CreatorDisplay name={asset.creator || '-'} />
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-100 shrink-0">
        <TabButton id="devices" label="Devices" icon={Cpu} />
        <TabButton id="users" label="Users" icon={UsersIcon} />
        <TabButton id="attributes" label="Attributes" icon={Tag} />
        <TabButton id="floor-plan" label="Floor Plan" icon={MapIcon} />
      </div>

      <div className="flex-grow overflow-hidden bg-white relative">
        <div className="px-6 py-3 overflow-auto h-full flex flex-col gap-3">
          
          {/* List Toolbar / Action Bar - More Compact */}
          {activeTab !== 'floor-plan' && (
            <div className="flex items-center justify-between min-h-[36px]">
              <div className="flex items-center gap-2">
                {activeTab === 'attributes' && (
                  <button onClick={openCreateAttr} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-md">
                    <Plus size={12} strokeWidth={4} /> Create Attribute
                  </button>
                )}
                
                {/* Batch Actions Toolbar - Always visible but disabled if count is 0 */}
                <div className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded-lg transition-all">
                  <span className={`text-[10px] font-black uppercase px-1 ${currentSelectedCount > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                    {currentSelectedCount} Selected
                  </span>
                  <div className="w-px h-3 bg-slate-200"></div>
                  <button 
                    disabled={currentSelectedCount === 0}
                    onClick={() => batchRemove(activeTab.slice(0, -1) as any)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all ${
                      currentSelectedCount > 0 
                      ? 'text-red-500 hover:bg-red-50 active:scale-95' 
                      : 'text-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={devices.length > 0 && selectedDeviceIds.size === devices.length}
                        onChange={() => toggleSelectAll(devices, selectedDeviceIds, setSelectedDeviceIds)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3">Device Info</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3">Last Seen</th>
                    <th className="px-6 py-3">Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {devices.length > 0 ? devices.map(dev => (
                    <tr key={dev.id} className={`hover:bg-slate-50/50 transition-colors ${selectedDeviceIds.has(dev.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleItemSelect(dev.id, selectedDeviceIds, setSelectedDeviceIds)}>
                      <td className="px-6 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedDeviceIds.has(dev.id)}
                          onChange={() => toggleItemSelect(dev.id, selectedDeviceIds, setSelectedDeviceIds)}
                          className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{dev.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{dev.sn}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black rounded-md border ${dev.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {dev.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">{dev.lastSeen}</td>
                      <td className="px-6 py-3 text-sm text-slate-600 font-medium">{dev.model}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-20 text-center opacity-40"><Cpu size={32} className="mx-auto mb-2" /><p className="text-xs font-bold uppercase tracking-widest">No devices</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={users.length > 0 && selectedUserIds.size === users.length}
                        onChange={() => toggleSelectAll(users, selectedUserIds, setSelectedUserIds)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${selectedUserIds.has(u.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleItemSelect(u.id, selectedUserIds, setSelectedUserIds)}>
                      <td className="px-6 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.has(u.id)}
                          onChange={() => toggleItemSelect(u.id, selectedUserIds, setSelectedUserIds)}
                          className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-slate-900">{u.username}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{u.email}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100">{u.status}</span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700 font-medium">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={attributes.length > 0 && selectedAttributeIds.size === attributes.length}
                        onChange={() => toggleSelectAll(attributes, selectedAttributeIds, setSelectedAttributeIds)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3">Attribute Name</th>
                    <th className="px-6 py-3">Attribute ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3 text-right">Last Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attributes.map(attr => (
                    <tr key={attr.id} className={`hover:bg-slate-50/50 transition-colors ${selectedAttributeIds.has(attr.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleItemSelect(attr.id, selectedAttributeIds, setSelectedAttributeIds)}>
                      <td className="px-6 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedAttributeIds.has(attr.id)}
                          onChange={() => toggleItemSelect(attr.id, selectedAttributeIds, setSelectedAttributeIds)}
                          className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-slate-900">{attr.name}</td>
                      <td className="px-6 py-3 text-xs font-mono text-slate-500">{attr.id}</td>
                      <td className="px-6 py-3">
                        <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 bg-slate-100 rounded uppercase">{attr.type}</span>
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-blue-600">{attr.value}</td>
                      <td className="px-6 py-3 text-right text-xs text-slate-500">{attr.lastSync}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'floor-plan' && (
            <FloorPlanEditor asset={asset} onBack={() => handleTabClick('devices')} onEditChange={setIsFloorPlanEditing} externalEditingState={isFloorPlanEditing} />
          )}
        </div>
      </div>

      {/* Create Attribute Modal */}
      {isCreateAttrModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner"><PlusCircle size={20} strokeWidth={2} /></div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create Attribute</h3>
                </div>
                <button onClick={() => setIsCreateAttrModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Asset Definition Config</p>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Attribute Name</label>
                  <input type="text" placeholder="e.g. Temperature, Status..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all" value={attrFormData.name} onChange={e => setAttrFormData({...attrFormData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Attribute ID</label>
                  <input type="text" readOnly className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl font-mono text-xs text-slate-500 cursor-not-allowed" value={attrFormData.id} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Attribute Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['Number', 'Text', 'Enum', 'Boolean'] as Attribute['type'][]).map(type => (
                    <button 
                      key={type}
                      onClick={() => setAttrFormData({...attrFormData, type})}
                      className={`py-3 rounded-2xl border-2 text-[11px] font-black transition-all ${attrFormData.type === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{attrFormData.type} Config</span>
                </div>

                {attrFormData.type === 'Number' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Min Value</label><input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.min} onChange={e => setAttrFormData({...attrFormData, min: e.target.value})} /></div>
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Max Value</label><input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.max} onChange={e => setAttrFormData({...attrFormData, max: e.target.value})} /></div>
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Precision</label><select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.precision} onChange={e => setAttrFormData({...attrFormData, precision: e.target.value})}><option value="1">0</option><option value="0.1">0.1</option><option value="0.01">0.01</option></select></div>
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Unit</label><input type="text" placeholder="°C, %, ppm..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.unit} onChange={e => setAttrFormData({...attrFormData, unit: e.target.value})} /></div>
                  </div>
                )}

                {attrFormData.type === 'Text' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Min Length</label><input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.minLength} onChange={e => setAttrFormData({...attrFormData, minLength: e.target.value})} /></div>
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Max Length</label><input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.maxLength} onChange={e => setAttrFormData({...attrFormData, maxLength: e.target.value})} /></div>
                    <div className="col-span-2"><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Unit Hint</label><input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={attrFormData.unit} onChange={e => setAttrFormData({...attrFormData, unit: e.target.value})} /></div>
                  </div>
                )}

                {attrFormData.type === 'Enum' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><label className="block text-[9px] font-black text-slate-400 uppercase">Options (Min 2, Max 10)</label><button disabled={attrFormData.enumOptions.length >= 10} onClick={() => setAttrFormData({...attrFormData, enumOptions: [...attrFormData.enumOptions, `Option ${attrFormData.enumOptions.length + 1}`]})} className="text-[10px] font-black text-blue-600 uppercase hover:underline disabled:opacity-30 flex items-center gap-1"><Plus size={12} /> Add</button></div>
                    <div className="flex flex-col gap-3">
                      {attrFormData.enumOptions.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" className="flex-grow px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={opt} onChange={e => { const next = [...attrFormData.enumOptions]; next[idx] = e.target.value; setAttrFormData({...attrFormData, enumOptions: next}); }} />
                          <button disabled={attrFormData.enumOptions.length <= 2} onClick={() => { const next = [...attrFormData.enumOptions]; next.splice(idx, 1); setAttrFormData({...attrFormData, enumOptions: next}); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg disabled:opacity-20 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attrFormData.type === 'Boolean' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">True Label</label><input type="text" className="w-full px-4 py-3 bg-white border border-emerald-100 text-emerald-600 font-bold rounded-xl text-xs" value={attrFormData.trueText} onChange={e => setAttrFormData({...attrFormData, trueText: e.target.value})} /></div>
                    <div><label className="block text-[9px] font-black text-slate-400 uppercase mb-2">False Label</label><input type="text" className="w-full px-4 py-3 bg-white border border-red-100 text-red-600 font-bold rounded-xl text-xs" value={attrFormData.falseText} onChange={e => setAttrFormData({...attrFormData, falseText: e.target.value})} /></div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0">
              <button onClick={() => setIsCreateAttrModalOpen(false)} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
              <button disabled={!attrFormData.name} onClick={saveNewAttribute} className={`flex-1 py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${!attrFormData.name ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}><Check size={20} strokeWidth={3} /> Save Attribute</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switch Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0"><AlertTriangle size={24} className="text-amber-500" /></div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Exit Floor Plan Editor?</h3>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed mb-8">This action will exit the floor plan editor. Any unsaved changes will be lost. Continue?</p>
            <div className="flex gap-4">
              <button onClick={() => { setShowExitConfirm(false); setPendingTab(null); }} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">No</button>
              <button onClick={() => { setIsFloorPlanEditing(false); if(pendingTab) setActiveTab(pendingTab); setShowExitConfirm(false); setPendingTab(null); }} className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Check size={18} strokeWidth={3} /> Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

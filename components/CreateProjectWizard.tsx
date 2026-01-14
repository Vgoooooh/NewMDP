
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Search, 
  User, 
  Info, 
  Building2, 
  Layers, 
  Maximize, 
  DoorOpen, 
  Plus, 
  Trash2, 
  Box, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  LayoutTemplate, 
  Sprout, 
  UserCircle,
  Briefcase,
  Zap,
  ShoppingBag,
  Factory,
  Home,
  Database,
  Globe,
  Activity
} from 'lucide-react';
import { IoTProjectCategory, IoTProject } from '../types';

// --- Types ---

interface WizardProps {
  onClose: () => void;
  onSuccess: (project: IoTProject) => void;
}

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  category: IoTProjectCategory;
  coverUrl: string;
}

interface AssetNodeDraft {
  id: string;
  name: string;
  type: string;
  iconName: string;
  children: AssetNodeDraft[];
}

interface DeviceDraft {
  id: string;
  name: string;
  sn: string;
  assetId: string;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AssetTypeDef {
    name: string;
    iconName: string;
    icon: any;
}

// --- Constants & Mocks ---

const TEMPLATES: TemplateOption[] = [
  {
    id: 'tpl-hvac',
    name: 'HVAC Management',
    description: 'Optimize heating, ventilation, and air conditioning for energy efficiency.',
    category: IoTProjectCategory.SMART_BUILDING,
    coverUrl: 'https://images.unsplash.com/photo-1516937941348-c09645f8b927?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'tpl-building',
    name: 'Smart Building',
    description: 'Comprehensive building automation including lighting, access, and security.',
    category: IoTProjectCategory.SMART_BUILDING,
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'tpl-retail',
    name: 'Smart Retail',
    description: 'Foot traffic analysis and inventory environment monitoring.',
    category: IoTProjectCategory.FLEET_MANAGEMENT,
    coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'tpl-energy',
    name: 'Energy Monitoring',
    description: 'Real-time power consumption tracking and anomaly detection.',
    category: IoTProjectCategory.ENERGY_MONITORING,
    coverUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'tpl-restroom',
    name: 'Smart Restroom',
    description: 'Occupancy tracking, consumable levels, and cleaning schedules.',
    category: IoTProjectCategory.SMART_BUILDING,
    coverUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop'
  }
];

const UNASSIGNED_DEVICES = Array.from({ length: 20 }).map((_, i) => ({
    id: `dev-ua-${i}`,
    name: i % 3 === 0 ? `Temp Sensor ${i}` : `Smart Switch ${i}`,
    sn: `SN-FREE-${1000+i}`,
    status: i % 5 === 0 ? 'offline' : 'online'
}));

const ASSET_TYPES: AssetTypeDef[] = [
    { name: 'Building', iconName: 'Building2', icon: Building2 },
    { name: 'Floor', iconName: 'Layers', icon: Layers },
    { name: 'Space', iconName: 'Maximize', icon: Maximize },
    { name: 'Room', iconName: 'DoorOpen', icon: DoorOpen },
    { name: 'Zone', iconName: 'Box', icon: Box },
];

const PROJECT_ICONS = [
  { name: 'Building', icon: Building2 },
  { name: 'Factory', icon: Factory },
  { name: 'Retail', icon: ShoppingBag },
  { name: 'Energy', icon: Zap },
  { name: 'Home', icon: Home },
  { name: 'Data', icon: Database },
  { name: 'Global', icon: Globe },
  { name: 'Activity', icon: Activity },
];

const PROJECT_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-indigo-500 to-purple-700',
  'from-sky-400 to-blue-600',
  'from-slate-500 to-zinc-600',
  'from-violet-500 to-fuchsia-600'
];

const IconRegistry: Record<string, any> = {
    Building2, Layers, Maximize, DoorOpen, Box, UserCircle, Factory, ShoppingBag, Zap, Home, Database, Globe, Activity
};

// --- Helper Components ---

const StepIndicator = ({ step, current, label }: { step: number, current: number, label: string }) => {
  const status = current === step ? 'active' : current > step ? 'completed' : 'pending';
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
        status === 'active' ? 'bg-blue-600 text-white shadow-md scale-110' :
        status === 'completed' ? 'bg-emerald-500 text-white' :
        'bg-slate-200 text-slate-400'
      }`}>
        {status === 'completed' ? <Check size={12} strokeWidth={4} /> : step}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${status === 'active' ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
      {step < 3 && <div className="w-6 h-px bg-slate-200 mx-2" />}
    </div>
  );
};

export const CreateProjectWizard: React.FC<WizardProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adminUser: null as MockUser | null,
    templateId: null as string | null,
    projectIcon: 'Building',
    projectColor: 'from-blue-500 to-indigo-600'
  });
  
  // Step 1: User Search
  const [userSearch, setUserSearch] = useState('');
  const [foundUser, setFoundUser] = useState<MockUser | null>(null);

  // Step 2: Assets
  const [assets, setAssets] = useState<AssetNodeDraft[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Step 3: Devices
  const [assignedDevices, setAssignedDevices] = useState<DeviceDraft[]>([]);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  const [selectedDevicesInPicker, setSelectedDevicesInPicker] = useState<Set<string>>(new Set());

  // Step 4: Success
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize/Update Asset Tree based on Step 1 configuration
  useEffect(() => {
    // Only automatically update tree structure when we are in Step 1 (configuring)
    // If we are in Step 2 or 3, we preserve the tree state (to allow manual edits)
    // unless the dependencies change (implying the user went back and changed something)
    if (step !== 1) return;

    // Base Root Node
    const rootNode: AssetNodeDraft = {
        id: 'root',
        name: formData.name || 'Project Name',
        type: 'Project',
        iconName: formData.projectIcon || 'Building2',
        children: []
    };

    if (formData.templateId === 'tpl-hvac') {
        // HVAC Template Initialization Logic
        // Structure: Root -> Building Asset -> Floor-1/2 -> Room-1/2/3/4
        rootNode.children = [
           {
             id: 'node-bldg', 
             name: 'Building Asset', 
             type: 'Building', 
             iconName: 'Building2', 
             children: [
               { 
                 id: 'node-f1', 
                 name: 'Floor-1', 
                 type: 'Floor', 
                 iconName: 'Layers', 
                 children: [
                   { id: 'node-r1', name: 'Room-1', type: 'Room', iconName: 'DoorOpen', children: [] },
                   { id: 'node-r2', name: 'Room-2', type: 'Room', iconName: 'DoorOpen', children: [] }
                 ]
               },
               { 
                 id: 'node-f2', 
                 name: 'Floor-2', 
                 type: 'Floor', 
                 iconName: 'Layers', 
                 children: [
                   { id: 'node-r3', name: 'Room-3', type: 'Room', iconName: 'DoorOpen', children: [] },
                   { id: 'node-r4', name: 'Room-4', type: 'Room', iconName: 'DoorOpen', children: [] }
                 ]
               }
             ]
           }
        ];
        
        // Optionally, if the user hasn't typed a name yet, we could set it to "HVAC Management"
        if (!formData.name) rootNode.name = "HVAC Management";
    }

    setAssets([rootNode]);
    
    // Auto-select root if nothing selected
    if (!selectedAssetId) setSelectedAssetId('root');

  }, [formData.name, formData.templateId, formData.projectIcon]); // Re-run when these change in Step 1

  // Mock Search Effect
  useEffect(() => {
    if (userSearch.includes('@')) {
       // Simple simulation
       setFoundUser({
        id: 'u-mock-001',
        name: 'Demo Admin',
        email: userSearch,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
      });
    } else {
      setFoundUser(null);
    }
  }, [userSearch]);

  const handleNext = () => {
    if (step === 1 && !formData.name) return; // Validation
    if (step === 3) {
      handleFinish();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    // Construct final project object
    const newProject: IoTProject = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description || 'No description provided.',
      category: formData.templateId ? TEMPLATES.find(t => t.id === formData.templateId)?.category || IoTProjectCategory.SMART_BUILDING : IoTProjectCategory.SMART_BUILDING,
      stats: {
        deviceCount: assignedDevices.length,
        assetCount: countAssets(assets),
        memberCount: formData.adminUser ? 1 : 0
      },
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setIsSuccess(true);
  };

  const countAssets = (nodes: AssetNodeDraft[]): number => {
    let count = nodes.length;
    for (const node of nodes) {
      count += countAssets(node.children);
    }
    return count;
  };

  const flattenAssets = (nodes: AssetNodeDraft[], depth = 0): { id: string, name: string, depth: number }[] => {
    let result: { id: string, name: string, depth: number }[] = [];
    for (const node of nodes) {
      result.push({ id: node.id, name: node.name, depth });
      result = [...result, ...flattenAssets(node.children, depth + 1)];
    }
    return result;
  };

  // --- Step 2 Logic (Assets) ---
  const addSubAsset = (parentId: string) => {
    const newAsset: AssetNodeDraft = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'New Asset',
        type: 'Space',
        iconName: 'Maximize',
        children: []
    };

    const addRecursive = (nodes: AssetNodeDraft[]): AssetNodeDraft[] => {
        return nodes.map(node => {
            if (node.id === parentId) {
                return { ...node, children: [...node.children, newAsset] };
            }
            return { ...node, children: addRecursive(node.children) };
        });
    };
    setAssets(addRecursive(assets));
    if(!selectedAssetId) setSelectedAssetId(parentId);
  };

  const deleteAsset = (id: string) => {
    if (id === 'root') return;
    const deleteRecursive = (nodes: AssetNodeDraft[]): AssetNodeDraft[] => {
        return nodes.filter(node => node.id !== id).map(node => ({
            ...node,
            children: deleteRecursive(node.children)
        }));
    };
    setAssets(deleteRecursive(assets));
    if (selectedAssetId === id) setSelectedAssetId('root');
  };

  const updateAsset = (id: string, field: 'name' | 'type', value: string) => {
      const updateRecursive = (nodes: AssetNodeDraft[]): AssetNodeDraft[] => {
          return nodes.map(node => {
              if (node.id === id) {
                  const updates: any = { [field]: value };
                  // Update icon if type changes
                  if (field === 'type') {
                      const typeDef = ASSET_TYPES.find(t => t.name === value);
                      if (typeDef) updates.iconName = typeDef.iconName;
                  }
                  return { ...node, ...updates };
              }
              return { ...node, children: updateRecursive(node.children) };
          });
      };
      setAssets(updateRecursive(assets));
  };

  const renderAssetTree = (nodes: AssetNodeDraft[], depth = 0, readOnly = false) => {
      return nodes.map(node => {
          // Map icon based on type or use stored iconName, fallback to layers
          let IconComp = IconRegistry[node.iconName] || Layers;
          // Special case for root node to use the project icon selected in step 1 if available
          if (node.id === 'root' && formData.projectIcon) {
             const selected = PROJECT_ICONS.find(i => i.name === formData.projectIcon);
             if (selected) IconComp = selected.icon;
          }

          return (
          <div key={node.id}>
              <div 
                className={`flex items-center gap-2 py-2 px-3 border-b border-slate-50 transition-colors ${readOnly ? '' : 'cursor-pointer'} ${selectedAssetId === node.id ? 'bg-blue-50/80 border-blue-100' : 'hover:bg-slate-50'}`}
                style={{ paddingLeft: `${depth * 20 + 12}px` }}
                onClick={() => {
                    // Toggle selection logic
                    if (selectedAssetId === node.id) {
                        setSelectedAssetId(null);
                    } else {
                        setSelectedAssetId(node.id);
                    }
                }}
              >
                 <IconComp size={16} className={selectedAssetId === node.id ? 'text-blue-500' : 'text-slate-400'} />
                 
                 {/* Editable Mode */}
                 {!readOnly && selectedAssetId === node.id ? (
                     <div className="flex items-center gap-2 flex-grow">
                         <input 
                            type="text" 
                            className="bg-white border border-blue-200 rounded px-2 py-0.5 text-xs font-bold text-slate-700 w-full max-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={node.name}
                            onChange={(e) => updateAsset(node.id, 'name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                         />
                         {/* Only show Type dropdown for non-root nodes */}
                         {node.id !== 'root' && (
                             <select
                                className="bg-white border border-blue-200 rounded px-2 py-0.5 text-[10px] font-bold text-slate-500 focus:outline-none cursor-pointer hover:border-blue-400"
                                value={node.type}
                                onChange={(e) => updateAsset(node.id, 'type', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                             >
                                {ASSET_TYPES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                             </select>
                         )}
                         {node.id === 'root' && (
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight bg-slate-100 px-1.5 rounded">Project Root</span>
                         )}
                     </div>
                 ) : (
                     <div className="flex flex-col flex-grow">
                         <span className={`text-sm font-bold ${selectedAssetId === node.id ? 'text-blue-700' : 'text-slate-700'}`}>{node.name}</span>
                         <span className="text-[10px] text-slate-400 font-mono">{node.type}</span>
                     </div>
                 )}
                 
                 {!readOnly && (
                     <div className={`flex items-center gap-1 transition-opacity ${selectedAssetId === node.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                         <button 
                            onClick={(e) => { e.stopPropagation(); addSubAsset(node.id); }}
                            className="p-1.5 hover:bg-blue-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                            title="Add Child"
                         >
                             <Plus size={14} />
                         </button>
                         {node.id !== 'root' && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); deleteAsset(node.id); }}
                                className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                title="Delete"
                             >
                                 <Trash2 size={14} />
                             </button>
                         )}
                     </div>
                 )}
              </div>
              {node.children.length > 0 && renderAssetTree(node.children, depth + 1, readOnly)}
          </div>
      )});
  };

  // --- Step 3 Logic (Devices) ---
  const handleOpenDevicePicker = () => {
      setSelectedDevicesInPicker(new Set());
      setDeviceSearchQuery('');
      setShowDevicePicker(true);
  };

  const handleAddSelectedDevices = () => {
      if (!selectedAssetId) return;
      const newDevices: DeviceDraft[] = [];
      selectedDevicesInPicker.forEach(devId => {
          const dev = UNASSIGNED_DEVICES.find(d => d.id === devId);
          if (dev) {
              newDevices.push({
                  id: dev.id,
                  name: dev.name,
                  sn: dev.sn,
                  assetId: selectedAssetId
              });
          }
      });
      setAssignedDevices(prev => [...prev, ...newDevices]);
      setShowDevicePicker(false);
  };

  const removeDevice = (devId: string) => {
      setAssignedDevices(prev => prev.filter(d => d.id !== devId));
  };

  const currentAssetDevices = assignedDevices.filter(d => d.assetId === selectedAssetId);
  const selectedAssetName = flattenAssets(assets).find(a => a.id === selectedAssetId)?.name || 'Project';

  const filteredAvailableDevices = UNASSIGNED_DEVICES.filter(d => 
      !assignedDevices.find(ad => ad.id === d.id) && 
      (d.name.toLowerCase().includes(deviceSearchQuery.toLowerCase()) || d.sn.toLowerCase().includes(deviceSearchQuery.toLowerCase()))
  );

  // --- Success View ---
  if (isSuccess) {
      return (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-50 animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 border border-slate-100">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100 shadow-inner">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Project Created!</h2>
                  <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
                      <span className="font-bold text-slate-800">{formData.name}</span> has been successfully initialized with {countAssets(assets)} assets and {assignedDevices.length} devices.
                  </p>
                  <button 
                    onClick={() => {
                        const newProject: IoTProject = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: formData.name,
                            description: formData.description || '',
                            category: formData.templateId ? TEMPLATES.find(t => t.id === formData.templateId)?.category || IoTProjectCategory.SMART_BUILDING : IoTProjectCategory.SMART_BUILDING,
                            stats: {
                                deviceCount: assignedDevices.length,
                                assetCount: countAssets(assets),
                                memberCount: formData.adminUser ? 1 : 0
                            },
                            updatedAt: new Date().toISOString().split('T')[0],
                            status: 'active'
                        };
                        onSuccess(newProject);
                    }}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                      Go to Project Overview <ArrowRight size={20} />
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[1500] bg-slate-50 animate-in fade-in duration-300 flex flex-col">
        {/* Header - Slimmer */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-20 h-14">
           <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                 <X size={20} />
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div>
                 <h3 className="text-base font-black text-slate-900 leading-none">Create New Project</h3>
                 <p className="text-[10px] font-medium text-slate-500 mt-0.5">Wizard Mode</p>
              </div>
           </div>
           
           <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Progress Bar - Moved below header */}
        <div className="w-full bg-slate-50 border-b border-slate-200 py-3 flex justify-center shrink-0 z-10">
            <div className="flex items-center gap-4">
              <StepIndicator step={1} current={step} label="Basic Info" />
              <StepIndicator step={2} current={step} label="Assets" />
              <StepIndicator step={3} current={step} label="Devices" />
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-hidden flex flex-col relative max-w-7xl mx-auto w-full">
           
           {/* Step 1: Basic Info */}
           {step === 1 && (
             <div className="flex-grow overflow-y-auto p-8 animate-in slide-in-from-right-4 duration-300 w-full">
                <div className="max-w-5xl mx-auto space-y-10">
                   
                   {/* Form Fields - More compact layout */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                         <div className="space-y-6">
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Project Name <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm shadow-sm"
                                  placeholder="e.g. West Side Smart Mall"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  autoFocus
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Project Administrator</label>
                                <div className="relative group">
                                   {formData.adminUser ? (
                                       <div className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm">
                                           <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <User size={16} />
                                           </div>
                                           <div className="flex-grow">
                                                <p className="text-xs font-black text-slate-800">{formData.adminUser.name}</p>
                                                <p className="text-[10px] text-slate-500">{formData.adminUser.email}</p>
                                           </div>
                                           <button 
                                                onClick={() => { setFormData({...formData, adminUser: null}); setUserSearch(''); }}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors mr-1"
                                           >
                                                <X size={16} />
                                           </button>
                                       </div>
                                   ) : (
                                       <>
                                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                                         <input 
                                            type="text" 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 text-xs shadow-sm"
                                            placeholder="Search by email address..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                         />
                                       </>
                                   )}
                                   
                                   {/* Mock Search Result Dropdown */}
                                   {!formData.adminUser && foundUser && (
                                       <div 
                                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 cursor-pointer hover:bg-slate-50"
                                          onClick={() => setFormData({...formData, adminUser: foundUser})}
                                       >
                                          <div className="flex items-center gap-3 p-2">
                                             <img src={foundUser.avatar} alt="User" className="w-8 h-8 rounded-full" />
                                             <div>
                                                <p className="text-xs font-black text-slate-800">{foundUser.name}</p>
                                                <p className="text-[10px] text-slate-500">({foundUser.email})</p>
                                             </div>
                                          </div>
                                       </div>
                                   )}
                                </div>
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description <span className="text-slate-300">(Optional)</span></label>
                                <textarea 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-xs placeholder:text-slate-300 shadow-sm"
                                  placeholder="Briefly describe the scope of this project..."
                                  rows={2}
                                  maxLength={200}
                                  value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                             </div>
                         </div>

                         {/* Right Column: Icon & Color & Preview */}
                         <div className="space-y-6">
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Project Appearance</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${formData.projectColor} flex items-center justify-center shadow-inner text-white`}>
                                            {(() => {
                                                const Icon = PROJECT_ICONS.find(i => i.name === formData.projectIcon)?.icon || Building2;
                                                return <Icon size={32} />;
                                            })()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 mb-1">Preview</p>
                                            <p className="text-[10px] text-slate-400">Icon and color style</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Select Icon</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {PROJECT_ICONS.map(icon => (
                                                <button
                                                    key={icon.name}
                                                    onClick={() => setFormData({...formData, projectIcon: icon.name})}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${formData.projectIcon === icon.name ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    title={icon.name}
                                                >
                                                    <icon.icon size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Background Style</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {PROJECT_COLORS.map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setFormData({...formData, projectColor: color})}
                                                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} transition-all ${formData.projectColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>
                   </div>

                   {/* Template Selection - Larger Cards */}
                   <div className="pt-2">
                      <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">
                         Select Solution Template <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase tracking-wider">Optional</span>
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                         {TEMPLATES.map(tpl => (
                            <div 
                               key={tpl.id}
                               onClick={() => setFormData({...formData, templateId: formData.templateId === tpl.id ? null : tpl.id})}
                               className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden group relative flex flex-col h-60 ${
                                  formData.templateId === tpl.id 
                                    ? 'border-blue-500 shadow-2xl shadow-blue-100 ring-4 ring-blue-500/10 transform scale-[1.02]' 
                                    : 'border-slate-100 hover:border-slate-300 hover:shadow-xl bg-white'
                               }`}
                            >
                               {formData.templateId === tpl.id && (
                                  <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in">
                                     <Check size={18} strokeWidth={3} />
                                  </div>
                               )}
                               <div className="h-32 bg-slate-200 relative shrink-0">
                                  <img src={tpl.coverUrl} className="w-full h-full object-cover" alt={tpl.name} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                  <div className="absolute bottom-3 left-4 text-white">
                                     <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest mb-0.5">{tpl.category.replace('_', ' ')}</p>
                                     <h5 className="text-sm font-black leading-tight shadow-sm">{tpl.name}</h5>
                                  </div>
                               </div>
                               <div className="p-5 flex flex-col flex-grow bg-white">
                                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">{tpl.description}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Step 2: Assets */}
           {step === 2 && (
             <div className="flex-grow flex flex-col animate-in slide-in-from-right-4 duration-300 bg-white m-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-4 bg-yellow-50/50 border-b border-yellow-100 flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-3">
                      <Sprout size={18} className="text-yellow-600" />
                      <p className="text-xs font-bold text-yellow-800">
                         Define your asset hierarchy now. 
                         <span className="text-yellow-600/70 ml-2 font-normal">Click on a node to select it (click again to deselect). Use <Plus size={10} className="inline" /> to add a child asset.</span>
                      </p>
                   </div>
                   <button onClick={handleNext} className="text-[10px] font-black uppercase text-yellow-700 hover:underline">Skip this step</button>
                </div>
                
                {/* Simplified Layout: No inner frame */}
                <div className="flex-grow p-0 overflow-y-auto custom-scrollbar">
                   {renderAssetTree(assets)}
                </div>
             </div>
           )}

           {/* Step 3: Devices */}
           {step === 3 && (
             <div className="flex-grow flex flex-col animate-in slide-in-from-right-4 duration-300 bg-white m-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                       <Cpu size={16} />
                     </div>
                     <p className="text-sm font-bold text-slate-700">Assign devices to assets</p>
                   </div>
                   <button onClick={handleNext} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 hover:underline">Skip assignment</button>
                </div>

                <div className="flex-grow p-6 flex gap-6 overflow-hidden bg-slate-50/30">
                   {/* Left: Asset Tree (Read Only) */}
                   <div className="w-80 shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                         <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Select Asset Node</h4>
                      </div>
                      <div className="p-0 flex-grow overflow-y-auto custom-scrollbar">
                         {renderAssetTree(assets, 0, true)} 
                      </div>
                   </div>

                   {/* Right: Assigned Devices List */}
                   <div className="flex-grow bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <h4 className="text-sm font-black text-slate-800">Assigned to: <span className="text-blue-600">{selectedAssetName}</span></h4>
                             <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{currentAssetDevices.length} Devices</span>
                          </div>
                          <button 
                             onClick={handleOpenDevicePicker}
                             disabled={!selectedAssetId}
                             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all shadow-sm ${selectedAssetId ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                          >
                             <Plus size={14} strokeWidth={3} /> Add Devices
                          </button>
                       </div>
                       
                       <div className="flex-grow overflow-y-auto p-0">
                          {currentAssetDevices.length > 0 ? (
                             <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                                   <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      <th className="px-6 py-3">Device Name</th>
                                      <th className="px-6 py-3">Identifier</th>
                                      <th className="px-6 py-3 text-right">Action</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                   {currentAssetDevices.map((d, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                         <td className="px-6 py-3 text-xs font-bold text-slate-700">{d.name}</td>
                                         <td className="px-6 py-3 text-xs font-mono text-slate-500">{d.sn}</td>
                                         <td className="px-6 py-3 text-right">
                                            <button 
                                               onClick={() => removeDevice(d.id)}
                                               className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                            >
                                               <X size={14} />
                                            </button>
                                         </td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                                <Box size={40} className="opacity-50" />
                                <p className="text-xs font-bold uppercase tracking-wide">No devices assigned to this node</p>
                                {!selectedAssetId && <p className="text-[10px] text-slate-400">Please select an asset node on the left first</p>}
                             </div>
                          )}
                       </div>
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
           <button 
             onClick={step === 1 ? onClose : () => setStep(prev => prev - 1)}
             className="px-8 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
           >
              {step === 1 ? 'Cancel' : 'Back'}
           </button>
           <button 
             onClick={handleNext}
             className="px-10 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-3 hover:scale-105 active:scale-100"
           >
              {step === 3 ? 'Create Project' : 'Next Step'} <ChevronRight size={16} />
           </button>
        </div>

        {/* Device Picker Modal */}
        {showDevicePicker && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Select Devices</h3>
                            <p className="text-xs text-slate-500 font-medium">Add available devices to <span className="text-blue-600 font-bold">{selectedAssetName}</span></p>
                        </div>
                        <button onClick={() => setShowDevicePicker(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                    </div>
                    
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-3">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search available devices..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={deviceSearchQuery}
                                onChange={e => setDeviceSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-2">
                            <Filter size={14} /> Filter
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-2">
                        {filteredAvailableDevices.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {filteredAvailableDevices.map(d => {
                                    const isSelected = selectedDevicesInPicker.has(d.id);
                                    return (
                                        <div 
                                            key={d.id}
                                            onClick={() => {
                                                const next = new Set(selectedDevicesInPicker);
                                                if(next.has(d.id)) next.delete(d.id); else next.add(d.id);
                                                setSelectedDevicesInPicker(next);
                                            }}
                                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{d.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{d.sn}</p>
                                                <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${d.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{d.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-400">
                                <Search size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-bold uppercase">No matching devices found</p>
                            </div>
                        )}
                    </div>

                    <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
                        <button onClick={() => setShowDevicePicker(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
                        <button 
                            onClick={handleAddSelectedDevices}
                            disabled={selectedDevicesInPicker.size === 0}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${selectedDevicesInPicker.size > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                            Add {selectedDevicesInPicker.size} Devices
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

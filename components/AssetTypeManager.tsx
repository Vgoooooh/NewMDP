
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Lock, 
  Building2, 
  Layers, 
  Maximize, 
  DoorOpen, 
  MoreVertical,
  Search,
  Check,
  X,
  LucideIcon
} from 'lucide-react';
import { AssetType, IoTProject } from '../types';

// Icon mapping for display
const IconRegistry: Record<string, LucideIcon> = {
  'Building2': Building2,
  'Layers': Layers,
  'Maximize': Maximize,
  'DoorOpen': DoorOpen,
};

interface AssetTypeManagerProps {
  projects: IoTProject[];
}

export const AssetTypeManager: React.FC<AssetTypeManagerProps> = ({ projects }) => {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    { id: '1', name: 'Building', iconName: 'Building2', visibility: 'global', usageCount: 45, isPreset: true },
    { id: '2', name: 'Floor', iconName: 'Layers', visibility: 'global', usageCount: 120, isPreset: true },
    { id: '3', name: 'Space', iconName: 'Maximize', visibility: 'global', usageCount: 85, isPreset: true },
    { id: '4', name: 'Room', iconName: 'DoorOpen', visibility: 'global', usageCount: 340, isPreset: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<AssetType | null>(null);
  const [formData, setFormData] = useState<Partial<AssetType>>({
    name: '',
    visibility: 'global',
    iconName: 'Building2'
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingType) {
      setAssetTypes(prev => prev.map(t => t.id === editingType.id ? { ...t, ...formData } as AssetType : t));
    } else {
      const newType: AssetType = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        iconName: formData.iconName || 'Building2',
        visibility: formData.visibility || 'global',
        usageCount: 0,
        isPreset: false
      };
      setAssetTypes(prev => [...prev, newType]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: '', visibility: 'global', iconName: 'Building2' });
  };

  const handleDelete = (id: string) => {
    const type = assetTypes.find(t => t.id === id);
    if (type?.isPreset) return;
    if (type && type.usageCount > 0) {
      alert("Cannot delete this type because it is currently being used by assets.");
      return;
    }
    setAssetTypes(prev => prev.filter(t => t.id !== id));
  };

  const openEdit = (type: AssetType) => {
    if (type.isPreset) return;
    setEditingType(type);
    setFormData({ ...type });
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Asset Types</h2>
          <p className="text-slate-500 font-medium mt-1">Manage definitions and visibility for all project assets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all uppercase tracking-wide"
        >
          <Plus size={18} strokeWidth={3} />
          Add Asset Type
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">In Use</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assetTypes.map((type) => {
              const IconComp = IconRegistry[type.iconName] || Building2;
              const project = projects.find(p => p.id === type.visibility);
              
              return (
                <tr key={type.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type.isPreset ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                        <IconComp size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{type.name}</p>
                        {type.isPreset && <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">System Default</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {type.visibility === 'global' ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                        <Globe size={14} />
                        <span className="text-xs font-bold uppercase tracking-tight">Global</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                        <Lock size={14} />
                        <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[120px]">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-slate-700">{type.usageCount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!type.isPreset && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(type)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(type.id)}
                          className={`p-2 text-slate-400 transition-colors rounded-lg ${type.usageCount > 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                    {type.isPreset && (
                      <span className="text-xs text-slate-300 font-medium pr-2 italic">Immutable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">{editingType ? 'Edit Type' : 'New Asset Type'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50"
                  placeholder="e.g. Rack, Terminal..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Visibility</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50"
                  value={formData.visibility}
                  onChange={e => setFormData({ ...formData, visibility: e.target.value })}
                >
                  <option value="global">Global (All Projects)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>Private: {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Select Icon</label>
                <div className="grid grid-cols-4 gap-4">
                  {Object.keys(IconRegistry).map(key => {
                    const Icon = IconRegistry[key];
                    return (
                      <button 
                        key={key}
                        onClick={() => setFormData({ ...formData, iconName: key })}
                        className={`p-4 rounded-xl flex items-center justify-center border-2 transition-all ${formData.iconName === key ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-300 text-slate-400'}`}
                      >
                        <Icon size={24} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} strokeWidth={3} />
                {editingType ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

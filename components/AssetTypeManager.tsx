
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Lock, 
  // Base Icons
  Building2, 
  Layers, 
  Maximize, 
  DoorOpen, 
  MoreVertical,
  Search, 
  Check, 
  X, 
  LucideIcon, 
  // Expanded Icon Set
  Home, Factory, Store, Landmark, Warehouse, Tent,
  Thermometer, Droplets, Wind, Sun, Cloud, Leaf, Zap, Lightbulb, Fan,
  Cpu, Server, Wifi, Router, Monitor, Smartphone, Printer, Camera, Video,
  Shield, Siren, FireExtinguisher,
  Truck, Car, Bike, Ship, Plane, Box, Container,
  User, Users, ShoppingCart, Briefcase, Coffee, Wrench, Hammer, MapPin, Flag,
  Speaker, Tv, Mic, Anchor, Archive, Armchair, Bath, Bed, Bell,
  Bike as Bicycle, Bus, Calculator, Calendar, Cast, CircleDollarSign,
  Clipboard, Clock, Compass, Database, Disc, DollarSign, Dumbbell,
  Eye, FileText, Film, Filter, Fingerprint, Flame, Flashlight,
  Flower, Folder, Fuel, Gamepad2, Gauge, Gift, Glasses, GraduationCap,
  HardDrive, Headphones, Heart, Highlighter, Hourglass, Image, Infinity,
  Info, Key, Keyboard, Lamp, Laptop, LifeBuoy, Link, LockOpen,
  Mail, Map, Medal, Megaphone, Menu, MessageCircle, Mic2, Microscope,
  Moon, Mouse, Music, Navigation, Network, Newspaper, Package, Palette,
  Paperclip, Pause, Phone, PieChart, Pin, Play, Plug, Pocket, Power,
  Radio, Receipt, RefreshCcw, Repeat, Rocket, RotateCw, Rss, Ruler,
  Save, Scale, Scissors, ScreenShare, SearchCheck, Send, Settings,
  Share2, Sheet, ShoppingBag, Shovel, Shuffle, Sidebar, Signal,
  Skull, Slash, Sliders, Smile, Snowflake, Sofa, Sparkles, Speaker as SpeakerIcon,
  Star, Stethoscope, StopCircle, StretchHorizontal, SunMedium, Sunrise, Sunset,
  SwitchCamera, Table, Tablet, Tag, Target, Terminal, ThumbsUp, Ticket,
  Timer, ToggleLeft, ToggleRight, Tornado, TrafficCone, Train,
  Trash, TreeDeciduous, TreePine, Trophy, Umbrella, Unlock, Upload,
  Usb, UserCheck, UserPlus, UserMinus, UserX, Voicemail, Volume, Volume2,
  Wallet, Watch, Webcam, Weight, Wine, WrapText, ZoomIn
} from 'lucide-react';
import { AssetType, IoTProject } from '../types';

// Expanded Icon Registry
const IconRegistry: Record<string, LucideIcon> = {
  // Structure & Places
  'Building2': Building2,
  'Home': Home,
  'Factory': Factory,
  'Store': Store,
  'Landmark': Landmark,
  'Warehouse': Warehouse,
  'Tent': Tent,
  'Building': Building2,
  
  // Spaces & Zones
  'Layers': Layers,
  'Maximize': Maximize,
  'DoorOpen': DoorOpen,
  'MapPin': MapPin,
  'Flag': Flag,
  'Map': Map,
  'Navigation': Navigation,

  // Environment & Nature
  'Thermometer': Thermometer,
  'Droplets': Droplets,
  'Wind': Wind,
  'Sun': Sun,
  'Cloud': Cloud,
  'Leaf': Leaf,
  'Zap': Zap,
  'Lightbulb': Lightbulb,
  'Fan': Fan,
  'Flower': Flower,
  'TreeDeciduous': TreeDeciduous,
  'TreePine': TreePine,
  'Snowflake': Snowflake,
  'Flame': Flame,
  'Sunset': Sunset,

  // IT & Electronics
  'Cpu': Cpu,
  'Server': Server,
  'Wifi': Wifi,
  'Router': Router,
  'Monitor': Monitor,
  'Smartphone': Smartphone,
  'Laptop': Laptop,
  'Tablet': Tablet,
  'Printer': Printer,
  'Camera': Camera,
  'Video': Video,
  'Webcam': Webcam,
  'Keyboard': Keyboard,
  'Mouse': Mouse,
  'HardDrive': HardDrive,
  'Database': Database,
  'Network': Network,
  'Signal': Signal,

  // Security & Safety
  'Lock': Lock,
  'Unlock': Unlock,
  'Shield': Shield,
  'Siren': Siren,
  'FireExtinguisher': FireExtinguisher,
  'Key': Key,
  'Fingerprint': Fingerprint,
  'Eye': Eye,
  'LifeBuoy': LifeBuoy,

  // Logistics & Transport
  'Truck': Truck,
  'Car': Car,
  'Bike': Bike,
  'Bus': Bus,
  'Train': Train,
  'Ship': Ship,
  'Plane': Plane,
  'Rocket': Rocket,
  'Box': Box,
  'Package': Package,
  'Container': Container,
  'Archive': Archive,
  'Anchor': Anchor,

  // Furniture & Objects
  'Armchair': Armchair,
  'Sofa': Sofa,
  'Bed': Bed,
  'Bath': Bath,
  'Lamp': Lamp,
  'Table': Table,
  'Trash2': Trash2,
  'Umbrella': Umbrella,
  'Clock': Clock,
  'Watch': Watch,
  'Hourglass': Hourglass,
  'Timer': Timer,

  // Tools & Operations
  'Wrench': Wrench,
  'Hammer': Hammer,
  'Settings': Settings,
  'Sliders': Sliders,
  'Gauge': Gauge,
  'Compass': Compass,
  'Ruler': Ruler,
  'Scissors': Scissors,
  'Clipboard': Clipboard,
  'FileText': FileText,
  'Search': Search,
  'Filter': Filter,
  'Power': Power,
  'Plug': Plug,
  'Usb': Usb,
  'Battery': Zap, // Using Zap as placeholder for battery if Battery not explicit
  'Flashlight': Flashlight,

  // People & User
  'User': User,
  'Users': Users,
  'UserCheck': UserCheck,
  'UserPlus': UserPlus,
  'Smile': Smile,
  'Heart': Heart,
  'ThumbsUp': ThumbsUp,
  'Stethoscope': Stethoscope,
  'GraduationCap': GraduationCap,

  // Commercial & Retail
  'ShoppingCart': ShoppingCart,
  'ShoppingBag': ShoppingBag,
  'Briefcase': Briefcase,
  'Calculator': Calculator,
  'DollarSign': DollarSign,
  'CircleDollarSign': CircleDollarSign,
  'CreditCard': Wallet, // Using Wallet as proxy
  'Receipt': Receipt,
  'Tag': Tag,
  'Ticket': Ticket,
  'Gift': Gift,
  'Trophy': Trophy,
  'Medal': Medal,

  // Food & Drink
  'Coffee': Coffee,
  'Wine': Wine,

  // Media & Audio
  'Speaker': Speaker,
  'Mic': Mic,
  'Headphones': Headphones,
  'Radio': Radio,
  'Tv': Tv,
  'Film': Film,
  'Music': Music,
  'Image': Image,
  'Play': Play,
  'Pause': Pause,
  'Volume': Volume2,
  'Cast': Cast,
  'Gamepad': Gamepad2,

  // Misc
  'Link': Link,
  'Paperclip': Paperclip,
  'Pin': Pin,
  'Bell': Bell,
  'Megaphone': Megaphone,
  'Mail': Mail,
  'MessageCircle': MessageCircle,
  'Phone': Phone,
  'Share': Share2,
  'Info': Info,
  'Sparkles': Sparkles,
  'Ghost': Skull, // Mapping Skull
  'Palette': Palette,
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
  const [iconSearch, setIconSearch] = useState('');

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
    setIconSearch('');
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
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-xl font-black text-slate-900">{editingType ? 'Edit Type' : 'New Asset Type'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar flex-grow pr-1">
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
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Icon</label>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="Search icons..." 
                        className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={iconSearch}
                        onChange={e => setIconSearch(e.target.value)}
                     />
                  </div>
                </div>
                
                <div className="h-64 overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(IconRegistry)
                      .filter(key => key.toLowerCase().includes(iconSearch.toLowerCase()))
                      .map(key => {
                        const Icon = IconRegistry[key];
                        const isSelected = formData.iconName === key;
                        return (
                          <button 
                            key={key}
                            title={key}
                            onClick={() => setFormData({ ...formData, iconName: key })}
                            className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-blue-600 text-white shadow-md scale-105' 
                                : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                          </button>
                        )
                    })}
                  </div>
                  {Object.keys(IconRegistry).filter(key => key.toLowerCase().includes(iconSearch.toLowerCase())).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <Search size={24} className="mb-2 opacity-50" />
                          <span className="text-[10px] font-bold uppercase">No icons found</span>
                      </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 shrink-0">
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
    
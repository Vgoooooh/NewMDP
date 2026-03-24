
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Check, 
  ChevronDown, 
  Search, 
  AlertTriangle, 
  MonitorSmartphone,
  LayoutTemplate,
  Settings2,
  Box,
  // Icon Imports
  Building2, Layers, Maximize, DoorOpen, Home, Factory, Store, Landmark, Warehouse, Tent,
  Thermometer, Droplets, Wind, Sun, Cloud, Leaf, Zap, Lightbulb, Fan,
  Cpu, Server, Wifi, Router, Monitor, Smartphone, Printer, Camera, Video,
  Shield, Siren, FireExtinguisher, Truck, Car, Bike, Ship, Plane, Container,
  User, Users, ShoppingCart, Briefcase, Coffee, Wrench, Hammer, MapPin, Flag,
  Speaker, Tv, Mic, Anchor, Archive, Armchair, Bath, Bed, Bell,
  Bus, Calculator, Calendar, Cast, CircleDollarSign,
  Clipboard, Clock, Compass, Database, Disc, DollarSign, Dumbbell,
  Eye, FileText, Film, Filter, Fingerprint, Flame, Flashlight,
  Flower, Folder, Fuel, Gamepad2, Gauge, Gift, Glasses, GraduationCap,
  HardDrive, Headphones, Heart, Highlighter, Hourglass, Image, Infinity,
  Info, Key, Keyboard, Lamp, Laptop, LifeBuoy, Link, LockOpen, Lock,
  Mail, Map, Medal, Megaphone, Menu, MessageCircle, Mic2, Microscope,
  Moon, Mouse, Music, Navigation, Network, Newspaper, Package, Palette,
  Paperclip, Pause, Phone, PieChart, Pin, Play, Plug, Pocket, Power,
  Radio, Receipt, RefreshCcw, Repeat, Rocket, RotateCw, Rss, Ruler,
  Save, Scale, Scissors, ScreenShare, SearchCheck, Send, Settings,
  Share2, Sheet, ShoppingBag, Shovel, Shuffle, Sidebar, Signal,
  Skull, Slash, Sliders, Smile, Snowflake, Sofa, Sparkles,
  Star, Stethoscope, StopCircle, StretchHorizontal, SunMedium, Sunrise, Sunset,
  SwitchCamera, Table, Tablet, Tag, Target, Terminal, ThumbsUp, Ticket,
  Timer, ToggleLeft, ToggleRight, Tornado, TrafficCone, Train,
  Trash, TreeDeciduous, TreePine, Trophy, Umbrella, Unlock, Upload,
  Usb, UserCheck, UserPlus, UserMinus, UserX, Voicemail, Volume, Volume2,
  Wallet, Watch, Webcam, Weight, Wine, WrapText, ZoomIn, 
  LucideIcon
} from 'lucide-react';

// --- Icon Registry ---
const IconRegistry: Record<string, LucideIcon> = {
  'Box': Box, 'Building2': Building2, 'Layers': Layers, 'Maximize': Maximize, 'DoorOpen': DoorOpen,
  'Home': Home, 'Factory': Factory, 'Store': Store, 'Landmark': Landmark, 'Warehouse': Warehouse, 'Tent': Tent,
  'Thermometer': Thermometer, 'Droplets': Droplets, 'Wind': Wind, 'Sun': Sun, 'Cloud': Cloud, 'Leaf': Leaf,
  'Zap': Zap, 'Lightbulb': Lightbulb, 'Fan': Fan, 'Cpu': Cpu, 'Server': Server, 'Wifi': Wifi, 'Router': Router,
  'Monitor': Monitor, 'Smartphone': Smartphone, 'Printer': Printer, 'Camera': Camera, 'Video': Video,
  'Shield': Shield, 'Siren': Siren, 'FireExtinguisher': FireExtinguisher, 'Truck': Truck, 'Car': Car,
  'Bike': Bike, 'Ship': Ship, 'Plane': Plane, 'Container': Container, 'User': User, 'Users': Users,
  'ShoppingCart': ShoppingCart, 'Briefcase': Briefcase, 'Coffee': Coffee, 'Wrench': Wrench, 'Hammer': Hammer,
  'MapPin': MapPin, 'Flag': Flag, 'Speaker': Speaker, 'Tv': Tv, 'Mic': Mic, 'Anchor': Anchor,
  'Archive': Archive, 'Armchair': Armchair, 'Bath': Bath, 'Bed': Bed, 'Bell': Bell, 'Bus': Bus,
  'Calculator': Calculator, 'Calendar': Calendar, 'Cast': Cast, 'CircleDollarSign': CircleDollarSign,
  'Clipboard': Clipboard, 'Clock': Clock, 'Compass': Compass, 'Database': Database, 'Disc': Disc,
  'DollarSign': DollarSign, 'Dumbbell': Dumbbell, 'Eye': Eye, 'FileText': FileText, 'Film': Film,
  'Filter': Filter, 'Fingerprint': Fingerprint, 'Flame': Flame, 'Flashlight': Flashlight, 'Flower': Flower,
  'Folder': Folder, 'Fuel': Fuel, 'Gamepad2': Gamepad2, 'Gauge': Gauge, 'Gift': Gift, 'Glasses': Glasses,
  'GraduationCap': GraduationCap, 'HardDrive': HardDrive, 'Headphones': Headphones, 'Heart': Heart,
  'Highlighter': Highlighter, 'Hourglass': Hourglass, 'Image': Image, 'Infinity': Infinity, 'Info': Info,
  'Key': Key, 'Keyboard': Keyboard, 'Lamp': Lamp, 'Laptop': Laptop, 'LifeBuoy': LifeBuoy, 'Link': Link,
  'Lock': Lock, 'LockOpen': LockOpen, 'Mail': Mail, 'Map': Map, 'Medal': Medal, 'Megaphone': Megaphone,
  'Menu': Menu, 'MessageCircle': MessageCircle, 'Mic2': Mic2, 'Microscope': Microscope, 'Moon': Moon,
  'Mouse': Mouse, 'Music': Music, 'Navigation': Navigation, 'Network': Network, 'Newspaper': Newspaper,
  'Package': Package, 'Palette': Palette, 'Paperclip': Paperclip, 'Pause': Pause, 'Phone': Phone,
  'PieChart': PieChart, 'Pin': Pin, 'Play': Play, 'Plug': Plug, 'Pocket': Pocket, 'Power': Power,
  'Radio': Radio, 'Receipt': Receipt, 'RefreshCcw': RefreshCcw, 'Repeat': Repeat, 'Rocket': Rocket,
  'RotateCw': RotateCw, 'Rss': Rss, 'Ruler': Ruler, 'Save': Save, 'Scale': Scale, 'Scissors': Scissors,
  'ScreenShare': ScreenShare, 'SearchCheck': SearchCheck, 'Send': Send, 'Settings': Settings,
  'Share2': Share2, 'Sheet': Sheet, 'ShoppingBag': ShoppingBag, 'Shovel': Shovel, 'Shuffle': Shuffle,
  'Sidebar': Sidebar, 'Signal': Signal, 'Skull': Skull, 'Slash': Slash, 'Sliders': Sliders, 'Smile': Smile,
  'Snowflake': Snowflake, 'Sofa': Sofa, 'Sparkles': Sparkles, 'Star': Star, 'Stethoscope': Stethoscope,
  'StopCircle': StopCircle, 'StretchHorizontal': StretchHorizontal, 'SunMedium': SunMedium, 'Sunrise': Sunrise,
  'Sunset': Sunset, 'SwitchCamera': SwitchCamera, 'Table': Table, 'Tablet': Tablet, 'Tag': Tag,
  'Target': Target, 'Terminal': Terminal, 'ThumbsUp': ThumbsUp, 'Ticket': Ticket, 'Timer': Timer,
  'ToggleLeft': ToggleLeft, 'ToggleRight': ToggleRight, 'Tornado': Tornado, 'TrafficCone': TrafficCone,
  'Train': Train, 'Trash': Trash, 'TreeDeciduous': TreeDeciduous, 'TreePine': TreePine, 'Trophy': Trophy,
  'Umbrella': Umbrella, 'Unlock': Unlock, 'Upload': Upload, 'Usb': Usb, 'UserCheck': UserCheck,
  'UserPlus': UserPlus, 'UserMinus': UserMinus, 'UserX': UserX, 'Voicemail': Voicemail, 'Volume': Volume,
  'Volume2': Volume2, 'Wallet': Wallet, 'Watch': Watch, 'Webcam': Webcam, 'Weight': Weight, 'Wine': Wine,
  'WrapText': WrapText, 'ZoomIn': ZoomIn
};

interface WidgetEditorModalProps {
  widget: any;
  onClose: () => void;
  onSave: (updatedWidget: any) => void;
}

// Mock Data for Source Selection
const MOCK_CONFLICT_SOURCES = [
  { id: 'dev-001', name: 'AM308 - 1', sn: '123516912318008', type: 'Telemetry', value: '24.5°C' },
  { id: 'dev-002', name: 'AM308 - 2', sn: '123516912318009', type: 'Telemetry', value: '23.8°C' },
  { id: 'dev-003', name: 'AM308 - 3', sn: '123516912318010', type: 'Telemetry', value: '24.1°C' },
  { id: 'dev-004', name: 'AM308 - 4', sn: '123516912318011', type: 'Telemetry', value: '25.0°C' },
  { id: 'dev-005', name: 'AM308 - 5', sn: '123516912318012', type: 'Telemetry', value: '24.2°C' },
];

const DEFAULT_PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#64748B', '#000000', '#FFFFFF'
];

// --- Color Helpers ---
const hexToHsv = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; 
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToHex = (h: number, s: number, v: number) => {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s / 100);
  const q = v * (1 - f * s / 100);
  const t = v * (1 - (1 - f) * s / 100);
  const v_ = v; 
  // Map 0-100 inputs to 0-1
  const pv = p / 100; const qv = q / 100; const tv = t / 100; const vv = v_ / 100;

  switch (i % 6) {
    case 0: r = vv; g = tv; b = pv; break;
    case 1: r = qv; g = vv; b = pv; break;
    case 2: r = pv; g = vv; b = tv; break;
    case 3: r = pv; g = qv; b = vv; break;
    case 4: r = tv; g = pv; b = vv; break;
    case 5: r = vv; g = pv; b = qv; break;
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

interface DataPointItem {
  label: string;
  value: string;
  hasConflict?: boolean;
}

interface DataPointGroup {
  category: string;
  items: DataPointItem[];
}

export const WidgetEditorModal: React.FC<WidgetEditorModalProps> = ({ widget, onClose, onSave }) => {
  // Form State
  const [title, setTitle] = useState(widget.title || '');
  // Store full hex color
  const [selectedColor, setSelectedColor] = useState(widget.color || '#3B82F6'); 
  const [selectedIconName, setSelectedIconName] = useState(widget.icon || 'Box');
  const [sourceMode, setSourceMode] = useState<'device' | 'asset'>('device');
  const [previewSize, setPreviewSize] = useState('Medium');
  
  // Picker States
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  
  // HSV State for Picker
  const [hsv, setHsv] = useState(hexToHsv(selectedColor));

  // Refs for click outside
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  // Data Source State
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ label: string, value: string, hasConflict?: boolean } | null>(null);
  const [resolvedSourceDevice, setResolvedSourceDevice] = useState<any>(null);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
  const [showSourceResolveModal, setShowSourceResolveModal] = useState(false);

  // Mock Options (same as before)
  const deviceOptions = [{ id: 'dev-1', name: 'AM308 - Main Hall' }, { id: 'dev-2', name: 'EM300 - Server Room' }];
  const assetOptions = [{ id: 'asset-1', name: 'Terminal T1' }, { id: 'asset-2', name: 'Gate 1' }];
  
  const deviceDataPoints: DataPointGroup[] = [
    { category: 'Telemetry Data', items: [{ label: 'Temperature', value: 'temp' }, { label: 'Humidity', value: 'hum' }, { label: 'CO2 Level', value: 'co2' }] },
    { category: 'Configuration', items: [{ label: 'Reporting Interval', value: 'interval' }, { label: 'LoRaWAN Work Mode', value: 'work_mode' }] }
  ];
  const assetDataPoints: DataPointGroup[] = [
    { category: 'Asset Properties', items: [{ label: 'People Count Avg', value: 'attr_ppl_avg' }, { label: 'Air Quality Score', value: 'attr_aqi' }] },
    { category: 'Inherited Telemetry', items: [{ label: 'Temperature', value: 'tele_temp', hasConflict: true }, { label: 'Humidity', value: 'tele_hum', hasConflict: true }, { label: 'Illumination', value: 'tele_lux' }] }
  ];
  const currentDataOptions = sourceMode === 'device' ? deviceDataPoints : assetDataPoints;

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) setIsColorPickerOpen(false);
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) setIsIconPickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update HSV when selectedColor changes externally
  useEffect(() => {
    setHsv(hexToHsv(selectedColor));
  }, [selectedColor]);

  // Color Picker Logic
  const handleSaturationChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newS = x * 100;
    const newV = (1 - y) * 100;
    const newHex = hsvToHex(hsv.h, newS, newV);
    setHsv({ ...hsv, s: newS, v: newV });
    setSelectedColor(newHex);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = parseInt(e.target.value);
    const newHex = hsvToHex(newH, hsv.s, hsv.v);
    setHsv({ ...hsv, h: newH });
    setSelectedColor(newHex);
  };

  // Handlers
  const handleSave = () => {
    onSave({ ...widget, title, color: selectedColor, icon: selectedIconName });
    onClose();
  };

  const handleDataSelect = (item: any) => {
    if (item.hasConflict) {
      setIsDataDropdownOpen(false);
      setShowSourceResolveModal(true);
      setSelectedDataPoint(item);
    } else {
      setSelectedDataPoint(item);
      setResolvedSourceDevice(null);
      setIsDataDropdownOpen(false);
    }
  };

  const handleResolveConflict = (device: any) => {
    setResolvedSourceDevice(device);
    setShowSourceResolveModal(false);
  };

  // Derived Values
  const SelectedIcon = IconRegistry[selectedIconName] || Box;
  const filteredIcons = useMemo(() => 
    Object.keys(IconRegistry).filter(name => name.toLowerCase().includes(iconSearch.toLowerCase())),
  [iconSearch]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-[1200px] h-[750px] rounded-3xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* LEFT: Preview Section */}
        <div className="w-[65%] bg-slate-50 border-r border-slate-200 flex flex-col relative">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Preview</h3>
          </div>
          <div className="flex justify-center pt-8 pb-4">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['Mini', 'Small', 'Medium', 'Large'].map(size => (
                <button
                  key={size}
                  onClick={() => setPreviewSize(size)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${previewSize === size ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center p-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="w-[400px] h-[280px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 ring-1 ring-slate-900/5">
              <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title || 'Widget Title'}</h4>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: selectedColor, backgroundColor: `${selectedColor}15` }}>
                   <SelectedIcon size={18} />
                </div>
              </div>
              <div className="flex-grow p-8 flex flex-col justify-center items-center gap-4">
                 {selectedDataPoint ? (
                   <>
                     <div className="text-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{selectedDataPoint.label}</span>
                        <div className="flex items-baseline gap-1 justify-center">
                           <span className="text-5xl font-black" style={{ color: selectedColor }}>
                             {sourceMode === 'asset' && selectedDataPoint.hasConflict && !resolvedSourceDevice ? '--' : '34%'}
                           </span>
                           <span className="text-sm font-bold text-slate-400">r.h.</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-medium">2026-01-14 16:49</span>
                        {resolvedSourceDevice && (
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">Src: {resolvedSourceDevice.name}</span>
                        )}
                     </div>
                   </>
                 ) : (
                   <span className="text-sm font-medium text-slate-300">Select data source to preview</span>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Settings Section */}
        <div className="w-[35%] flex flex-col bg-white">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="text-xl font-black text-slate-900">Configuration</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
            
            {/* Appearance Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <LayoutTemplate size={18} className="text-blue-600" />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Appearance</h4>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="Enter widget title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Advanced Color Picker */}
                <div ref={colorPickerRef} className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Color</label>
                  <button 
                    onClick={() => { setIsColorPickerOpen(!isColorPickerOpen); setIsIconPickerOpen(false); }}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: selectedColor }}></div>
                      <span className="text-xs font-bold text-slate-600 uppercase">{selectedColor}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {isColorPickerOpen && (
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-64 animate-in fade-in zoom-in-95 origin-top-left">
                      {/* Saturation/Value Box */}
                      <div 
                        className="w-full h-32 rounded-xl mb-4 relative cursor-crosshair shadow-inner"
                        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)`, backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)' }}
                        onMouseDown={(e) => {
                          // Simple click handler, full drag implementation requires global listeners
                          handleSaturationChange(e);
                        }}
                      >
                        <div 
                          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -ml-2 -mt-2 pointer-events-none"
                          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
                        ></div>
                      </div>

                      {/* Hue Slider */}
                      <div className="mb-4">
                        <input 
                          type="range" min="0" max="360" 
                          value={hsv.h} 
                          onChange={handleHueChange}
                          className="w-full h-3 rounded-full appearance-none cursor-pointer"
                          style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
                        />
                      </div>

                      {/* Hex Input */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">HEX</span>
                        <input 
                          type="text" 
                          value={selectedColor} 
                          onChange={(e) => { setSelectedColor(e.target.value); setHsv(hexToHsv(e.target.value)); }}
                          className="flex-grow px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 uppercase"
                        />
                      </div>

                      {/* Swatches */}
                      <div className="grid grid-cols-6 gap-2 pt-4 border-t border-slate-100">
                        {DEFAULT_PRESET_COLORS.map(c => (
                          <button 
                            key={c}
                            onClick={() => { setSelectedColor(c); setHsv(hexToHsv(c)); }}
                            className={`w-6 h-6 rounded-md border transition-all ${selectedColor.toLowerCase() === c.toLowerCase() ? 'border-slate-400 scale-110 shadow-sm' : 'border-transparent hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced Icon Picker */}
                <div ref={iconPickerRef} className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Icon</label>
                  <button 
                    onClick={() => { setIsIconPickerOpen(!isIconPickerOpen); setIsColorPickerOpen(false); }}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                        <SelectedIcon size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{selectedIconName}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {isIconPickerOpen && (
                    <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 animate-in fade-in zoom-in-95 origin-top-right">
                      <div className="relative mb-3">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search icons..." 
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {filteredIcons.map(iconKey => {
                          const IconComp = IconRegistry[iconKey];
                          return (
                            <button
                              key={iconKey}
                              onClick={() => { setSelectedIconName(iconKey); setIsIconPickerOpen(false); }}
                              title={iconKey}
                              className={`aspect-square rounded-lg flex items-center justify-center transition-all ${selectedIconName === iconKey ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'}`}
                            >
                              <IconComp size={18} strokeWidth={2} />
                            </button>
                          )
                        })}
                        {filteredIcons.length === 0 && (
                          <div className="col-span-5 py-4 text-center text-[10px] text-slate-400 font-bold uppercase">No icons found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Data Source Section (Unchanged logic, kept for context) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings2 size={18} className="text-blue-600" />
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Data Source</h4>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => { setSourceMode('device'); setSelectedSourceId(''); setSelectedDataPoint(null); }} className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${sourceMode === 'device' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Device</button>
                  <button onClick={() => { setSourceMode('asset'); setSelectedSourceId(''); setSelectedDataPoint(null); }} className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${sourceMode === 'asset' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Asset</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{sourceMode === 'device' ? 'Select Device' : 'Select Asset'}</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none"
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(e.target.value)}
                  >
                    <option value="">-- Choose {sourceMode === 'device' ? 'Device' : 'Asset'} --</option>
                    {(sourceMode === 'device' ? deviceOptions : assetOptions).map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className={`transition-all duration-300 ${selectedSourceId ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Point</label>
                <div className="relative">
                  <button onClick={() => setIsDataDropdownOpen(!isDataDropdownOpen)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 flex items-center justify-between group hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-2">
                      {sourceMode === 'asset' && selectedDataPoint?.hasConflict && !resolvedSourceDevice && <AlertTriangle size={14} className="text-amber-500" />}
                      <span>{selectedDataPoint ? selectedDataPoint.label : 'Select Data...'}{resolvedSourceDevice && <span className="ml-2 text-[10px] text-slate-400 font-normal">via {resolvedSourceDevice.name}</span>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       {sourceMode === 'asset' && selectedDataPoint?.hasConflict && !resolvedSourceDevice && <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Conflict</span>}
                       <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDataDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isDataDropdownOpen && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in slide-in-from-bottom-2">
                      {currentDataOptions.map((group, gIdx) => (
                        <div key={gIdx} className="border-b border-slate-50 last:border-0">
                          <div className="px-4 py-2 bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest sticky top-0 backdrop-blur-sm">{group.category}</div>
                          {group.items.map((item, iIdx) => (
                            <button key={iIdx} onClick={() => handleDataSelect(item)} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-between group/item">
                              <span className="flex items-center gap-2"><MonitorSmartphone size={14} className="text-slate-300 group-hover/item:text-blue-400" />{item.label}</span>
                              {item.hasConflict && <div className="flex items-center gap-1 text-amber-500"><AlertTriangle size={12} /><span className="text-[9px] font-black uppercase tracking-tight">Multi-source</span></div>}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {sourceMode === 'asset' && selectedDataPoint?.hasConflict && !resolvedSourceDevice && <p className="mt-2 text-[10px] font-medium text-amber-600 flex items-center gap-1.5 animate-in slide-in-from-top-1"><AlertTriangle size={12} /> This data point has multiple sources. Please select one.</p>}
                {resolvedSourceDevice && <p className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 animate-in slide-in-from-top-1"><Check size={12} /> Resolved: Using data from {resolvedSourceDevice.name}</p>}
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0 bg-white">
            <button onClick={onClose} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all border border-slate-200">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Check size={20} strokeWidth={3} /> Save Widget</button>
          </div>
        </div>
      </div>

      {/* --- SECONDARY MODAL: SOURCE RESOLUTION (Unchanged) --- */}
      {showSourceResolveModal && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[500px]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><AlertTriangle size={20} /></div>
                <div><h3 className="text-sm font-black text-slate-900">Select Data Source</h3><p className="text-xs text-slate-500 font-medium mt-0.5">Multiple devices provide <span className="font-bold text-slate-800">{selectedDataPoint?.label}</span> data.</p></div>
              </div>
              <button onClick={() => setShowSourceResolveModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-2 bg-slate-50 border-b border-slate-100"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search devices by SN or Name..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-400" /></div></div>
            <div className="flex-grow overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-6 py-3 w-10"></th><th className="px-6 py-3">Device Name</th><th className="px-6 py-3">Device SN</th><th className="px-6 py-3 text-right">Latest Value</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_CONFLICT_SOURCES.map(source => (
                    <tr key={source.id} onClick={() => handleResolveConflict(source)} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
                      <td className="px-6 py-4"><div className="w-4 h-4 rounded border border-slate-300 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all"><Check size={10} className="opacity-0 group-hover:opacity-100" strokeWidth={4} /></div></td>
                      <td className="px-6 py-4"><span className="text-xs font-bold text-slate-700">{source.name}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono text-slate-500">{source.sn}</span></td>
                      <td className="px-6 py-4 text-right"><span className="text-xs font-black text-slate-900">{source.value}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400"><span>5 devices found</span><div className="flex gap-2"><button className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled>Prev</button><div className="flex items-center justify-center bg-blue-600 text-white w-6 h-6 rounded shadow-sm">1</div><button className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100">Next</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

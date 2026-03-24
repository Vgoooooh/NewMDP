
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Maximize2,
  Layout,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  Sun,
  CloudRain,
  Box
} from 'lucide-react';
import { WidgetEditorModal } from './WidgetEditorModal';

interface DashboardCanvasProps {
  dashboard: {
    id: string;
    name: string;
    description: string;
    updatedAt: string;
  };
  onBack: () => void;
}

// Icon Map for rendering string-based icons
const IconMap: Record<string, any> = {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  Sun,
  CloudRain,
  Box
};

// Mock Widget Component
const Widget = ({ 
  title, 
  children, 
  className = "", 
  isEditing,
  onDelete,
  onEdit
}: { 
  title?: string; 
  children?: React.ReactNode; 
  className?: string; 
  isEditing: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}) => (
  <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 relative group h-full flex flex-col overflow-hidden ${isEditing ? 'hover:border-blue-500 hover:ring-1 hover:ring-blue-500 cursor-move border-slate-200' : 'border-slate-100 hover:shadow-md' } ${className}`}>
    {/* Header */}
    {title && (
      <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
      </div>
    )}
    
    {/* Edit Controls Overlay */}
    {isEditing && (
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
          className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded-lg shadow-sm hover:bg-slate-50"
        >
          <Edit3 size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-red-500 rounded-lg shadow-sm hover:bg-red-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )}

    {/* Content */}
    <div className="flex-grow p-5 relative">
      {children}
    </div>
  </div>
);

export const DashboardCanvas: React.FC<DashboardCanvasProps> = ({ dashboard, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  
  // Mock Data for Widgets - Icons are now string keys
  const [widgets, setWidgets] = useState([
    { id: 'w1', type: 'map', title: 'AM319 9-in-1 IAQ Sensor', colSpan: 'col-span-1 md:col-span-2 lg:col-span-1 row-span-2' },
    { id: 'w2', type: 'score', title: 'Air Quality Level', colSpan: 'col-span-1' },
    { id: 'w3', type: 'metric', title: 'Indoor Humidity Index', colSpan: 'col-span-1', value: '34%r.h.', icon: 'Droplets' },
    { id: 'w4', type: 'metric', title: 'Indoor CO2 Index', colSpan: 'col-span-1', value: '839ppm', icon: 'CloudRain' },
    { id: 'w5', type: 'metric', title: 'Indoor HCHO Index', colSpan: 'col-span-1', value: '0.01mg/m³', icon: 'Wind' },
    { id: 'w6', type: 'metric', title: 'Indoor Temperature Index', colSpan: 'col-span-1', value: '25.2°C', icon: 'Thermometer' },
    { id: 'w7', type: 'metric', title: 'Indoor PM10 Index', colSpan: 'col-span-1', value: '37μg/m³', icon: 'Activity' },
    { id: 'w8', type: 'metric', title: 'Indoor PM2.5 Index', colSpan: 'col-span-1', value: '34μg/m³', icon: 'Activity' },
    { id: 'w9', type: 'metric', title: 'Barometric Pressure', colSpan: 'col-span-1', value: '1016.3hPa', icon: 'Gauge' },
    { id: 'w10', type: 'chart', title: 'Indoor Temperature and Humidity', colSpan: 'col-span-1 md:col-span-2', chartType: 'line' },
    { id: 'w11', type: 'chart', title: 'Indoor PM10 and PM2.5 Index', colSpan: 'col-span-1 md:col-span-2', chartType: 'area' },
    { id: 'w12', type: 'gauge', title: 'Indoor Light Level', colSpan: 'col-span-1', value: 3 },
    { id: 'w13', type: 'gauge', title: 'Indoor TVOC LEVEL', colSpan: 'col-span-1', value: 50 },
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save layout would go here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Logic to revert changes would go here
  };

  const handleDeleteWidget = (id: string) => {
    if(window.confirm("Remove this widget?")) {
        setWidgets(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleWidgetUpdate = (updatedWidget: any) => {
    setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{dashboard.name}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isEditing ? 'Editing Mode' : 'Preview Mode'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-dashed border-blue-300 text-blue-600 rounded-xl text-xs font-black uppercase hover:bg-blue-50 transition-all">
                <Plus size={16} strokeWidth={3} /> Add Component
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <Save size={16} /> Save
              </button>
            </>
          ) : (
            <>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#6366f1] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4f46e5] shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                <Edit3 size={16} /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 max-w-[1600px] mx-auto">
          {widgets.map(widget => (
            <div key={widget.id} className={widget.colSpan}>
              <Widget 
                title={widget.title} 
                isEditing={isEditing} 
                onDelete={() => handleDeleteWidget(widget.id)}
                onEdit={() => setEditingWidgetId(widget.id)}
              >
                {/* Dynamic Mock Content based on Type */}
                {widget.type === 'map' && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop" 
                      alt="Office Map" 
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <div className="text-center">
                        <span className="text-xs text-slate-400 font-bold block mb-1">Device Status</span>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-sm font-black text-slate-700">Online</span>
                        </div>
                    </div>
                  </div>
                )}

                {widget.type === 'score' && (
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <span className="text-lg">😊</span>
                        </div>
                        <span className="text-2xl font-black text-slate-800">Excellent</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">2026-01-14 16:49</p>
                  </div>
                )}

                {widget.type === 'metric' && (
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                        {(() => {
                          // Dynamic Icon Resolution
                          const IconComp = widget.icon && IconMap[widget.icon as string] ? IconMap[widget.icon as string] : null;
                          return IconComp ? <IconComp size={20} className="text-slate-300" /> : null;
                        })()}
                        <span className="text-2xl font-medium text-slate-700">{widget.value}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">2026-01-14 16:49</p>
                  </div>
                )}

                {widget.type === 'chart' && (
                  <div className="h-48 flex items-end justify-between gap-1 px-2 pb-2 border-b border-slate-100 relative">
                     {/* Fake Chart Bars/Lines */}
                     {Array.from({length: 20}).map((_, i) => (
                         <div 
                            key={i} 
                            className={`w-full rounded-t-sm transition-all hover:opacity-80 ${widget.chartType === 'area' ? 'bg-emerald-200' : 'bg-indigo-300'}`} 
                            style={{ height: `${20 + Math.random() * 60}%` }}
                         ></div>
                     ))}
                     {widget.chartType === 'line' && (
                         <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-300"></div>
                     )}
                     <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-400 pt-2 font-mono">
                        <span>14:00</span>
                        <span>15:00</span>
                        <span>16:00</span>
                     </div>
                  </div>
                )}

                {widget.type === 'gauge' && (
                   <div className="h-full flex flex-col items-center justify-center pt-4">
                      <div className="relative w-32 h-16 overflow-hidden">
                         <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 border-t-indigo-500 border-l-indigo-500 rotate-45 box-border"></div>
                      </div>
                      <span className="text-3xl font-black text-slate-800 -mt-8">{widget.value}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Level</span>
                   </div>
                )}
              </Widget>
            </div>
          ))}
        </div>
      </div>

      {/* Widget Editor Modal */}
      {editingWidgetId && (
        <WidgetEditorModal 
          widget={widgets.find(w => w.id === editingWidgetId)} 
          onClose={() => setEditingWidgetId(null)} 
          onSave={handleWidgetUpdate} 
        />
      )}
    </div>
  );
};

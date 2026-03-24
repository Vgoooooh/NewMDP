
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutDashboard
} from 'lucide-react';
import { DashboardCanvas } from './DashboardCanvas';
import { DashboardCard, Dashboard } from './DashboardCard';

interface DashboardManagerProps {
  dashboards: Dashboard[];
  onUpdateDashboards: (dashboards: Dashboard[]) => void;
  selectedDashboard: Dashboard | null;
  onSelectDashboard: (dashboard: Dashboard | null) => void;
}

export const DashboardManager: React.FC<DashboardManagerProps> = ({ 
  dashboards, 
  onUpdateDashboards,
  selectedDashboard,
  onSelectDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (action: string, dashboard: Dashboard) => {
    if (action === 'Favorite') {
      const updated = dashboards.map(d => 
        d.id === dashboard.id ? { ...d, isFavorite: !d.isFavorite } : d
      );
      onUpdateDashboards(updated);
    } else if (action === 'Delete') {
      if (window.confirm(`Delete dashboard "${dashboard.name}"?`)) {
        onUpdateDashboards(dashboards.filter(d => d.id !== dashboard.id));
      }
    } else {
      alert(`${action} dashboard ${dashboard.id}`);
    }
  };

  const handleCreate = () => {
    const newDashboard: Dashboard = {
      id: `db-${Date.now()}`,
      name: 'New Dashboard',
      description: 'A new dashboard.',
      updatedAt: new Date().toISOString().slice(0, 10),
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop',
      isFavorite: false
    };
    onUpdateDashboards([...dashboards, newDashboard]);
  };

  if (selectedDashboard) {
    return <DashboardCanvas dashboard={selectedDashboard} onBack={() => onSelectDashboard(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard size={28} className="text-blue-600" />
            Dashboards
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Visualize your IoT data with customizable drag-and-drop boards.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search dashboards..."
              className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Create Board
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-8 overflow-y-auto bg-slate-50/50 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dashboards.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(dashboard => (
            <DashboardCard 
              key={dashboard.id}
              dashboard={dashboard}
              onClick={onSelectDashboard}
              onAction={handleAction}
            />
          ))}
          
          {/* Add New Card (Placeholder style) */}
          <div 
            onClick={handleCreate}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group min-h-[280px]"
          >
             <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
               <Plus size={32} strokeWidth={3} />
             </div>
             <h3 className="text-sm font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">Create New</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

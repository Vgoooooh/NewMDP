
import React, { useRef, useState, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Star, Clock } from 'lucide-react';

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  thumbnail: string;
  isFavorite: boolean;
}

interface DashboardCardProps {
  dashboard: Dashboard;
  onClick: (dashboard: Dashboard) => void;
  onAction: (action: string, dashboard: Dashboard) => void;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ dashboard, onClick, onAction, className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onAction(action, dashboard);
    setIsMenuOpen(false);
  };

  return (
    <div 
      onClick={() => onClick(dashboard)}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col overflow-hidden relative ${className}`}
    >
      {/* Thumbnail Area */}
      <div className="h-40 bg-slate-100 relative overflow-hidden">
        <img src={dashboard.thumbnail} alt={dashboard.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        {dashboard.isFavorite && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-sm animate-in zoom-in">
            <Star size={12} fill="white" />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{dashboard.name}</h3>
        </div>
        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">{dashboard.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Clock size={12} /> {dashboard.updatedAt}
          </div>
          
          {/* More Menu Trigger */}
          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div ref={menuRef} className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-bottom-right">
                <button onClick={(e) => handleActionClick(e, 'Edit')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left">
                  <Edit size={14} /> Edit Info
                </button>
                <button onClick={(e) => handleActionClick(e, 'Favorite')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-yellow-500 transition-colors text-left">
                  <Star size={14} /> {dashboard.isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button onClick={(e) => handleActionClick(e, 'Delete')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

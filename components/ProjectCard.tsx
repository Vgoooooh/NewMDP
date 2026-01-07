
import React from 'react';
import { Users, Cpu, Box, Calendar, ChevronRight } from 'lucide-react';
import { IoTProject, IoTProjectCategory } from '../types';
import { ProjectIcon } from './ProjectIcon';

interface ProjectCardProps {
  project: IoTProject;
  onClick?: (id: string) => void;
}

const GradientMap: Record<IoTProjectCategory, string> = {
  [IoTProjectCategory.SMART_BUILDING]: 'from-blue-500 to-indigo-600',
  [IoTProjectCategory.SMART_FARM]: 'from-emerald-400 to-teal-600',
  [IoTProjectCategory.FLEET_MANAGEMENT]: 'from-pink-500 to-rose-600',
  [IoTProjectCategory.ENERGY_MONITORING]: 'from-amber-400 to-orange-600',
  [IoTProjectCategory.INDUSTRIAL_IOT]: 'from-indigo-500 to-purple-700',
  [IoTProjectCategory.SMART_HOME]: 'from-sky-400 to-blue-600',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const gradientClass = GradientMap[project.category] || 'from-slate-400 to-slate-600';

  return (
    <div 
      onClick={() => onClick?.(project.id)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full overflow-hidden"
    >
      {/* Reduced Gradient Header Height */}
      <div className={`h-24 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center overflow-hidden`}>
        {/* Subtle Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
        <ProjectIcon category={project.category} size={40} white />
      </div>

      {/* Reduced padding and tightened vertical spacing */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
          {project.name}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
          <div className="flex flex-col items-center">
            <Cpu size={14} className="text-blue-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">{project.stats.deviceCount}</span>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Devices</span>
          </div>
          <div className="flex flex-col items-center">
            <Box size={14} className="text-purple-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">{project.stats.assetCount}</span>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Assets</span>
          </div>
          <div className="flex flex-col items-center">
            <Users size={14} className="text-orange-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">{project.stats.memberCount}</span>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Members</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between text-[10px] border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={12} />
          <span>{project.updatedAt}</span>
        </div>
        <button className="flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all">
          Enter Project <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  LayoutDashboard, 
  Cpu, 
  Box, 
  GitBranch, 
  Users, 
  Code2, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  BellRing,
  ChevronRight,
  Info,
  Plus,
  MoreVertical,
  ChevronDown,
  ArrowUpRight,
  Terminal
} from 'lucide-react';
import { IoTProject, ProjectTab, IoTProjectCategory, Workflow } from '../types';
import { ProjectIcon } from './ProjectIcon';
import { AssetModule } from './AssetModule';
import { DeviceManager } from './DeviceManager';
import { WorkflowManager } from './WorkflowManager';
import { DeveloperMode } from './DeveloperMode';

interface ProjectDetailViewProps {
  project: IoTProject;
  onUpdate: (updatedProject: IoTProject) => void;
  onDelete: (projectId: string) => void;
  onBack: () => void;
}

type InternalViewState = 'overview' | ProjectTab | 'developer-mode';

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onUpdate, onDelete, onBack }) => {
  const [currentInternalView, setCurrentInternalView] = useState<InternalViewState>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description,
    category: project.category
  });

  const workflowStats = {
    total: 48,
    active: 33
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = () => {
    onUpdate({
      ...project,
      name: editForm.name,
      description: editForm.description,
      category: editForm.category
    });
    setIsEditModalOpen(false);
  };

  const SummarySection = ({ title, icon: Icon, onEnter, children }: { title: string, icon: any, onEnter: () => void, children?: React.ReactNode }) => (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <Info size={14} className="text-slate-300 cursor-help" />
        </div>
        <button 
          onClick={onEnter}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-blue-600 font-bold text-xs hover:bg-blue-50 transition-all group"
        >
          Enter Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="flex flex-wrap gap-5 px-1">
        {children}
      </div>
    </div>
  );

  const StatBox = ({ 
    label, 
    value, 
    subLabel, 
    colorClass = "text-slate-900", 
    onJump 
  }: { 
    label: string, 
    value: string | number, 
    subLabel?: string, 
    colorClass?: string,
    onJump?: () => void
  }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 min-w-[220px] flex-1 shadow-sm hover:border-slate-300 transition-all relative group overflow-hidden">
      {onJump && (
        <button 
          onClick={(e) => { e.stopPropagation(); onJump(); }}
          className="absolute top-4 right-4 p-2 bg-blue-600 text-white rounded-lg opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-700 shadow-lg shadow-blue-200 z-10"
          title="Jump to details"
        >
          <ArrowUpRight size={14} strokeWidth={3} />
        </button>
      )}
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${colorClass.includes('red') ? 'bg-red-500' : colorClass.includes('emerald') ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
        {label}
      </div>
      <div className={`text-4xl font-black ${colorClass}`}>{value}</div>
      {subLabel && <div className="text-xs text-slate-400 mt-2 font-medium">{subLabel}</div>}
    </div>
  );

  const StatusStatBox = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 min-w-[150px] flex-1 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
      <div className="text-3xl font-black text-slate-700">{value}</div>
    </div>
  );

  // 如果不是概览模式且不是开发者模式，展示各自模块的独立视图
  if (currentInternalView !== 'overview' && currentInternalView !== 'developer-mode') {
    return (
      <div className="animate-in fade-in duration-300 h-full flex flex-col gap-4">
        <button 
          onClick={() => setCurrentInternalView('overview')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors mb-4 w-fit bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
          <ChevronRight size={16} className="rotate-180" /> Back to Project Overview
        </button>
        {currentInternalView === 'assets' ? (
          <AssetModule />
        ) : currentInternalView === 'devices' ? (
          <DeviceManager />
        ) : currentInternalView === 'workflow' ? (
          <WorkflowManager />
        ) : (
          <div className="flex-grow bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
               {currentInternalView === 'dashboard' && <LayoutDashboard size={48} />}
               {currentInternalView === 'alerts' && <BellRing size={48} />}
               {currentInternalView === 'users' && <Users size={48} />}
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">{currentInternalView.replace('-', ' ')}</h3>
            <p className="text-slate-500 max-w-sm font-medium">This module is currently being optimized for high-performance enterprise data visualization.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full flex flex-col gap-8">
      {/* Project Header - 在开发者模式下依然保留 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm w-full relative group">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-inner">
            <ProjectIcon category={project.category} size={40} className="text-blue-600" />
          </div>
          <div className="flex-grow pt-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{project.name}</h2>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm max-w-3xl leading-relaxed font-medium">{project.description}</p>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-8 right-8" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${isMenuOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <span>Actions</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <button 
                  onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <Edit3 size={16} /> Edit Project
                </button>
                <button 
                  onClick={() => { setCurrentInternalView(currentInternalView === 'developer-mode' ? 'overview' : 'developer-mode'); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${currentInternalView === 'developer-mode' ? 'text-slate-600' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <Terminal size={16} /> {currentInternalView === 'developer-mode' ? 'Exit Developer Mode' : 'Developer Mode'}
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button 
                  onClick={() => { if(window.confirm('Delete project?')) onDelete(project.id); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} /> Delete Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 根据模式展示内容 */}
      {currentInternalView === 'developer-mode' ? (
        <DeveloperMode project={project} />
      ) : (
        <div className="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-slate-100/50">
          {/* Dashboard Section */}
          <SummarySection title="Dashboard" icon={LayoutDashboard} onEnter={() => setCurrentInternalView('dashboard')}>
            <div className="flex gap-6 w-full">
              <div 
                onClick={() => setCurrentInternalView('dashboard')}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden w-80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1558444479-2704f605c75f?q=80&w=600&auto=format&fit=crop" 
                    alt="Dashboard Preview" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                       <LayoutDashboard className="text-white" size={16} />
                     </div>
                     <span className="text-white text-xs font-black tracking-widest uppercase">Live View</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-black text-slate-800 tracking-tight">System Global Status</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sync: 2025-12-30</p>
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100"></div>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl w-80 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <span className="text-xs font-black text-slate-500 group-hover:text-blue-600 uppercase tracking-widest">Create Dashboard</span>
              </div>
            </div>
          </SummarySection>

          {/* Connected Devices Section */}
          <SummarySection title="Connected Devices" icon={Cpu} onEnter={() => setCurrentInternalView('devices')}>
            <StatBox label="Total Devices" value={125} subLabel="Registered across site" />
            <StatBox 
              label="In Alerts" 
              value={25} 
              colorClass="text-red-500" 
              subLabel="Requiring immediate attention" 
              onJump={() => setCurrentInternalView('alerts')}
            />
            <StatusStatBox label="Online" value={35} color="bg-emerald-500" />
            <StatusStatBox label="Offline" value={5} color="bg-orange-500" />
            <StatusStatBox label="Never Connected" value={15} color="bg-slate-300" />
          </SummarySection>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12">
              <SummarySection title="Project Assets" icon={Box} onEnter={() => setCurrentInternalView('assets')}>
                <StatBox label="Hierarchy Nodes" value={25} />
                <StatBox 
                  label="Asset Health" 
                  value={1} 
                  colorClass="text-red-500" 
                  subLabel="Impacted by device alerts" 
                  onJump={() => setCurrentInternalView('alerts')}
                />
              </SummarySection>

              <SummarySection title="Workflows" icon={GitBranch} onEnter={() => setCurrentInternalView('workflow')}>
                <StatBox label="Total Workflows" value={workflowStats.total} subLabel="Configured logic blocks" />
                <StatBox label="Active Workflows" value={workflowStats.active} colorClass="text-emerald-500" subLabel="Currently enabled flows" />
              </SummarySection>
          </div>

          <SummarySection title="Alarm Logic" icon={BellRing} onEnter={() => setCurrentInternalView('alerts')}>
            <StatBox label="Rules Config" value={25} />
            <StatBox label="Active Alarms" value={5} colorClass="text-red-500" subLabel="Requires manual ack" />
          </SummarySection>

          <SummarySection title="Access Control" icon={Users} onEnter={() => setCurrentInternalView('users')}>
            <StatBox label="Assigned Users" value={25} />
            <StatBox label="Pending Invites" value={5} colorClass="text-orange-500" />
          </SummarySection>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Project Configuration</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} strokeWidth={3} />
                  Sync Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

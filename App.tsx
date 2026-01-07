
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Home as HomeIcon, 
  Cpu, 
  ClipboardList, 
  FolderKanban, 
  Package,
  Box,
  ChevronRight,
  Bell,
  UserCircle,
  Tags,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { IoTProject, IoTProjectCategory, ViewState } from './types';
import { ProjectCard } from './components/ProjectCard';
import { AssetTypeManager } from './components/AssetTypeManager';
import { ProjectDetailView } from './components/ProjectDetailView';
import { GlobalDeviceManager } from './components/GlobalDeviceManager';

const INITIAL_PROJECTS: IoTProject[] = [
  {
    id: '1',
    name: 'CBD Smart Building Alpha',
    description: 'Integrated energy management and HVAC control system for the North District commercial tower.',
    category: IoTProjectCategory.SMART_BUILDING,
    stats: { deviceCount: 452, assetCount: 1240, memberCount: 15 },
    updatedAt: '2024-05-20',
    status: 'active'
  },
  {
    id: '2',
    name: 'Grand Horizon Shopping Mall',
    description: 'Real-time foot traffic analysis and intelligent lighting optimization for regional shopping centers.',
    category: IoTProjectCategory.FLEET_MANAGEMENT,
    stats: { deviceCount: 890, assetCount: 3200, memberCount: 28 },
    updatedAt: '2024-05-18',
    status: 'active'
  },
  {
    id: '3',
    name: 'GreenField Precision Agriculture',
    description: 'Automated soil monitoring and drone irrigation system for the smart farm pilot program.',
    category: IoTProjectCategory.SMART_FARM,
    stats: { deviceCount: 124, assetCount: 560, memberCount: 12 },
    updatedAt: '2024-05-15',
    status: 'active'
  },
  {
    id: '4',
    name: 'Skyline Residential Tower C',
    description: 'Smart security and automated elevator dispatching system for luxury residential units.',
    category: IoTProjectCategory.SMART_BUILDING,
    stats: { deviceCount: 320, assetCount: 850, memberCount: 9 },
    updatedAt: '2024-05-10',
    status: 'active'
  },
  {
    id: '5',
    name: 'Metro Plaza Smart Retail',
    description: 'Asset tracking and warehouse environment control for urban retail logistics hubs.',
    category: IoTProjectCategory.FLEET_MANAGEMENT,
    stats: { deviceCount: 654, assetCount: 2100, memberCount: 22 },
    updatedAt: '2024-05-12',
    status: 'active'
  },
  {
    id: '6',
    name: 'Jiangnan Hydroponic Greenhouse',
    description: 'Climate control and nutrient delivery network for vertical farming installations.',
    category: IoTProjectCategory.SMART_FARM,
    stats: { deviceCount: 98, assetCount: 240, memberCount: 6 },
    updatedAt: '2024-05-08',
    status: 'active'
  }
];

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  collapsed = false,
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  collapsed?: boolean,
  onClick?: () => void 
}) => (
  <div 
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group relative ${
      active 
        ? 'bg-blue-600/90 text-white' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    } ${collapsed ? 'justify-center px-0 mx-0 rounded-none' : 'rounded-lg mx-3'}`}
  >
    {/* Active Indicator Bar */}
    {active && collapsed && (
      <div className="absolute left-0 w-1 h-6 bg-blue-400 rounded-r-full" />
    )}
    
    <Icon size={22} className={collapsed ? 'shrink-0' : ''} strokeWidth={1.5} />
    {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</span>}
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [projects, setProjects] = useState<IoTProject[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
  [projects, selectedProjectId]);

  const handleEnterProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
  };

  const handleUpdateProject = (updated: IoTProject) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setCurrentView('projects');
    setSelectedProjectId(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetailView 
            project={selectedProject} 
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            onBack={() => {
              setCurrentView('projects');
              setSelectedProjectId(null);
            }}
          />
        ) : null;
      case 'asset-types':
        return <AssetTypeManager projects={projects} />;
      case 'devices':
        return <GlobalDeviceManager />;
      case 'projects':
        return (
          <div className="animate-in fade-in duration-500 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Directory</h2>
                <p className="text-slate-500 font-medium mt-1">Monitoring platform nodes across all managed sites.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentView('asset-types')}
                  className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 uppercase tracking-wide"
                >
                  <Tags size={18} />
                  Manage Asset Types
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide">
                  <Plus size={18} strokeWidth={3} />
                  Create Project
                </button>
              </div>
            </div>

            <div className="mb-12">
              <div className="relative group max-w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search by project name, manager or site description..."
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-slate-700 shadow-sm shadow-slate-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={handleEnterProject}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No projects found</h3>
                <p className="text-slate-500 text-center mt-2 px-4 max-w-sm">
                  We couldn't find any results for "{searchQuery}". Please try a different search term.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-slate-300 animate-in fade-in duration-500 w-full">
             <h3 className="text-xl font-bold text-slate-800 uppercase tracking-widest">{currentView.replace('-', ' ')} Page</h3>
             <p className="text-slate-500 mt-2">This page is currently under construction.</p>
             <button 
                onClick={() => {
                  setCurrentView('projects');
                  setSelectedProjectId(null);
                }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Back to Projects
              </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left Sidebar */}
      <aside 
        className={`bg-[#0b1221] text-white flex flex-col hidden lg:flex shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Sidebar Header: Logo Area */}
        <div className={`pt-6 pb-10 flex items-center justify-center overflow-hidden`}>
          <div className={`flex items-center gap-3 w-full overflow-hidden ${isSidebarCollapsed ? 'justify-center' : 'px-6'}`}>
            <div 
              onClick={() => { setCurrentView('projects'); setSelectedProjectId(null); }}
              className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0 cursor-pointer"
            >
              <Box size={24} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-black tracking-tighter whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">IOT OS</span>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow space-y-2">
          {!isSidebarCollapsed && (
             <p className="px-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 mt-2">Main Navigator</p>
          )}
          <SidebarItem 
            icon={HomeIcon} 
            label="Home" 
            active={currentView === 'home'} 
            collapsed={isSidebarCollapsed}
            onClick={() => { setCurrentView('home'); setSelectedProjectId(null); }} 
          />
          <SidebarItem 
            icon={Cpu} 
            label="Device Management" 
            active={currentView === 'devices'} 
            collapsed={isSidebarCollapsed}
            onClick={() => { setCurrentView('devices'); setSelectedProjectId(null); }} 
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Task Center" 
            active={currentView === 'tasks'} 
            collapsed={isSidebarCollapsed}
            onClick={() => { setCurrentView('tasks'); setSelectedProjectId(null); }} 
          />
          <SidebarItem 
            icon={FolderKanban} 
            label="Projects" 
            active={currentView === 'projects' || currentView === 'project-detail'} 
            collapsed={isSidebarCollapsed}
            onClick={() => { setCurrentView('projects'); setSelectedProjectId(null); }} 
          />
          <SidebarItem 
            icon={Package} 
            label="Resource Center" 
            active={currentView === 'resources' || currentView === 'asset-types'} 
            collapsed={isSidebarCollapsed}
            onClick={() => { setCurrentView('resources'); setSelectedProjectId(null); }} 
          />
        </nav>

        {/* Sidebar Bottom: User & Collapse Toggle */}
        <div className={`pb-8 px-0 border-t border-slate-800/50`}>
          <div className={`flex items-center gap-3 p-4 w-full relative ${isSidebarCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            {/* User Avatar & Info */}
            <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                <UserCircle size={26} className="text-slate-500" />
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden animate-in fade-in duration-300">
                  <p className="text-xs font-bold truncate">Admin User</p>
                  <p className="text-[10px] text-slate-500 truncate">Enterprise Plan</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`text-slate-500 hover:text-white transition-all duration-300 p-2 hover:bg-slate-800 rounded-md shrink-0 ${isSidebarCollapsed ? 'mt-2' : ''}`}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <HomeIcon size={14} />
            <ChevronRight size={12} />
            <span 
              className={`uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors ${currentView === 'projects' || currentView === 'project-detail' ? 'text-slate-800 font-bold underline decoration-blue-600 decoration-2 underline-offset-4' : ''}`}
              onClick={() => { setCurrentView('projects'); setSelectedProjectId(null); }}
            >
              Projects Hub
            </span>
            {currentView === 'project-detail' && selectedProject && (
              <>
                <ChevronRight size={12} />
                <span className="uppercase tracking-wider text-slate-800 font-bold underline decoration-blue-600 decoration-2 underline-offset-4 truncate max-w-[150px]">
                  {selectedProject.name}
                </span>
              </>
            )}
            {currentView === 'devices' && (
              <>
                <ChevronRight size={12} />
                <span className="uppercase tracking-wider text-slate-800 font-bold underline decoration-blue-600 decoration-2 underline-offset-4">Devices Management</span>
              </>
            )}
            {currentView === 'asset-types' && (
              <>
                <ChevronRight size={12} />
                <span className="uppercase tracking-wider text-slate-800 font-bold underline decoration-blue-600 decoration-2 underline-offset-4">Asset Types</span>
              </>
            )}
            {(currentView !== 'projects' && currentView !== 'asset-types' && currentView !== 'project-detail' && currentView !== 'devices') && (
              <>
                <ChevronRight size={12} />
                <span className="uppercase tracking-wider text-slate-800 font-bold underline decoration-blue-600 decoration-2 underline-offset-4">{currentView.replace('-', ' ')}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100">
              <UserCircle size={16} />
              Control Panel
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Settings, 
  Terminal, 
  History, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Info, 
  Search, 
  Play, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  ExternalLink,
  Plus,
  Wifi,
  MoreVertical,
  Clock
} from 'lucide-react';
import { IoTProject } from '../types';

interface DeveloperModeProps {
  project: IoTProject;
}

type DevTab = 'devices' | 'app-settings' | 'openapi' | 'webhook-log';

export const DeveloperMode: React.FC<DeveloperModeProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<DevTab>('devices');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("ID copied successfully!");
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 gap-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check size={16} className="text-emerald-400" /> {toast}
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm shrink-0 overflow-x-auto">
        {[
          { id: 'devices', label: 'Devices', icon: Cpu },
          { id: 'app-settings', label: 'App Settings', icon: Settings },
          { id: 'openapi', label: 'OPENAPI Debug', icon: Terminal },
          { id: 'webhook-log', label: 'WEBHOOK Log', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DevTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow min-h-[600px]">
        {activeTab === 'devices' && <DevDevicesTab onCopy={copyToClipboard} />}
        {activeTab === 'app-settings' && <AppSettingsTab onCopy={copyToClipboard} />}
        {activeTab === 'openapi' && <OpenApiTab />}
        {activeTab === 'webhook-log' && <WebhookLogTab />}
      </div>
    </div>
  );
};

// --- Devices Tab ---
const DevDevicesTab: React.FC<{ onCopy: (id: string) => void }> = ({ onCopy }) => {
  const devices = Array.from({ length: 8 }).map((_, i) => ({
    id: `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    name: i % 2 === 0 ? 'AM308 IAQ Sensor' : 'EM300 Environment Sensor',
    sn: `SN: 1234556${801 + i}`,
    isDemo: i % 4 === 1,
    signal: 75 + (i % 20),
    tslVersion: 'V1.0',
    profileVersion: 'V1.2',
    lastSeen: '2025-12-12 15:15:23',
    imageUrl: 'https://www.milesight-iot.com/wp-content/uploads/2021/08/AM300-Series-Ambience-Monitoring-Sensor.png'
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {devices.map(dev => (
        <div key={dev.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 flex items-start justify-between border-b border-slate-50 bg-slate-50/10">
            <div className="flex flex-col">
              <h4 className="text-sm font-black text-slate-800 tracking-tight">{dev.name}</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dev.sn}</span>
            </div>
            {dev.isDemo ? (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase">Demo</div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
                <Wifi size={12} strokeWidth={3} />
                <span className="text-[10px] font-black">{dev.signal}%</span>
              </div>
            )}
          </div>
          
          {/* Middle Body */}
          <div className="p-5 flex gap-4">
            <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex items-center justify-center shrink-0">
               <img src={dev.imageUrl} alt="Device" className="w-full h-full object-contain mix-blend-multiply opacity-80" />
            </div>
            <div className="flex flex-col gap-2 justify-center">
               <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Device ID</span>
                  <button onClick={() => onCopy(dev.id)} className="p-1 hover:bg-slate-100 text-slate-300 hover:text-blue-500 rounded transition-colors">
                    <Copy size={14} />
                  </button>
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">TSL Version:</span>
                  <span className="text-[11px] font-black text-slate-700">{dev.tslVersion}</span>
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Profile Version:</span>
                  <span className="text-[11px] font-black text-slate-700">{dev.profileVersion}</span>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto px-5 py-3 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
               <Clock size={12} />
               <span className="text-[9px]">{dev.lastSeen}</span>
            </div>
            <button className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
               <MoreVertical size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- App Settings Tab Support Components ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-6 last:mb-0">
    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
      <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
      <Info size={16} className="text-slate-300" />
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const FormItem = ({ label, value, type = 'text', isSecret = false, onCopyClick, showSecret, setShowSecret }: any) => (
  <div className="mb-6 last:mb-0">
     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
     <div className="flex gap-3">
       <div className="relative flex-grow">
         <input 
           type={isSecret && !showSecret ? 'password' : 'text'} 
           readOnly 
           value={value}
           className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none"
         />
         {isSecret && (
           <button onClick={() => setShowSecret(!showSecret)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
             {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
           </button>
         )}
       </div>
       <button onClick={() => onCopyClick?.(value)} className="px-5 py-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-2xl transition-all shadow-sm">
         <Copy size={18} />
       </button>
       {isSecret && (
         <button className="px-5 py-4 bg-white border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-200 rounded-2xl transition-all shadow-sm">
           <RefreshCw size={18} />
         </button>
       )}
     </div>
  </div>
);

// --- App Settings Tab ---
const AppSettingsTab: React.FC<{ onCopy: (text: string) => void }> = ({ onCopy }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Section title="Authentication">
        <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">
          Use the following information to authenticate your application and establish a connection with the IoT Open API. <a href="#" className="text-blue-600 hover:underline font-bold">View API Documentation</a>
        </p>
        <FormItem label="Server Address" value="https://openapi-test-us.milesight.com" onCopyClick={onCopy} showSecret={showSecret} setShowSecret={setShowSecret} />
        <FormItem label="Client ID" value="561274a0-b185-40f7-b830-d23bcf403cd4" onCopyClick={onCopy} showSecret={showSecret} setShowSecret={setShowSecret} />
        <FormItem label="Client Secret" value="hfiNfDmTSx1nqrCLRZUZYRHRLYZ1ilZc" isSecret onCopyClick={onCopy} showSecret={showSecret} setShowSecret={setShowSecret} />
      </Section>

      <Section title="Request Limit">
        <div className="flex items-center justify-between mb-4">
           <div className="space-y-1">
             <h4 className="text-sm font-black text-slate-700">Enable Request Limiting</h4>
             <p className="text-xs text-slate-400 font-medium">For security, it is recommended to enable request limiting and specify allowed IP addresses below.</p>
           </div>
           <div className="relative w-12 h-6 rounded-full bg-slate-200 cursor-not-allowed">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"></div>
           </div>
        </div>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Add +</span>
        </div>
      </Section>

      <Section title="Webhook">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
             <h4 className="text-sm font-black text-slate-700">Enable Webhook</h4>
             <p className="text-xs text-slate-400 font-medium leading-relaxed">When Webhook is enabled, device data and events will trigger HTTP callbacks to your URI. <a href="#" className="text-blue-600 hover:underline font-bold">Learn more about Webhook data</a></p>
           </div>
           <button onClick={() => setWebhookEnabled(!webhookEnabled)} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${webhookEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${webhookEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
           </button>
        </div>
        <div className={webhookEnabled ? 'opacity-100 transition-opacity' : 'opacity-30 pointer-events-none'}>
          <FormItem label="UUID" value="f213c75c-39b7-4b26-b467-7436a4b9570d" onCopyClick={onCopy} showSecret={showSecret} setShowSecret={setShowSecret} />
          <FormItem label="Secret Key" value="9ngt0rf+a0hHPaW4PBA1f85gAINRvw45" isSecret onCopyClick={onCopy} showSecret={showSecret} setShowSecret={setShowSecret} />
        </div>
        
        <div className="mt-8">
           <div className="flex items-center justify-between mb-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Callback URI</label>
             <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Test</button>
           </div>
           <div className="flex gap-3 mb-4">
             <input type="text" readOnly value="https://api.museodesarrollo.info/fotografias/milesight-people-count" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 text-xs" />
             <button className="p-4 text-slate-400 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-colors"><Trash2 size={20} /></button>
           </div>
           <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all group">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Add +</span>
           </div>
        </div>
      </Section>

      <div className="flex justify-end gap-4 pb-10">
        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
        <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Save</button>
      </div>
    </div>
  );
};

// --- OpenAPI Debug Tab ---
const OpenApiTab: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex h-[700px]">
      <div className="w-72 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">OpenAPIs</h3>
           <div className="relative">
             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold appearance-none">
               <option>v1</option>
               <option>v2</option>
             </select>
             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
        </div>
        <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
           {['oauth', 'device', 'rps', 'task'].map(cat => (
             <div key={cat} className="space-y-1">
               <div className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer group">
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" /> openapi-{cat}
               </div>
               {cat === 'device' && (
                 <div className="ml-6 pl-4 border-l-2 border-slate-50 space-y-1">
                   {['Add Device', 'Update Device Info', 'Query Device List', 'Query Device TSL', 'Delete Device'].map(api => (
                     <div key={api} className={`px-4 py-2 text-[10px] font-black rounded-lg cursor-pointer transition-all ${api === 'Add Device' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                       {api}
                     </div>
                   ))}
                 </div>
               )}
             </div>
           ))}
        </div>
      </div>

      <div className="flex-grow border-r border-slate-100 flex flex-col min-w-0">
        <div className="p-8 flex flex-col gap-8 flex-grow overflow-y-auto scrollbar-hide">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Add Device</h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md border border-blue-100">POST</span>
                <Info size={16} className="text-slate-300 cursor-help" />
              </div>
           </div>

           <div className="space-y-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL:</span>
             <code className="block p-3 bg-slate-50 rounded-xl text-[10px] font-mono font-bold text-slate-500 break-all border border-slate-100">https://openapi-test-us.milesight.com/device/openapi/v1/devices</code>
           </div>

           <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Parameters</h4>
              <div className="space-y-5">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 mb-2">snDevEUI <span className="text-red-500">*</span></label>
                   <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 mb-2">name <span className="text-red-500">*</span></label>
                   <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 mb-2">description</label>
                   <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 mb-2">tag</label>
                   <input type="text" placeholder="Separate multiple values with comma or semicolon." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                 </div>
              </div>
           </div>
        </div>
        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
           <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
             Invoke API
           </button>
        </div>
      </div>

      <div className="w-1/3 bg-slate-50/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 bg-white">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">API Request & Result</h3>
        </div>
        <div className="p-8 space-y-12 flex-grow overflow-y-auto custom-scrollbar">
           <div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">CURL Command</span>
             <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-slate-300">
                <Code size={48} className="opacity-10" />
                <span className="text-xs font-bold">No Data</span>
             </div>
           </div>

           <div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Response Body</span>
             <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-slate-300">
                <Code size={48} className="opacity-10" />
                <span className="text-xs font-bold">No Data</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Webhook Log Tab ---
const WebhookLogTab: React.FC = () => {
  const [historyEnabled, setHistoryEnabled] = useState(true);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-100">
        <div className="flex flex-col gap-6">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Webhook Message Simulation</h3>
           <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-slate-400">Webhook URI:</span>
             <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                https://api.museodesarrollo.info/fotografias/milesight-people-count
             </div>
           </div>
        </div>
      </div>

      <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <button onClick={() => setHistoryEnabled(!historyEnabled)} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${historyEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${historyEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
           </button>
           <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Webhook History</span>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-xl text-[10px] font-black transition-all">
           <Trash2 size={14} /> Clear Data
         </button>
      </div>

      <div className="flex-grow overflow-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
             <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <th className="px-8 py-4">Webhook Address</th>
               <th className="px-8 py-4">Request Time</th>
               <th className="px-8 py-4">Payload</th>
               <th className="px-8 py-4 text-center">Status</th>
               <th className="px-8 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {Array.from({ length: 1 }).map((_, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                 <td className="px-8 py-6 text-xs text-slate-500 font-medium">https://api.museodesarrollo.info/fotografias/milesight-people-count</td>
                 <td className="px-8 py-6 text-xs text-slate-700 font-bold whitespace-nowrap">2026-01-06 09:06:23</td>
                 <td className="px-8 py-6">
                    <div className="flex items-center justify-between gap-4 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[400px]">{"{\"data\": {\"type\": \"ONLINE\", \"deviceProfile\": {\"sn\": \"DEMO_1997948692352286721\", \"name\": \"DEMO_TS601-L0DEU\", \"model\": \"TS601-L0DEU\", \"devEUI\": \"DEMO_1997948692352286721\", \"deviceId\": 19..."}</span>
                      <button className="text-slate-400 hover:text-blue-500"><Copy size={12} /></button>
                    </div>
                 </td>
                 <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black">
                       <Check size={12} /> 200
                    </div>
                 </td>
                 <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  Users, 
  GripVertical, 
  Plus, 
  Search, 
  Edit2, 
  Check, 
  MoreHorizontal,
  Building2,
  Layers,
  DoorOpen,
  Eye,
  Trash2,
  PlusCircle,
  X,
  AlertTriangle,
  Save,
  Tags,
  Maximize,
  ChevronDown as ChevronDownIcon,
  Info
} from 'lucide-react';
import { AssetDetailView } from './AssetDetailView';

interface AssetNode {
  id: string;
  name: string;
  type: string;
  iconName: string;
  deviceCount: number;
  memberCount: number;
  attributeCount: number;
  creator?: string;
  children?: AssetNode[];
}

interface AssetTypeOption {
  id: string;
  name: string;
  iconName: string;
  category: 'Global' | 'Private';
}

const ASSET_TYPES: AssetTypeOption[] = [
  { id: 't1', name: 'Building', iconName: 'Building2', category: 'Global' },
  { id: 't2', name: 'Floor', iconName: 'Layers', category: 'Global' },
  { id: 't3', name: 'Space', iconName: 'Maximize', category: 'Global' },
  { id: 't4', name: 'Gate', iconName: 'DoorOpen', category: 'Global' },
  { id: 't5', name: 'Server Room', iconName: 'Cpu', category: 'Private' },
  { id: 't6', name: 'Storage Area', iconName: 'Package', category: 'Private' },
];

const IconRegistry: Record<string, any> = {
  Building2, Layers, Maximize, DoorOpen, Cpu, Package: Layers // Fallback icon
};

const INITIAL_ASSETS: AssetNode[] = [
  {
    id: 'ast-001928',
    name: 'Airport Traffic Monitoring',
    type: 'Project Root',
    iconName: 'Layers',
    deviceCount: 0,
    memberCount: 15,
    attributeCount: 20,
    creator: 'John Smith',
    children: [
      {
        id: 'ast-002134',
        name: 'Terminal T1',
        type: 'Building',
        iconName: 'Building2',
        deviceCount: 0,
        memberCount: 8,
        attributeCount: 12,
        creator: 'John Smith',
        children: [
          {
            id: 'ast-003551',
            name: 'Gate 1',
            type: 'Gate',
            iconName: 'DoorOpen',
            deviceCount: 4,
            memberCount: 2,
            attributeCount: 4,
            creator: 'System',
          },
          {
            id: 'ast-004882',
            name: 'Gate 2',
            type: 'Gate',
            iconName: 'DoorOpen',
            deviceCount: 4,
            memberCount: 3,
            attributeCount: 4,
            creator: 'System',
          }
        ]
      },
      {
        id: 'ast-005119',
        name: 'Terminal T2',
        type: 'Building',
        iconName: 'Building2',
        deviceCount: 0,
        memberCount: 7,
        attributeCount: 8,
        creator: 'John Smith',
        children: [
          {
            id: 'ast-006227',
            name: 'Gate 3',
            type: 'Gate',
            iconName: 'DoorOpen',
            deviceCount: 0,
            memberCount: 0,
            attributeCount: 0,
            creator: 'System',
          },
          {
            id: 'ast-007883',
            name: 'Gate 4',
            type: 'Gate',
            iconName: 'DoorOpen',
            deviceCount: 0,
            memberCount: 0,
            attributeCount: 0,
            creator: 'System',
          }
        ]
      }
    ]
  }
];

export const AssetModule: React.FC = () => {
  const [assets, setAssets] = useState<AssetNode[]>(INITIAL_ASSETS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ast-001928', 'ast-002134', 'ast-005119']));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingAsset, setViewingAsset] = useState<{node: AssetNode, parent?: {id: string, name: string}} | null>(null);
  
  // Selection/DND State
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [draggedNodeIds, setDraggedNodeIds] = useState<string[]>([]);
  const [dropIndicator, setDropIndicator] = useState<{ id: string, position: 'top' | 'bottom' } | null>(null);
  
  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ items: string[], target: string, position: 'top' | 'bottom' } | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<AssetNode | null>(null);
  const [parentIdForNewNode, setParentIdForNewNode] = useState<string | null>(null);

  // Form State
  const [createFormData, setCreateFormData] = useState({ name: '', typeId: ASSET_TYPES[0].id });
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findParent = (nodes: AssetNode[], targetId: string, parent?: AssetNode): {id: string, name: string} | undefined => {
    for (const node of nodes) {
      if (node.id === targetId) return parent ? { id: parent.id, name: parent.name } : undefined;
      if (node.children) {
        const found = findParent(node.children, targetId, node);
        if (found) return found;
      }
    }
    return undefined;
  };

  const handleConfirmMove = () => {
    if (!pendingMove) return;

    const { items, target, position } = pendingMove;
    let newTree = JSON.parse(JSON.stringify(assets));

    const removedNodes: AssetNode[] = [];
    const traverseAndRemove = (list: AssetNode[]): AssetNode[] => {
      return list.filter(node => {
        if (items.includes(node.id)) {
          removedNodes.push(node);
          return false;
        }
        if (node.children) {
          node.children = traverseAndRemove(node.children);
        }
        return true;
      });
    };

    newTree = traverseAndRemove(newTree);

    const traverseAndInsert = (list: AssetNode[]): AssetNode[] => {
      const idx = list.findIndex(n => n.id === target);
      if (idx !== -1) {
        const result = [...list];
        const insertIdx = position === 'top' ? idx : idx + 1;
        result.splice(insertIdx, 0, ...removedNodes);
        return result;
      }
      return list.map(node => ({
        ...node,
        children: node.children ? traverseAndInsert(node.children) : undefined
      }));
    };

    newTree = traverseAndInsert(newTree);
    setAssets(newTree);
    setShowConfirmModal(false);
    setPendingMove(null);
    setSelectedNodeIds(new Set());
  };

  const onDragStart = (e: React.DragEvent, id: string, depth: number) => {
    if (!isEditMode || depth === 0) {
      e.preventDefault();
      return;
    }
    let dragging = Array.from(selectedNodeIds);
    if (!selectedNodeIds.has(id)) {
      dragging = [id];
      setSelectedNodeIds(new Set([id]));
    }
    setDraggedNodeIds(dragging);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    if (!isEditMode || draggedNodeIds.includes(id)) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const position = relativeY < rect.height / 2 ? 'top' : 'bottom';
    setDropIndicator({ id, position });
  };

  const onDragLeave = () => {
    setDropIndicator(null);
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!isEditMode || !dropIndicator) return;
    if (draggedNodeIds.includes(targetId)) {
        setDropIndicator(null);
        return;
    }
    setPendingMove({
      items: draggedNodeIds,
      target: targetId,
      position: dropIndicator.position
    });
    setShowConfirmModal(true);
    setDropIndicator(null);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleCreateSubNode = (parentId: string) => {
    setParentIdForNewNode(parentId);
    setCreateFormData({ name: '', typeId: ASSET_TYPES[0].id });
    setShowCreateModal(true);
    setActiveMenuId(null);
  };

  const saveNewNode = () => {
    if (!createFormData.name || !parentIdForNewNode) return;
    const selectedType = ASSET_TYPES.find(t => t.id === createFormData.typeId);
    const newNode: AssetNode = {
      id: 'ast-' + Math.floor(100000 + Math.random() * 900000).toString(),
      name: createFormData.name,
      type: selectedType?.name || 'Custom',
      iconName: selectedType?.iconName || 'Layers',
      deviceCount: 0,
      memberCount: 0,
      attributeCount: 0,
      creator: 'John Smith',
      children: []
    };
    const updatedAssets = JSON.parse(JSON.stringify(assets));
    const findAndAdd = (nodes: AssetNode[]) => {
      for (let node of nodes) {
        if (node.id === parentIdForNewNode) {
          node.children = [...(node.children || []), newNode];
          return true;
        }
        if (node.children && findAndAdd(node.children)) return true;
      }
      return false;
    };
    findAndAdd(updatedAssets);
    setAssets(updatedAssets);
    setExpandedNodes(prev => new Set(prev).add(parentIdForNewNode));
    setShowCreateModal(false);
  };

  const renderAssetRow = (node: AssetNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isMenuOpen = activeMenuId === node.id;
    const isSelected = selectedNodeIds.has(node.id);
    const isDropTop = dropIndicator?.id === node.id && dropIndicator.position === 'top';
    const isDropBottom = dropIndicator?.id === node.id && dropIndicator.position === 'bottom';
    const canDrag = depth !== 0;
    const Icon = IconRegistry[node.iconName] || Layers;

    return (
      <React.Fragment key={node.id}>
        <div 
          draggable={isEditMode && canDrag}
          onDragStart={(e) => onDragStart(e, node.id, depth)}
          onDragOver={(e) => onDragOver(e, node.id)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, node.id)}
          className={`group flex items-center border-b border-slate-50 py-3 transition-all relative ${isEditMode && canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${isSelected ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-200' : 'hover:bg-slate-50'}`}
          onClick={(e) => { 
            if (isEditMode) { 
              e.stopPropagation(); 
              if (e.ctrlKey || e.metaKey) {
                const next = new Set(selectedNodeIds);
                if (next.has(node.id)) next.delete(node.id);
                else next.add(node.id);
                setSelectedNodeIds(next);
              } else {
                setSelectedNodeIds(new Set([node.id])); 
              }
            } 
          }}
        >
          {isDropTop && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-50 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
          {isDropBottom && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-50 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}

          <div className="flex items-center gap-2 flex-grow" style={{ paddingLeft: `${depth * 24 + 12}px` }}>
            <div className="flex items-center gap-1">
              {isEditMode && canDrag && <div className={`p-1 rounded ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}><GripVertical size={14} /></div>}
              {isEditMode && !canDrag && <div className="w-[22px]" />}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }} 
                className={`p-1 rounded hover:bg-slate-200 ${(!hasChildren || depth === 0) ? 'invisible' : ''}`}
                disabled={depth === 0}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
            <div className={`p-1.5 rounded-lg ${depth === 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}><Icon size={16} /></div>
            <div className="flex flex-col select-none">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{node.name}</span>
                <span className="text-[10px] font-mono text-slate-400">({node.id})</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{node.type}</span>
            </div>
          </div>

          <div className="w-32 flex items-center gap-2 px-4 border-l border-slate-50 text-xs font-bold text-slate-600"><Tags size={14} className="text-amber-400" />{node.attributeCount}</div>
          <div className="w-32 flex items-center gap-2 px-4 border-l border-slate-50 text-xs font-bold text-slate-600"><Cpu size={14} className="text-blue-400" />{node.deviceCount}</div>
          <div className="w-32 flex items-center gap-2 px-4 border-l border-slate-50 text-xs font-bold text-slate-600"><Users size={14} className="text-slate-400" />{node.memberCount}</div>

          <div className="w-32 flex items-center justify-center relative border-l border-slate-50">
            {isEditMode ? (
              <>
                <button onClick={(e) => handleActionClick(e, node.id)} className={`p-1.5 rounded-lg transition-all ${isMenuOpen ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'}`}>
                  <MoreHorizontal size={18} />
                </button>
                {isMenuOpen && (
                  <div ref={menuRef} className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-1.5 space-y-0.5">
                      <button onClick={() => handleCreateSubNode(node.id)} className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-left group/btn">
                        <PlusCircle size={16} className="text-slate-400 group-hover/btn:text-blue-500" /> Create Sub-node
                      </button>
                      {canDrag && (
                        <>
                          <div className="h-px bg-slate-100 mx-2"></div>
                          <button 
                            disabled={hasChildren} 
                            title={hasChildren ? "Please delete sub-nodes first" : ""}
                            onClick={() => { if(!hasChildren) { setNodeToDelete(node); setShowDeleteConfirm(true); setActiveMenuId(null); } }} 
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold rounded-lg text-left ${hasChildren ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                          >
                            <Trash2 size={16} /> Delete Current Node
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              depth !== 0 && (
                <button 
                  title="View Details"
                  onClick={() => setViewingAsset({ node, parent: findParent(assets, node.id) })}
                  className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Eye size={16} strokeWidth={2.5} />
                </button>
              )
            )}
          </div>
        </div>
        {(isExpanded || depth === 0) && node.children?.map(child => renderAssetRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  if (viewingAsset) {
    return (
      <AssetDetailView 
        key={viewingAsset.node.id}
        asset={{
          id: viewingAsset.node.id,
          name: viewingAsset.node.name,
          type: viewingAsset.node.type,
          parentId: viewingAsset.parent?.id,
          parentName: viewingAsset.parent?.name,
          creator: viewingAsset.node.creator || 'John Smith'
        }} 
        onBack={() => setViewingAsset(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4 flex-grow">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Search assets..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          {isEditMode && <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/50 px-2 py-1 rounded-full">{selectedNodeIds.size} Selected</div>}
        </div>
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <button onClick={() => setIsEditMode(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase bg-blue-600 text-white shadow-lg hover:bg-blue-700"><Check size={14} /> Save Changes</button>
              <button onClick={() => { setIsEditMode(false); setSelectedNodeIds(new Set()); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase bg-white border border-slate-200 text-slate-600"><X size={14} /> Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase bg-white border border-slate-200 text-slate-600 hover:border-slate-300"><Edit2 size={14} /> Edit Mode</button>
          )}
        </div>
      </div>

      <div className="flex items-center bg-slate-50 border-b border-slate-100 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="flex-grow pl-6">Asset Name & Hierarchy</div>
        <div className="w-32 px-4 border-l border-slate-100">Attributes</div>
        <div className="w-32 px-4 border-l border-slate-100">Devices</div>
        <div className="w-32 px-4 border-l border-slate-100">Members</div>
        <div className="w-32 text-center border-l border-slate-100">Actions</div>
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-hide min-h-[400px]">
        {assets.map(root => renderAssetRow(root))}
      </div>

      {/* Create Sub-node Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create Sub-node</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Node Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Zone A, Rack 01..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all"
                    value={createFormData.name}
                    onChange={e => setCreateFormData({ ...createFormData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Type</label>
                  <div className="relative" ref={typeDropdownRef}>
                    <button 
                      onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const selected = ASSET_TYPES.find(t => t.id === createFormData.typeId);
                          const Icon = selected ? IconRegistry[selected.iconName] : Layers;
                          return (
                            <>
                              <div className="text-blue-500"><Icon size={16} /></div>
                              <span>{selected?.name || 'Select Type'}</span>
                            </>
                          );
                        })()}
                      </div>
                      <ChevronDownIcon size={18} className={`text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isTypeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[1100] max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
                        {ASSET_TYPES.map(type => {
                          const Icon = IconRegistry[type.iconName] || Layers;
                          return (
                            <button 
                              key={type.id}
                              onClick={() => {
                                setCreateFormData({ ...createFormData, typeId: type.id });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 transition-colors group ${createFormData.typeId === type.id ? 'bg-blue-50/50' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon size={16} className={createFormData.typeId === type.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'} />
                                <span className={`text-xs font-bold ${createFormData.typeId === type.id ? 'text-blue-700' : 'text-slate-600'}`}>{type.name}</span>
                              </div>
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{type.category}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                <button 
                  onClick={saveNewNode} 
                  disabled={!createFormData.name}
                  className={`flex-1 py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${!createFormData.name ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                >
                  <Check size={20} strokeWidth={3} />Save Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0"><AlertTriangle size={24} className="text-amber-500" /></div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Save Changes?</h3>
              </div>
              <div className="space-y-4 text-slate-500 text-sm">
                <p>You have modified the asset hierarchy, which will affect node inheritance and permission settings.</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                   <Layers size={16} className="text-blue-600" />
                   <span className="font-bold text-slate-800">{pendingMove?.items.length} nodes will be moved</span>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => { setShowConfirmModal(false); setPendingMove(null); }} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">Discard</button>
                <button onClick={handleConfirmMove} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Check size={20} />Confirm Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 shrink-0"><Trash2 size={24} className="text-red-500" /></div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Delete Asset Node?</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Are you sure you want to delete <span className="text-slate-900 font-bold">"{nodeToDelete?.name}"</span>?</p>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-bold text-amber-700 leading-normal">Connected devices will be inherited by the parent node to prevent data loss.</p>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                <button onClick={() => { setAssets(prev => {
                  const updated = JSON.parse(JSON.stringify(prev));
                  const findAndRemove = (list: AssetNode[]) => {
                    const idx = list.findIndex(n => n.id === nodeToDelete?.id);
                    if (idx !== -1) { list.splice(idx, 1); return true; }
                    return list.some(n => n.children && findAndRemove(n.children));
                  };
                  findAndRemove(updated);
                  return updated;
                }); setNodeToDelete(null); setShowDeleteConfirm(false); }} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"><Check size={20} />Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

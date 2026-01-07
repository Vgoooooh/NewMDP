
import React from 'react';
import { 
  Building2, 
  Sprout, 
  ShoppingBag, 
  Zap, 
  Factory, 
  Home, 
  LucideIcon 
} from 'lucide-react';
import { IoTProjectCategory } from '../types';

interface ProjectIconProps {
  category: IoTProjectCategory;
  className?: string;
  size?: number;
  white?: boolean;
}

const IconMap: Record<IoTProjectCategory, LucideIcon> = {
  [IoTProjectCategory.SMART_BUILDING]: Building2,
  [IoTProjectCategory.SMART_FARM]: Sprout,
  [IoTProjectCategory.FLEET_MANAGEMENT]: ShoppingBag, // Using ShoppingBag for "Retail/Mall" style
  [IoTProjectCategory.ENERGY_MONITORING]: Zap,
  [IoTProjectCategory.INDUSTRIAL_IOT]: Factory,
  [IoTProjectCategory.SMART_HOME]: Home,
};

export const ProjectIcon: React.FC<ProjectIconProps> = ({ category, className = "", size = 32, white = false }) => {
  const Icon = IconMap[category] || Building2;
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <Icon size={size} className={white ? "text-white" : "text-current"} strokeWidth={1.5} />
    </div>
  );
};

import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface GaugeCardProps {
  title: string;
  value: number | string;
  unit?: string;
  type: 'temp' | 'hum' | 'gas';
  maxValue?: number;
}

const GaugeCard: React.FC<GaugeCardProps> = ({ title, value, unit, type, maxValue = 100 }) => {
  const getIcon = () => {
    switch (type) {
      case 'temp': return <Thermometer className="w-5 h-5 text-orange-500" />;
      case 'hum': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'gas': return <Wind className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getColor = () => {
    const numValue = Number(value);
    if (type === 'temp') {
      if (numValue > 30) return 'text-red-500';
      if (numValue > 25) return 'text-orange-500';
      return 'text-blue-400';
    }
    if (type === 'gas') {
      if (numValue > 600) return 'text-red-500';
      if (numValue > 300) return 'text-orange-500';
      return 'text-emerald-500';
    }
    return 'text-blue-500';
  };

  const progress = Math.min(Math.max((Number(value) / maxValue) * 100, 0), 100);

  return (
    <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">{title}</span>
        {getIcon()}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold tracking-tight ${getColor()}`}>
          {value}
        </span>
        <span className="text-slate-500 font-medium text-lg">{unit}</span>
      </div>

      {type === 'gas' && (
        <div className="mt-4">
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${
                progress > 60 ? 'bg-red-500' : progress > 30 ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-500">
            <span>0</span>
            <span>1023</span>
          </div>
        </div>
      )}
      
      {type === 'hum' && (
        <div className="mt-4">
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GaugeCard;

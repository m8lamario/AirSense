import React from 'react';
import { Activity, Clock } from 'lucide-react';

interface FooterProps {
  lastUpdate: string | undefined;
  sessionCount: number;
}

const Footer: React.FC<FooterProps> = ({ lastUpdate, sessionCount }) => {
  return (
    <footer className="mt-auto py-6 px-8 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Ultimo aggiornamento: <span className="text-slate-300 font-mono">{lastUpdate || '---'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Letture sessione: <span className="text-slate-300 font-bold">{sessionCount}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <span>© 2025</span>
        <span className="font-bold text-slate-400">AirSense IoT Systems</span>
        <span className="mx-2 text-slate-700">|</span>
        <span className="text-xs italic uppercase tracking-widest">Real-time monitoring active</span>
      </div>
    </footer>
  );
};

export default Footer;

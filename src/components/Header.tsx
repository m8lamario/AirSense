import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="font-bold text-white text-xl">A</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AirSense <span className="text-blue-500 text-sm font-normal">Dashboard</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50">
        <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm font-medium text-slate-300">
          {isConnected ? 'Connesso' : 'Disconnesso'}
        </span>
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
      </div>
    </header>
  );
};

export default Header;

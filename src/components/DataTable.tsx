import React from 'react';
import { AirData } from '../hooks/useAirSense';

interface DataTableProps {
  history: AirData[];
}

const DataTable: React.FC<DataTableProps> = ({ history }) => {
  // Prendiamo le ultime 10 e le invertiamo per avere la più recente in cima
  const last10 = [...history].slice(-10).reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BUONO': return 'text-emerald-500 bg-emerald-500/10';
      case 'ATTENZIONE': return 'text-orange-500 bg-orange-500/10';
      case 'CRITICO': return 'text-red-500 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-700">
        <h3 className="text-slate-300 font-semibold uppercase tracking-wider text-sm">
          Ultime Letture
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Orario</th>
              <th className="px-6 py-4">Temperatura</th>
              <th className="px-6 py-4">Gas (CO2 eq)</th>
              <th className="px-6 py-4 text-center">Stato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {last10.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                  In attesa di dati...
                </td>
              </tr>
            ) : (
              last10.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {new Date(row.ts).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {row.temp.toFixed(1)} °C
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {row.gas}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${getStatusColor(row.stato)}`}>
                        {row.stato}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

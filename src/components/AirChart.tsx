import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { AirData } from '../hooks/useAirSense';

interface AirChartProps {
  data: AirData[];
}

const AirChart: React.FC<AirChartProps> = ({ data }) => {
  // Formattazione timestamp per l'asse X
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));

  return (
    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl shadow-xl h-[400px]">
      <h3 className="text-slate-300 font-semibold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        Andamento Storico (Ultime 50 letture)
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          
          {/* Asse Y Sinistro per Temperatura */}
          <YAxis 
            yAxisId="left"
            stroke="#f97316" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            unit="°C"
            domain={['auto', 'auto']}
          />
          
          {/* Asse Y Destro per Gas */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#10b981" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            unit=""
            domain={[0, 1023]}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="temp"
            name="Temperatura"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
            animationDuration={300}
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="gas"
            name="Qualità Gas"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            animationDuration={300}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AirChart;

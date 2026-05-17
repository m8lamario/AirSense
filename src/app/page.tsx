'use client';

import React from 'react';
import Header from '@/components/Header';
import GaugeCard from '@/components/GaugeCard';
import StatusBadge from '@/components/StatusBadge';
import AirChart from '@/components/AirChart';
import DataTable from '@/components/DataTable';
import Footer from '@/components/Footer';
import { useAirSense } from '@/hooks/useAirSense';

export default function Dashboard() {
  const { data, history, isConnected, sessionCount } = useAirSense();

  // Formattazione timestamp per il footer
  const lastUpdate = data?.ts 
    ? new Date(data.ts).toLocaleTimeString() 
    : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-grow p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto w-full">
        
        {/* Sezione Top Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GaugeCard 
            title="Temperatura" 
            value={data?.temp ?? '--.-'} 
            unit="°C" 
            type="temp" 
          />
          <GaugeCard 
            title="Qualità Aria (Gas)" 
            value={data?.gas ?? '---'} 
            unit="CO2eq" 
            type="gas" 
            maxValue={1023}
          />
          <GaugeCard 
            title="Umidità" 
            value={data?.hum ?? '--'} 
            unit="%" 
            type="hum" 
          />
        </section>

        {/* Sezione Stato Centrale */}
        <section className="py-4">
          <StatusBadge status={data?.stato ?? 'BUONO'} />
        </section>

        {/* Sezione Grafico e Tabella */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AirChart data={history} />
          <DataTable history={history} />
        </section>
        
      </main>

      <Footer lastUpdate={lastUpdate} sessionCount={sessionCount} />
    </div>
  );
}

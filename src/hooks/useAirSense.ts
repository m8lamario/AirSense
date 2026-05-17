import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface AirData {
  temp: number;
  hum: number;
  gas: number;
  stato: 'BUONO' | 'ATTENZIONE' | 'CRITICO';
  ts: string;
}

const BACKEND_URL = 'http://localhost:5000';

export const useAirSense = () => {
  const [data, setData] = useState<AirData | null>(null);
  const [history, setHistory] = useState<AirData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Funzione per caricare lo storico iniziale
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/history`);
      if (response.ok) {
        const historyData: AirData[] = await response.json();
        // Prendiamo solo le ultime 50 per il grafico come richiesto
        setHistory(historyData.slice(-50));
      }
    } catch (error) {
      console.error('Errore durante il caricamento dello storico:', error);
    }
  }, []);

  useEffect(() => {
    // Caricamento iniziale
    fetchHistory();

    // Configurazione Socket.IO
    const socket: Socket = io(BACKEND_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connesso al server AirSense');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnesso dal server AirSense');
    });

    socket.on('new_data', (newData: AirData) => {
      setData(newData);
      setSessionCount((prev) => prev + 1);
      
      // Aggiorna lo storico: aggiungi il nuovo dato e tieni le ultime 50
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory, newData];
        return newHistory.slice(-50);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchHistory]);

  return {
    data,
    history,
    isConnected,
    sessionCount,
  };
};

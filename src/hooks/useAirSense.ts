import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

export interface AirData {
  temp: number;
  hum: number;
  gas: number;
  stato: 'BUONO' | 'ATTENZIONE' | 'CRITICO';
  ts: string;
}

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? '';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? '';
const PUSHER_CHANNEL = 'airsense';
const PUSHER_EVENT = 'new_data';
const MAX_HISTORY = 100;

export const useAirSense = () => {
  const [data, setData] = useState<AirData | null>(null);
  const [history, setHistory] = useState<AirData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!PUSHER_KEY || !PUSHER_CLUSTER) {
      console.error('Config Pusher mancante: NEXT_PUBLIC_PUSHER_KEY e NEXT_PUBLIC_PUSHER_CLUSTER.');
      return;
    }

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(PUSHER_CHANNEL);

    const handleStateChange = (states: { previous: string; current: string }) => {
      setIsConnected(states.current === 'connected');
    };

    const handleData = (newData: AirData) => {
      setData(newData);
      setSessionCount((prev) => prev + 1);

      setHistory((prevHistory) => {
        const newHistory = [...prevHistory, newData];
        return newHistory.slice(-MAX_HISTORY);
      });
    };

    pusher.connection.bind('state_change', handleStateChange);
    channel.bind(PUSHER_EVENT, handleData);

    return () => {
      channel.unbind(PUSHER_EVENT, handleData);
      pusher.connection.unbind('state_change', handleStateChange);
      pusher.unsubscribe(PUSHER_CHANNEL);
      pusher.disconnect();
    };
  }, []);

  return {
    data,
    history,
    isConnected,
    sessionCount,
  };
};

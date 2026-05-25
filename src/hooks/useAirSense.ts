import { useState, useEffect, useRef } from 'react';
import Pusher, { type Channel } from 'pusher-js';

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
const FALLBACK_INTERVAL_MS = 5000;
const FALLBACK_STALE_MS = 15000;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const jitterValue = (value: number, range: number, min: number, max: number) =>
  clampValue(value + (Math.random() * 2 - 1) * range, min, max);

const getFallbackStatus = (gas: number): AirData['stato'] => {
  if (gas > 800) return 'CRITICO';
  if (gas > 600) return 'ATTENZIONE';
  return 'BUONO';
};

const createFallbackData = (previous: AirData | null): AirData => {
  const temp = jitterValue(previous?.temp ?? 22, 0.4, 20, 25);
  const hum = jitterValue(previous?.hum ?? 45, 3, 35, 60);
  const gas = jitterValue(previous?.gas ?? 420, 25, 350, 550);
  const roundedGas = Math.round(gas);

  return {
    temp: Number(temp.toFixed(1)),
    hum: Math.round(hum),
    gas: roundedGas,
    stato: getFallbackStatus(roundedGas),
    ts: new Date().toISOString(),
  };
};

export const useAirSense = () => {
  const [data, setData] = useState<AirData | null>(null);
  const [history, setHistory] = useState<AirData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const dataRef = useRef<AirData | null>(null);
  const lastRealDataAt = useRef(0);

  useEffect(() => {
    let pusher: Pusher | null = null;
    let channel: Channel | null = null;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;

    const addData = (newData: AirData) => {
      dataRef.current = newData;
      setData(newData);
      setSessionCount((prev) => prev + 1);

      setHistory((prevHistory) => {
        const newHistory = [...prevHistory, newData];
        return newHistory.slice(-MAX_HISTORY);
      });
    };

    const maybeAddFallback = () => {
      const now = Date.now();
      if (lastRealDataAt.current && now - lastRealDataAt.current <= FALLBACK_STALE_MS) {
        return;
      }
      addData(createFallbackData(dataRef.current));
    };

    fallbackTimer = setInterval(maybeAddFallback, FALLBACK_INTERVAL_MS);
    maybeAddFallback();

    if (!PUSHER_KEY || !PUSHER_CLUSTER) {
      console.error('Config Pusher mancante: NEXT_PUBLIC_PUSHER_KEY e NEXT_PUBLIC_PUSHER_CLUSTER.');
      return () => {
        if (fallbackTimer) {
          clearInterval(fallbackTimer);
        }
      };
    }

    pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });

    channel = pusher.subscribe(PUSHER_CHANNEL);

    const handleStateChange = (states: { previous: string; current: string }) => {
      setIsConnected(states.current === 'connected');
    };

    const handleData = (newData: AirData) => {
      lastRealDataAt.current = Date.now();
      addData(newData);
    };

    pusher.connection.bind('state_change', handleStateChange);
    channel.bind(PUSHER_EVENT, handleData);

    return () => {
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
      }
      channel?.unbind(PUSHER_EVENT, handleData);
      pusher?.connection.unbind('state_change', handleStateChange);
      pusher?.unsubscribe(PUSHER_CHANNEL);
      pusher?.disconnect();
    };
  }, []);

  return {
    data,
    history,
    isConnected,
    sessionCount,
  };
};

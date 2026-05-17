import React, { useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface StatusBadgeProps {
  status: 'BUONO' | 'ATTENZIONE' | 'CRITICO';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === 'CRITICO' && prevStatus.current !== 'CRITICO') {
      // Beep opzionale per allarme critico
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        console.warn('Audio non supportato o bloccato dal browser');
      }
    }
    prevStatus.current = status;
  }, [status]);

  const getStyles = () => {
    switch (status) {
      case 'BUONO':
        return {
          container: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500',
          icon: <ShieldCheck className="w-8 h-8" />,
          label: 'Qualità Aria Ottima',
          animation: ''
        };
      case 'ATTENZIONE':
        return {
          container: 'bg-orange-500/10 border-orange-500/50 text-orange-500 animate-pulse-slow',
          icon: <ShieldAlert className="w-8 h-8" />,
          label: 'Attenzione Necessaria',
          animation: 'animate-pulse'
        };
      case 'CRITICO':
        return {
          container: 'bg-red-500/20 border-red-500/50 text-red-500 border-2 animate-flash',
          icon: <ShieldX className="w-8 h-8" />,
          label: 'PERICOLO - CRITICO',
          animation: 'animate-bounce'
        };
      default:
        return {
          container: 'bg-slate-500/10 border-slate-500/50 text-slate-500',
          icon: <ShieldAlert className="w-8 h-8" />,
          label: 'Stato Sconosciuto',
          animation: ''
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-500 w-full max-w-2xl mx-auto shadow-2xl ${styles.container}`}>
      <div className={`mb-4 p-4 bg-white/5 rounded-full ${styles.animation}`}>
        {styles.icon}
      </div>
      <span className="text-4xl font-black uppercase tracking-tighter mb-2">
        {status}
      </span>
      <p className="text-lg font-medium opacity-80 uppercase tracking-widest">
        {styles.label}
      </p>
    </div>
  );
};

export default StatusBadge;

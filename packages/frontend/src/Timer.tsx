import type { Timer } from '@pomi/shared/src/types';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
  path: '/socket.io'
});

export function Timer() {
  const [timer, setTimer] = useState<Timer | null>(null);

  useEffect(() => {

    socket.on('timerUpdate', (updatedTimer: Timer) => {
      setTimer(updatedTimer);
    });

    return () => {
      socket.off('timerUpdate');
    };
  }, []);

  const startTimer = () => {
    socket.emit('startTimer');
  };

  const pauseTimer = () => {
    socket.emit('pauseTimer');
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      {timer && (
        <div>
          <p>Time Remaining: {timer.duration}</p>
          <p>Type: {timer.type}</p>
          <p>Status: {timer.status}</p>
        </div>
      )}
      <button onClick={startTimer}>Start</button>
      <button onClick={pauseTimer}>Pause</button>
    </div>
  );
}
import type { Timer } from '@pomi/shared/src/types';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { environment_variables } from './config/environment_variables';

const socket = io(`ws://${environment_variables.BACKEND_URL}`,{
  transports: ['websocket'],
  path: '/socket.io'
});

export function Timer() {
  const [timer, setTimer] = useState<Timer | null>(null);
       
  useEffect(() => {
    fetch(`http://${environment_variables.BACKEND_URL}/timer`)
      .then(res => res.json())
      .then(timer => timer && setTimer(timer));

    socket.on('timerUpdate', (updatedTimer: Timer) => {
      setTimer(updatedTimer);
    });

    return () => {
      socket.off('timerUpdate');
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
          <p>Time Remaining: {formatTime(timer.remainingTime)}</p>
          <p>Type: {timer.type}</p>
          <p>Status: {timer.status}</p>
        </div>
      )}
      <button onClick={startTimer} disabled={timer?.status === 'running'}>
        Start
      </button>
      <button onClick={pauseTimer} disabled={timer?.status !== 'running'}>
        Pause
      </button>
    </div>
  );
}
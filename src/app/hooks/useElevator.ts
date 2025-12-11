import { useState, useEffect, useCallback } from 'react';

const FLOORS = [5, 4, 3, 2, 1, 0];
const DRIVE_DELAY_MS = 1000;
const DOOR_DELAY_MS = 1500;

// Helper: Pure function (outside component)
const getNextDirection = (floor: number, reqs: number[], curDir: string) => {
  if (!reqs.length) return 'IDLE';
  
  const above = reqs.some(r => r > floor);
  const below = reqs.some(r => r < floor);

  if (curDir === 'UP') return above ? 'UP' : (below ? 'DOWN' : 'IDLE');
  if (curDir === 'DOWN') return below ? 'DOWN' : (above ? 'UP' : 'IDLE');
  
  // If IDLE, pick nearest
  const nearest = reqs.reduce((a, b) => Math.abs(b - floor) < Math.abs(a - floor) ? b : a);
  return nearest > floor ? 'UP' : 'DOWN';
};

export const useElevator = () => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'MOVING' | 'DOORS'>('IDLE');
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'IDLE'>('IDLE');
  const [requests, setRequests] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // 1. DOORS OPEN: Wait, then Close
    if (status === 'DOORS') {
      timer = setTimeout(() => {
        setRequests(prev => prev.filter(r => r !== currentFloor));
        setStatus('IDLE');
      }, DOOR_DELAY_MS);
    } 
    
    // 2. IDLE OR MOVING
    else {
      if (requests.length > 0) {
        // A. Arrival: Open Doors
        if (requests.includes(currentFloor)) {
          // Small delay prevents sync render loop
          timer = setTimeout(() => setStatus('DOORS'), 100); 
        } 
        // B. Drive Logic
        else {
          const nextDir = getNextDirection(currentFloor, requests, direction);
          
          // If we need to change direction or start moving
          if (direction !== nextDir || status !== 'MOVING') {
            // FIX: Wrap in timeout to make update asynchronous
            timer = setTimeout(() => {
              setDirection(nextDir as 'UP' | 'DOWN');
              setStatus('MOVING');
            }, 50); 
          } 
          // If we are already moving in right direction, drive floor
          else {
            timer = setTimeout(() => {
              setCurrentFloor(prev => nextDir === 'UP' ? prev + 1 : prev - 1);
            }, DRIVE_DELAY_MS);
          }
        }
      } else {
        // 3. No Requests: Go Idle
        // FIX: Wrap this too to prevent sync render loop on idle transition
        if (status !== 'IDLE' || direction !== 'IDLE') {
          timer = setTimeout(() => {
              setStatus('IDLE');
              setDirection('IDLE');
          }, 50);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [currentFloor, status, direction, requests]);

  const addRequest = useCallback((floor: number) => {
    setRequests(prev => prev.includes(floor) ? prev : [...prev, floor]);
  }, []);

  return { 
    currentFloor, 
    direction, 
    requests, 
    status, 
    addRequest, 
    FLOORS, 
    isMoving: status !== 'IDLE' 
  };
};
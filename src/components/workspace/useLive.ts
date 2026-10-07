import { useEffect, useState } from 'react';

export type LiveEvent = {
  topic: string;
  op: 'CREATE' | 'UPDATE' | 'DELETE' | 'RELOAD' | 'APPEND';
  id?: string;
  data?: any;
};

export function useLive(topic: string, onEvent?: (event: LiveEvent) => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to SSE stream
    const eventSource = new EventSource('/api/workspace/stream');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        const event: LiveEvent = JSON.parse(e.data);
        if (event.topic === topic || topic === '*') {
          onEvent?.(event);
        }
      } catch (err) {
        console.error('Failed to parse live event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // EventSource auto-reconnects, but we might want to handle fatal errors
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [topic, onEvent]);

  return { isConnected };
}

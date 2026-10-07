import { EventEmitter } from 'events';

const globalForEventBus = globalThis as unknown as {
  eventBus: EventEmitter | undefined;
};

// Singleton EventBus for local development
export const eventBus = globalForEventBus.eventBus ?? new EventEmitter();

// Increase max listeners as many components might subscribe
eventBus.setMaxListeners(50);

if (process.env.NODE_ENV !== 'production') {
  globalForEventBus.eventBus = eventBus;
}

export type LiveEvent = {
  topic: string;
  op: 'CREATE' | 'UPDATE' | 'DELETE' | 'RELOAD' | 'APPEND';
  id?: string;
  data?: any;
};

export function emitLiveEvent(event: LiveEvent) {
  eventBus.emit('live-event', event);
}

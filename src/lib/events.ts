import { EventEmitter } from 'node:events';

export type EventType =
  | 'appointment.created'
  | 'appointment.updated'
  | 'message.created'
  | 'message.updated'
  | 'journey.updated'
  | 'alert.created'
  | 'alert.resolved'
  | 'demo.reset';

export interface AppEvent {
  type: EventType;
  payload: unknown;
  at: string;
}

const bus = new EventEmitter();
bus.setMaxListeners(0);

export function publish(type: EventType, payload: unknown) {
  const event: AppEvent = { type, payload, at: new Date().toISOString() };
  bus.emit('event', event);
  return event;
}

export function subscribe(fn: (e: AppEvent) => void) {
  bus.on('event', fn);
  return () => bus.off('event', fn);
}

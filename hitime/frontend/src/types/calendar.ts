export type EventType = 'event' | 'task' | 'habit' | 'travel' | 'custom';

export interface BaseEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  start: string; // ISO8601
  end: string;   // ISO8601
  allDay?: boolean;
  color?: string;
  createdBy: string;
  calendarId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event extends BaseEvent {
  type: 'event';
  participants?: string[];
  location?: string;
}

export interface Task extends BaseEvent {
  type: 'task';
  completed: boolean;
  due: string;
  checklist?: { id: string; text: string; done: boolean }[];
  priority?: 'low' | 'medium' | 'high';
}

export interface Habit extends BaseEvent {
  type: 'habit';
  streak: number;
  history: string[]; // 完成日期 ISO 字符串数组
  badge?: string;
}

export interface Travel extends BaseEvent {
  type: 'travel';
  route?: string;
  transport?: 'car' | 'bus' | 'train' | 'plane' | 'walk' | 'bike';
  mapUrl?: string;
}

export interface Custom extends BaseEvent {
  type: 'custom';
  fields: Record<string, any>;
} 
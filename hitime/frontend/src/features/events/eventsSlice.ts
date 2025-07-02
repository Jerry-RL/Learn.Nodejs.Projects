import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, Task, Habit, Travel, Custom } from '../../types/calendar';

export type CalendarEvent = Event | Task | Habit | Travel | Custom;

interface EventsState {
  items: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<CalendarEvent[]>) {
      state.items = action.payload;
    },
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.items.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setEvents, addEvent, setLoading, setError } = eventsSlice.actions;
export default eventsSlice.reducer; 
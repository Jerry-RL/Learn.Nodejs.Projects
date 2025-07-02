import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Reminder {
  id: string;
  eventId: string;
  time: string;
  message: string;
}

interface RemindersState {
  items: Reminder[];
  loading: boolean;
  error: string | null;
}

const initialState: RemindersState = {
  items: [],
  loading: false,
  error: null,
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders(state, action: PayloadAction<Reminder[]>) {
      state.items = action.payload;
    },
    addReminder(state, action: PayloadAction<Reminder>) {
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

export const { setReminders, addReminder, setLoading, setError } = remindersSlice.actions;
export default remindersSlice.reducer; 
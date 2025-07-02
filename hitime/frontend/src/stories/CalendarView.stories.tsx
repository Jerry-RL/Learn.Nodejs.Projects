import React from 'react';
import CalendarView from '../components/calendar/CalendarView';

export default {
  title: 'Components/CalendarView',
  component: CalendarView,
};

export const Default = () => <CalendarView onAddEvent={() => alert('Add Event')} />; 
import React, { useState } from 'react';
import MonthCalendar from './MonthCalendar';
import WeekCalendar from './WeekCalendar';
import DayCalendar from './DayCalendar';
import AgendaList from './AgendaList';
import TimelineView from './TimelineView';

const views = ['month', 'week', 'day', 'agenda', 'timeline'] as const;
type CalendarViewType = typeof views[number];

const CalendarView: React.FC = () => {
  const [view, setView] = useState<CalendarViewType>('month');
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-4">
        {views.map(v => (
          <button
            key={v}
            className={`px-3 py-1 rounded ${view === v ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {view === 'month' && <MonthCalendar />}
        {view === 'week' && <WeekCalendar />}
        {view === 'day' && <DayCalendar />}
        {view === 'agenda' && <AgendaList />}
        {view === 'timeline' && <TimelineView />}
      </div>
    </div>
  );
};

export default CalendarView; 
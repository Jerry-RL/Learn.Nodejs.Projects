import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import CalendarView from '../../components/calendar/CalendarView';

const Dashboard: React.FC = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 p-4">
      <CalendarView />
    </main>
  </div>
);

export default Dashboard; 
import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import CalendarView from '../components/calendar/CalendarView';
import EventModal from '../components/modal/EventModal';
import { useTranslation } from 'react-i18next';

const IndexPage: React.FC = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onAddEvent={() => setModalOpen(true)} />
      <main className="flex-1 p-4">
        <CalendarView onAddEvent={() => setModalOpen(true)} />
      </main>
      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default IndexPage; 
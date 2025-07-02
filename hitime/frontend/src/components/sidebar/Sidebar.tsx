import React from 'react';
import { useTranslation } from 'react-i18next';

type SidebarProps = {
  onAddEvent: () => void;
};

const eventTypes = [
  { key: 'event', color: 'primary' },
  { key: 'task', color: 'secondary' },
  { key: 'habit', color: 'success' },
  { key: 'travel', color: 'warning' },
  { key: 'custom', color: 'danger' },
];

const Sidebar: React.FC<SidebarProps> = ({ onAddEvent }) => {
  const { t } = useTranslation();
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-neumorph flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">{t('calendar')}</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {eventTypes.map(type => (
          <li key={type.key} className={`rounded-lg px-3 py-2 cursor-pointer bg-${type.color}-100 dark:bg-${type.color}-900`}>{t(type.key)}</li>
        ))}
      </ul>
      <button
        className="mt-auto bg-primary text-white rounded-xl py-2 px-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={onAddEvent}
        tabIndex={0}
        aria-label={t('add_event')}
      >
        {t('add_event')}
      </button>
    </aside>
  );
};

export default Sidebar; 
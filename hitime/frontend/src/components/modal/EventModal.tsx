import React from 'react';
import { useTranslation } from 'react-i18next';

type EventModalProps = {
  open: boolean;
  onClose: () => void;
};

const EventModal: React.FC<EventModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('add_event')}</h2>
        {/* 表单内容占位 */}
        <div className="flex flex-col gap-2 mb-4 text-gray-400">[ 事件表单 ]</div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700" onClick={onClose}>{t('cancel')}</button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white">{t('save')}</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 
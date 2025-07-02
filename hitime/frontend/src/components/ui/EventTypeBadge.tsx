import React from 'react';

type Props = { type: 'activity' | 'task' | 'habit' | 'travel' | 'custom' };

const typeConfig = {
  activity: { color: 'bg-blue-500', label: '活动' },
  task: { color: 'bg-amber-500', label: '任务' },
  habit: { color: 'bg-emerald-500', label: '习惯' },
  travel: { color: 'bg-purple-500', label: '行程' },
  custom: { color: 'bg-pink-500', label: '自定义' },
};

const EventTypeBadge: React.FC<Props> = ({ type }) => {
  const config = typeConfig[type];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
      {config.label}
    </span>
  );
};

export default EventTypeBadge; 
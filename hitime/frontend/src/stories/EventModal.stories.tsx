import React from 'react';
import EventModal from '../components/modal/EventModal';

export default {
  title: 'Components/EventModal',
  component: EventModal,
};

export const Open = () => <EventModal open={true} onClose={() => alert('Close Modal')} />; 
import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

export const Default = () => <Sidebar onAddEvent={() => alert('Add Event')} />; 
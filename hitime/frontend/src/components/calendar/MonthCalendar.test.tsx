import { render, screen } from '@testing-library/react';
import MonthCalendar from './MonthCalendar';
import { describe, it, expect } from 'vitest';

describe('MonthCalendar', () => {
  it('renders month view placeholder', () => {
    render(<MonthCalendar />);
    expect(screen.getByText(/月视图内容占位/)).toBeInTheDocument();
  });
}); 
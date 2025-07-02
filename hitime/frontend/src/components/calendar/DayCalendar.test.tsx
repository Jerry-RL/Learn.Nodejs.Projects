import { render, screen } from '@testing-library/react';
import DayCalendar from './DayCalendar';
import { describe, it, expect } from 'vitest';

describe('DayCalendar', () => {
  it('renders day view placeholder', () => {
    render(<DayCalendar />);
    expect(screen.getByText(/日视图内容占位/)).toBeInTheDocument();
  });
}); 
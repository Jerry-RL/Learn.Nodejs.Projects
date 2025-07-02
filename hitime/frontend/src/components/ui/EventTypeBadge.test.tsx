import { render, screen } from '@testing-library/react';
import EventTypeBadge from './EventTypeBadge';
import { describe, it, expect } from 'vitest';

describe('EventTypeBadge', () => {
  it('renders activity badge', () => {
    render(<EventTypeBadge type="activity" />);
    expect(screen.getByText('活动')).toBeInTheDocument();
  });
  it('renders task badge', () => {
    render(<EventTypeBadge type="task" />);
    expect(screen.getByText('任务')).toBeInTheDocument();
  });
  it('renders habit badge', () => {
    render(<EventTypeBadge type="habit" />);
    expect(screen.getByText('习惯')).toBeInTheDocument();
  });
  it('renders travel badge', () => {
    render(<EventTypeBadge type="travel" />);
    expect(screen.getByText('行程')).toBeInTheDocument();
  });
  it('renders custom badge', () => {
    render(<EventTypeBadge type="custom" />);
    expect(screen.getByText('自定义')).toBeInTheDocument();
  });
}); 
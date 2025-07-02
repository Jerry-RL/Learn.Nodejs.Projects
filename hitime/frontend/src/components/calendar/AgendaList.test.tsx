import { render, screen } from '@testing-library/react';
import AgendaList from './AgendaList';
import { describe, it, expect } from 'vitest';

describe('AgendaList', () => {
  it('renders agenda view placeholder', () => {
    render(<AgendaList />);
    expect(screen.getByText(/议程视图内容占位/)).toBeInTheDocument();
  });
}); 
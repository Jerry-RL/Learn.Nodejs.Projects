import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('Sidebar', () => {
  it('renders navigation links and add event button', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    expect(screen.getByText('HiTime')).toBeInTheDocument();
    expect(screen.getByText('日历')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
    expect(screen.getByText('+ 添加事件')).toBeInTheDocument();
  });
}); 
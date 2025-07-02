import authReducer, { setUser, setLoading, setError, logout } from './authSlice';
import { describe, it, expect } from 'vitest';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

describe('authSlice', () => {
  it('should handle setUser', () => {
    const user = { id: '1', username: 'test', email: 'test@test.com' };
    const nextState = authReducer(initialState, setUser(user));
    expect(nextState.user).toEqual(user);
  });

  it('should handle setLoading', () => {
    const nextState = authReducer(initialState, setLoading(true));
    expect(nextState.loading).toBe(true);
  });

  it('should handle setError', () => {
    const nextState = authReducer(initialState, setError('error'));
    expect(nextState.error).toBe('error');
  });

  it('should handle logout', () => {
    const state = { ...initialState, user: { id: '1', username: 'test', email: 'test@test.com' } };
    const nextState = authReducer(state, logout());
    expect(nextState.user).toBe(null);
  });
}); 
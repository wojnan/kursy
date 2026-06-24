import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AuthProvider, useAuth } from '../app/contexts/AuthContext'

function TestComponent() {
  const { user, isAuthenticated, loading, loginWithGoogle, logout, refreshUser } =
    useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </p>

      <p data-testid="user-name">{user?.name ?? 'no-user'}</p>

      <button onClick={loginWithGoogle}>Login with Google</button>
      <button onClick={logout}>Logout</button>
      <button onClick={refreshUser}>Refresh User</button>
    </div>
  )
}

describe('AuthContext', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.restoreAllMocks()

    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
  })

  it('loads current user and sets authenticated state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
        }),
      })
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'authenticated'
      )
    })

    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8081/users/me', {
      credentials: 'include',
    })
  })

  it('sets user to null when backend returns unauthorized response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated'
      )
    })

    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
  })

  it('sets user to null when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'not-authenticated'
      )
    })

    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
  })

  it('redirects user to Google OAuth login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Login with Google')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Login with Google'))

    expect(window.location.href).toBe(
      'http://localhost:8081/oauth2/authorization/google'
    )
  })

  it('logs out user and redirects to backend logout endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
        }),
      })
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'authenticated'
      )
    })

    await userEvent.click(screen.getByText('Logout'))

    expect(window.location.href).toBe('http://localhost:8081/logout')
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    function BrokenComponent() {
      useAuth()
      return <div>Broken</div>
    }

    expect(() => render(<BrokenComponent />)).toThrow(
      'useAuth must be used within AuthProvider'
    )
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PurchaseProvider, usePurchase } from '../app/contexts/PurchaseContext'
import { AuthProvider } from '../app/contexts/AuthContext'
import { getUserPurchases } from '../app/services/database'

vi.mock('../app/services/database', () => ({
  getUserPurchases: vi.fn(),
}))

function TestComponent() {
  const { purchasedCourses, hasPurchased, refreshPurchases } = usePurchase()

  return (
    <div>
      <p data-testid="purchase-count">{purchasedCourses.size}</p>
      <p data-testid="has-course-10">
        {hasPurchased('10') ? 'yes' : 'no'}
      </p>
      <button onClick={refreshPurchases}>Refresh Purchases</button>
    </div>
  )
}

function renderWithProviders() {
  return render(
    <AuthProvider>
      <PurchaseProvider>
        <TestComponent />
      </PurchaseProvider>
    </AuthProvider>
  )
}

describe('PurchaseContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads purchased courses for authenticated user', async () => {
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

    vi.mocked(getUserPurchases).mockResolvedValue([
      { courseId: 10 },
      { course_id: 20 },
    ] as any)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('2')
    })

    expect(screen.getByTestId('has-course-10')).toHaveTextContent('yes')
    expect(getUserPurchases).toHaveBeenCalledWith(1)
  })

  it('clears purchases when user is not authenticated', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('0')
    })

    expect(screen.getByTestId('has-course-10')).toHaveTextContent('no')
    expect(getUserPurchases).not.toHaveBeenCalled()
  })

  it('clears purchases when loading purchases fails', async () => {
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

    vi.mocked(getUserPurchases).mockRejectedValue(new Error('API error'))

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('0')
    })

    expect(screen.getByTestId('has-course-10')).toHaveTextContent('no')
  })

  it('refreshes purchases manually', async () => {
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

    vi.mocked(getUserPurchases).mockResolvedValue([{ courseId: 10 }] as any)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByTestId('purchase-count')).toHaveTextContent('1')
    })

    await userEvent.click(screen.getByText('Refresh Purchases'))

    expect(getUserPurchases).toHaveBeenCalledWith(1)
  })

  it('throws error when usePurchase is used outside PurchaseProvider', () => {
    function BrokenComponent() {
      usePurchase()
      return <div>Broken</div>
    }

    expect(() => render(<BrokenComponent />)).toThrow(
      'usePurchase must be used within a PurchaseProvider'
    )
  })
})
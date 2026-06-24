import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { ShoppingCartSheet } from '../app/components/ShoppingCart'
import { CartProvider, useCart } from '../app/contexts/CartContext'
import { AuthProvider } from '../app/contexts/AuthContext'
import { createCheckoutSession } from '../app/services/database'

vi.mock('../app/services/database', async () => {
  const actual = await vi.importActual('../app/services/database')
  return {
    ...actual,
    createCheckoutSession: vi.fn(),
  }
})

vi.mock('../app/components/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid="cart-image" />
  ),
}))

function AddCourseButton() {
  const { addToCart } = useCart()

  const course = {
    id: '10',
    title: 'React Course',
    instructor: 'John Doe',
    price: 99,
    image: '/react.jpg',
  } as any

  return <button onClick={() => addToCart(course)}>Add Test Course</button>
}

function renderCart(fetchResponse: any) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fetchResponse))

  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <AddCourseButton />
          <ShoppingCartSheet />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

async function openCart() {
  const buttons = screen.getAllByRole('button')
  const cartButton = buttons.find(
    (button) => !button.textContent?.includes('Add Test Course')
  )

  expect(cartButton).toBeDefined()

  await userEvent.click(cartButton!)
}

describe('ShoppingCartSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    vi.stubGlobal('alert', vi.fn())
  })

  it('shows empty cart message', async () => {
    renderCart({ ok: false })

    await openCart()

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Add courses to get started')).toBeInTheDocument()
    expect(screen.getByText('Browse Courses')).toBeInTheDocument()
  })

  it('shows cart item and total after adding course', async () => {
    renderCart({ ok: false })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()

    expect(screen.getByText('Shopping Cart (1)')).toBeInTheDocument()
    expect(screen.getByText('React Course')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('$99')).toBeInTheDocument()
    expect(screen.getByText('$99.00')).toBeInTheDocument()
  })

  it('removes item from cart', async () => {
    renderCart({ ok: false })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()

    expect(screen.getByText('React Course')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    const removeButton = buttons.find(
      (button) =>
        button !== screen.getByText('Add Test Course') &&
        button.textContent === ''
    )

    expect(removeButton).toBeDefined()

    await userEvent.click(removeButton!)

    await waitFor(() => {
      expect(screen.queryByText('React Course')).not.toBeInTheDocument()
    })
  })

  it('clears cart', async () => {
    renderCart({ ok: false })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()

    await userEvent.click(screen.getByText('Clear Cart'))

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('redirects to Google login when checkout is clicked without user', async () => {
    renderCart({ ok: false })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()

    await userEvent.click(screen.getByText('Checkout'))

    expect(window.location.href).toBe(
      'http://localhost:8081/oauth2/authorization/google'
    )
  })

  it('creates checkout session when user is authenticated', async () => {
    vi.mocked(createCheckoutSession).mockResolvedValue({
      url: 'https://stripe.test/checkout',
    } as any)

    renderCart({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
      }),
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()
    await userEvent.click(screen.getByText('Checkout'))

    await waitFor(() => {
      expect(createCheckoutSession).toHaveBeenCalledWith({
        userId: 1,
        courseId: '10',
        courseTitle: 'React Course',
        amount: 9900,
      })
    })

    expect(window.location.href).toBe('https://stripe.test/checkout')
  })

  it('shows alert when checkout fails', async () => {
    vi.mocked(createCheckoutSession).mockRejectedValue(new Error('Stripe error'))

    renderCart({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
      }),
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    await userEvent.click(screen.getByText('Add Test Course'))
    await openCart()
    await userEvent.click(screen.getByText('Checkout'))

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Failed to start checkout.')
    })
  })
})
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../app/contexts/CartContext'

function TestComponent() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartTotal,
  } = useCart()

  const course = {
    id: 'course-1',
    title: 'React Course',
    price: 100,
  } as any

  const secondCourse = {
    id: 'course-2',
    title: 'TypeScript Course',
    price: 50,
  } as any

  return (
    <div>
      <p data-testid="cart-count">{cartItems.length}</p>
      <p data-testid="cart-total">{cartTotal}</p>
      <p data-testid="is-in-cart">
        {isInCart('course-1') ? 'yes' : 'no'}
      </p>

      <button onClick={() => addToCart(course)}>Add Course</button>
      <button onClick={() => addToCart(secondCourse)}>Add Second Course</button>
      <button onClick={() => removeFromCart('course-1')}>
        Remove Course
      </button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
    expect(screen.getByTestId('is-in-cart')).toHaveTextContent('no')
  })

  it('adds course to cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await userEvent.click(screen.getByText('Add Course'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('100')
    expect(screen.getByTestId('is-in-cart')).toHaveTextContent('yes')
  })

  it('does not add duplicate course', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await userEvent.click(screen.getByText('Add Course'))
    await userEvent.click(screen.getByText('Add Course'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('100')
  })

  it('removes course from cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await userEvent.click(screen.getByText('Add Course'))
    await userEvent.click(screen.getByText('Remove Course'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
    expect(screen.getByTestId('is-in-cart')).toHaveTextContent('no')
  })

  it('clears cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await userEvent.click(screen.getByText('Add Course'))
    await userEvent.click(screen.getByText('Add Second Course'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('150')

    await userEvent.click(screen.getByText('Clear Cart'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  it('throws error when useCart is used outside CartProvider', () => {
    function BrokenComponent() {
      useCart()
      return <div>Broken</div>
    }

    expect(() => render(<BrokenComponent />)).toThrow(
      'useCart must be used within CartProvider'
    )
  })
})
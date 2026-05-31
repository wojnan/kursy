import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { CartProvider } from './contexts/CartContext';

export function Root() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Outlet />
      </div>
    </CartProvider>
  );
}
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { PurchaseProvider } from './contexts/PurchaseContext';

export default function App() {
  return (
    <AuthProvider>
      <PurchaseProvider>
        <RouterProvider router={router} />
      </PurchaseProvider>
    </AuthProvider>
  );
}
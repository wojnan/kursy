import { RouterProvider } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { PurchaseProvider } from './contexts/PurchaseContext';
import { Toaster } from 'sonner';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function App() {
  const inner = (
    <AuthProvider>
      <PurchaseProvider>
        <RouterProvider router={router} />
         <Toaster richColors position="top-right" />
      </PurchaseProvider>
    </AuthProvider>
  );

  if (!GOOGLE_CLIENT_ID) return inner;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {inner}
    </GoogleOAuthProvider>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, BookOpen, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { confirmStripePayment } from '../services/database';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    confirmStripePayment(sessionId)
      .then(() => setStatus('success'))
      .catch((error) => {
        console.error('Payment confirmation failed:', error);
        setStatus('error');
      });
  }, [searchParams]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border text-center p-10">
        <div className="flex justify-center mb-6">
          {isLoading ? (
            <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
          ) : isSuccess ? (
            <CheckCircle className="w-16 h-16" style={{ color: '#4F772D' }} />
          ) : (
            <XCircle className="w-16 h-16 text-red-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLoading
            ? 'Confirming Payment...'
            : isSuccess
              ? 'Payment Successful'
              : 'Payment Confirmation Failed'}
        </h1>

        <p className="text-gray-500 mb-8">
          {isLoading
            ? 'Please wait while we confirm your payment.'
            : isSuccess
              ? 'Your purchase is confirmed. You now have full access to your course.'
              : 'We could not confirm your payment. Please contact support or try again.'}
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/dashboard">
            <Button className="w-full gap-2 bg-green-700 hover:bg-green-800">
              <BookOpen className="h-4 w-4" />
              Go to My Learning
            </Button>
          </Link>

          <Link to="/courses">
            <Button variant="outline" className="w-full gap-2">
              Browse More Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
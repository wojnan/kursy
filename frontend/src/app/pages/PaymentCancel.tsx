import { Link } from 'react-router';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';

export function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border text-center p-10">
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was cancelled and you have not been charged.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/courses">
            <Button className="w-full gap-2 bg-green-700 hover:bg-green-800">
              <ShoppingCart className="h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

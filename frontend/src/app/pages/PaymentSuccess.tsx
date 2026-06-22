import { Link } from 'react-router';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border text-center p-10">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16" style={{ color: '#4F772D' }} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
        <p className="text-gray-500 mb-8">
          Your purchase is confirmed. You now have full access to your course.
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

import { useEffect, useState } from 'react';
import {
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from '../services/database';

import { Button } from '../components/ui/button';

export function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  const loadPayments = async () => {
    const data = await getPendingPayments();
    setPayments(data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleApprove = async (id: number) => {
    await approvePayment(id);
    await loadPayments();
  };

  const handleReject = async (id: number) => {
    await rejectPayment(id);
    await loadPayments();
  };

  return (
    <div className="container px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Pending Offline Payments</h1>

      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p>Payment ID: {payment.id}</p>
                <p>User ID: {payment.userId}</p>
                <p>Course ID: {payment.courseId}</p>
                <p>Amount: ${payment.amount}</p>
                <p>Status: {payment.status}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleApprove(payment.id)}>
                  Approve
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleReject(payment.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
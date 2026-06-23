import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import { getUserPurchases } from '../services/database';
import { useAuth } from './AuthContext';

interface PurchaseContextType {
  purchasedCourses: Set<string>;
  refreshPurchases: () => Promise<void>;
  hasPurchased: (courseId: string) => boolean;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<Set<string>>(
    new Set()
  );

  const refreshPurchases = async () => {
    if (!isAuthenticated || !user) {
      setPurchasedCourses(new Set());
      return;
    }

    try {
      const purchases = await getUserPurchases(user.id);

      const courseIds = purchases.map((purchase) =>
        String(purchase.courseId ?? purchase.course_id)
      );

      setPurchasedCourses(new Set(courseIds));
    } catch (error) {
      console.error('Failed to load purchases:', error);
      setPurchasedCourses(new Set());
    }
  };

  useEffect(() => {
    refreshPurchases();
  }, [user?.id, isAuthenticated]);

  const hasPurchased = (courseId: string) => {
    return purchasedCourses.has(courseId);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchasedCourses,
        refreshPurchases,
        hasPurchased,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);

  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }

  return context;
}
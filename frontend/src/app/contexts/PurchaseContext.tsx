import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface PurchaseContextType {
  purchasedCourses: Set<string>;
  purchaseCourse: (courseId: string) => void;
  hasPurchased: (courseId: string) => boolean;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchasedCourses, setPurchasedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load purchased courses from localStorage
    const saved = localStorage.getItem('learnhub-purchases');
    if (saved) {
      setPurchasedCourses(new Set(JSON.parse(saved)));
    }
  }, []);

  const purchaseCourse = (courseId: string) => {
    const updated = new Set(purchasedCourses);
    updated.add(courseId);
    setPurchasedCourses(updated);
    localStorage.setItem('learnhub-purchases', JSON.stringify([...updated]));
  };

  const hasPurchased = (courseId: string) => {
    return purchasedCourses.has(courseId);
  };

  return (
    <PurchaseContext.Provider value={{ purchasedCourses, purchaseCourse, hasPurchased }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Budget {
  orderNumber: string;
  supplierNumber: string;
  documentDate: string;
  deliveryDate: string;
  contractNumber: string;
  capex: number;
  opex: number;
  support: number;
  hourlyRate: number;
}

const defaultBudget: Budget = {
  orderNumber: '',
  supplierNumber: '',
  documentDate: '',
  deliveryDate: '',
  contractNumber: '',
  capex: 0,
  opex: 0,
  support: 0,
  hourlyRate: 0
};

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(defaultBudget);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBudget = useCallback(async () => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Pobieranie budżetu dla użytkownika:', user);
      
      const response = await fetch(`/api/budget?userId=${user}`);
      console.log('Odpowiedź z API:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania budżetu');
      }
      
      const data = await response.json();
      console.log('Otrzymane dane:', data);
      
      if (data) {
        setBudget(data);
      } else {
        setBudget(defaultBudget);
      }
    } catch (error: any) {
      console.error('Błąd podczas pobierania budżetu:', error);
      setError(error.message || 'Błąd podczas pobierania budżetu');
      setBudget(defaultBudget);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateBudget = useCallback(async (newBudget: Budget) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      console.log('Aktualizacja budżetu dla użytkownika:', user);
      console.log('Wysyłane dane:', newBudget);
      
      const response = await fetch(`/api/budget?userId=${user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      });
      
      console.log('Odpowiedź z API:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas aktualizacji budżetu');
      }
      
      const updatedBudget = await response.json();
      console.log('Otrzymane dane:', updatedBudget);
      
      setBudget(updatedBudget);
      return updatedBudget;
    } catch (error: any) {
      console.error('Błąd podczas aktualizacji budżetu:', error);
      setError(error.message || 'Błąd podczas aktualizacji budżetu');
      throw error;
    }
  }, [user]);

  return {
    budget,
    loading,
    error,
    fetchBudget,
    updateBudget,
  };
}

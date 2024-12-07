import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Budget } from '../types';

const defaultBudget: Budget = {
  orderNumber: '',
  supplierNumber: '',
  documentDate: '',
  deliveryDate: '',
  contractNumber: '',
  capex: 0,
  opex: 0,
  support: 0,
  hourlyRate: 0,
  year: new Date().getFullYear()
};

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(defaultBudget);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBudget = useCallback(async (year?: number) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Pobieranie budżetu dla użytkownika:', user);
      
      const yearParam = year || new Date().getFullYear();
      const response = await fetch(`/api/budget?userId=${user}&year=${yearParam}`);
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
        setBudget({...defaultBudget, year: yearParam});
      }
    } catch (error: any) {
      console.error('Błąd podczas pobierania budżetu:', error);
      setError(error.message || 'Błąd podczas pobierania budżetu');
      setBudget({...defaultBudget, year: year || new Date().getFullYear()});
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAllBudgets = useCallback(async () => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      return [];
    }

    try {
      setError(null);
      const response = await fetch(`/api/budget?userId=${user}&method=GET_ALL`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania budżetów');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Błąd podczas pobierania budżetów:', error);
      setError(error.message || 'Błąd podczas pobierania budżetów');
      return [];
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
    fetchAllBudgets,
    updateBudget,
  };
}

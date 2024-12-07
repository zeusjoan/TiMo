import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TimeEntry } from '../types';

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Pobieranie wpisów dla użytkownika:', user);
      
      const response = await fetch(`/api/timeentries?userId=${user}`);
      console.log('Odpowiedź z API:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania wpisów');
      }
      
      const data = await response.json();
      console.log('Otrzymane dane:', data);
      setEntries(data);
    } catch (error: any) {
      console.error('Błąd podczas pobierania wpisów:', error);
      setError(error.message || 'Błąd podczas pobierania wpisów');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const approveMonth = useCallback(async (entry: Omit<TimeEntry, 'userId' | 'isApproved' | 'overtimeHours' | 'overtimes'>) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      console.log('Zatwierdzanie miesiąca:', entry.month);
      
      const response = await fetch('/api/timeentries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...entry, 
          userId: user
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Wpis dla tego miesiąca już istnieje') {
          throw new Error('Ten miesiąc został już zatwierdzony. Możesz edytować istniejący wpis.');
        }
        throw new Error(errorData.error || 'Błąd podczas zatwierdzania miesiąca');
      }
      
      const newEntry = await response.json();
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (error: any) {
      console.error('Błąd podczas zatwierdzania miesiąca:', error);
      setError(error.message || 'Błąd podczas zatwierdzania miesiąca');
      throw error;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: number, entry: Partial<TimeEntry>) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      console.log('Aktualizacja wpisu:', id);
      
      const response = await fetch(`/api/timeentries?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...entry, userId: user }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Wpis dla tego miesiąca już istnieje') {
          throw new Error('Ten miesiąc został już zatwierdzony. Wybierz inny miesiąc.');
        }
        throw new Error(errorData.error || 'Błąd podczas aktualizacji wpisu');
      }
      
      const updatedEntry = await response.json();
      setEntries(prev => 
        prev.map(e => e.id === id ? updatedEntry : e)
      );
      return updatedEntry;
    } catch (error: any) {
      console.error('Błąd podczas aktualizacji wpisu:', error);
      setError(error.message || 'Błąd podczas aktualizacji wpisu');
      throw error;
    }
  }, [user]);

  const deleteEntry = useCallback(async (id: number) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      console.log('Usuwanie wpisu:', id);
      
      const response = await fetch(`/api/timeentries?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas usuwania wpisu');
      }
      
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (error: any) {
      console.error('Błąd podczas usuwania wpisu:', error);
      setError(error.message || 'Błąd podczas usuwania wpisu');
      throw error;
    }
  }, [user]);

  const getApprovedMonths = useCallback(() => {
    return entries.map(entry => entry.month);
  }, [entries]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    approveMonth,
    updateEntry,
    deleteEntry,
    getApprovedMonths
  };
}

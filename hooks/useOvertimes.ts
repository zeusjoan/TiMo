import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Overtime } from '../types';

export function useOvertimes() {
  const [overtimes, setOvertimes] = useState<Overtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOvertimes = useCallback(async (month?: string) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const url = month 
        ? `/api/overtimes?userId=${user}&month=${month}`
        : `/api/overtimes?userId=${user}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania nadgodzin');
      }
      
      const data = await response.json();
      setOvertimes(data);
    } catch (error: any) {
      console.error('Błąd podczas pobierania nadgodzin:', error);
      setError(error.message || 'Błąd podczas pobierania nadgodzin');
      setOvertimes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addOvertime = useCallback(async (overtime: Omit<Overtime, 'id' | 'userId' | 'isApproved'>) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      
      const response = await fetch('/api/overtimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...overtime, 
          userId: user,
          isApproved: false
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas dodawania nadgodzin');
      }
      
      const newOvertime = await response.json();
      setOvertimes(prev => [...prev, newOvertime]);
      return newOvertime;
    } catch (error: any) {
      console.error('Błąd podczas dodawania nadgodzin:', error);
      setError(error.message || 'Błąd podczas dodawania nadgodzin');
      throw error;
    }
  }, [user]);

  const deleteOvertime = useCallback(async (id: number) => {
    if (!user) {
      setError('Użytkownik nie jest zalogowany');
      throw new Error('Użytkownik nie jest zalogowany');
    }

    try {
      setError(null);
      
      const response = await fetch(`/api/overtimes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas usuwania nadgodzin');
      }
      
      setOvertimes(prev => prev.filter(ot => ot.id !== id));
    } catch (error: any) {
      console.error('Błąd podczas usuwania nadgodzin:', error);
      setError(error.message || 'Błąd podczas usuwania nadgodzin');
      throw error;
    }
  }, [user]);

  return {
    overtimes,
    loading,
    error,
    fetchOvertimes,
    addOvertime,
    deleteOvertime,
  };
}

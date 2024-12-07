import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Overtime {
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
}

interface TimeEntry {
  _id?: string;
  userId: string;
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  overtimes: Overtime[];
  description: string;
  overtimeHours: number;
}

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/timeentries?userId=${user}`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Błąd podczas pobierania wpisów:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addEntry = useCallback(async (entry: Omit<TimeEntry, 'userId'>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/timeentries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...entry, userId: user }),
      });
      const newEntry = await response.json();
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (error) {
      console.error('Błąd podczas dodawania wpisu:', error);
      throw error;
    }
  }, [user]);

  const updateEntry = useCallback(async (id: string, entry: Partial<TimeEntry>) => {
    try {
      const response = await fetch(`/api/timeentries?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      const updatedEntry = await response.json();
      setEntries(prev => 
        prev.map(e => e._id === id ? updatedEntry : e)
      );
      return updatedEntry;
    } catch (error) {
      console.error('Błąd podczas aktualizacji wpisu:', error);
      throw error;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await fetch(`/api/timeentries?id=${id}`, {
        method: 'DELETE',
      });
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu:', error);
      throw error;
    }
  }, []);

  return {
    entries,
    loading,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

import { useState, useEffect } from 'react'
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

export interface TimeEntry {
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  overtimeHours: number;
  description: string;
  overtimes?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    incidentNumber: string;
    description: string;
    duration: number;
  }>;
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

export function useTimeTracking() {
  const [budget, setBudget] = useState<Budget>(defaultBudget);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { user } = useAuth();

  // Pobieranie budżetu z API
  const fetchBudget = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/budget?userId=${user}`);
      if (!response.ok) throw new Error('Błąd podczas pobierania budżetu');
      const data = await response.json();
      if (data) {
        setBudget(data);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania budżetu:', error);
    }
  };

  // Pobieranie wpisów z API
  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/timeentries?userId=${user}`);
      if (!response.ok) throw new Error('Błąd podczas pobierania danych');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Błąd podczas pobierania wpisów:', error);
    }
  };

  useEffect(() => {
    if (isFirstLoad && user) {
      fetchBudget();
      fetchEntries();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, user]);

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  const saveBudget = async (newBudget: Budget) => {
    if (!user) throw new Error('Użytkownik nie jest zalogowany');

    try {
      const response = await fetch(`/api/budget?userId=${user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      });

      if (!response.ok) throw new Error('Błąd podczas zapisywania budżetu');
      
      const savedBudget = await response.json();
      setBudget(savedBudget);
    } catch (error) {
      console.error('Błąd podczas zapisywania budżetu:', error);
      throw error;
    }
  };

  const addTimeEntry = async (entry: TimeEntry) => {
    if (!user) throw new Error('Użytkownik nie jest zalogowany');

    try {
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

      if (!response.ok) throw new Error('Błąd podczas zapisywania wpisu');
      
      const savedEntry = await response.json();
      setEntries(prev => [...prev, savedEntry]);
    } catch (error) {
      console.error('Błąd podczas dodawania wpisu:', error);
      throw error;
    }
  };

  return {
    budget,
    entries,
    summary,
    saveBudget,
    addTimeEntry
  };
}

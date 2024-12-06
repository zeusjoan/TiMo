import { useState, useEffect } from 'react'

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
  const [budget, setBudget] = useState(defaultBudget);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      const savedBudget = localStorage.getItem('budget');
      const savedEntries = localStorage.getItem('timeEntries');
      
      if (savedBudget) {
        setBudget(JSON.parse(savedBudget));
      }
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad) {
      localStorage.setItem('budget', JSON.stringify(budget));
    }
  }, [budget, isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad) {
      localStorage.setItem('timeEntries', JSON.stringify(entries));
    }
  }, [entries, isFirstLoad]);

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  return {
    budget,
    entries,
    summary,
    saveBudget: (newBudget: Budget) => setBudget(newBudget),
    addTimeEntry: (entry: TimeEntry) => setEntries(prev => [...prev, entry])
  };
}
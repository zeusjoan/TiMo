import { useState, useEffect, useCallback } from 'react';
import TimeEntry from '../components/TimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';

interface Overtime {
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
}

interface Budget {
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

interface TimeEntry {
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  overtimes: Overtime[];
  description: string;
  overtimeHours: number;
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

export default function Home() {
  // Stan aplikacji
  const [budget, setBudget] = useState(defaultBudget);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Jednorazowe załadowanie danych
  useEffect(() => {
    if (!initialized && typeof window !== 'undefined') {
      const savedBudget = localStorage.getItem('budget');
      const savedEntries = localStorage.getItem('timeEntries');
      
      if (savedBudget) {
        setBudget(JSON.parse(savedBudget));
      }
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      
      setInitialized(true);
    }
  }, [initialized]);

  // Obliczanie podsumowania
  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  // Funkcje obsługujące zmiany
  const handleBudgetUpdate = useCallback((newBudget: Budget) => {
    setBudget(newBudget);
    if (initialized) {
      localStorage.setItem('budget', JSON.stringify(newBudget));
    }
  }, [initialized]);

  const handleNewEntry = useCallback((entry: TimeEntry) => {
    setEntries(prev => {
      const newEntries = [...prev, entry];
      if (initialized) {
        localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      }
      return newEntries;
    });
  }, [initialized]);

  const handleEditEntry = useCallback((index: number, updatedEntry: TimeEntry) => {
    setEntries(prev => {
      const newEntries = [...prev];
      newEntries[index] = updatedEntry;
      if (initialized) {
        localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      }
      return newEntries;
    });
  }, [initialized]);

  const handleDeleteEntry = useCallback((index: number) => {
    setEntries(prev => {
      const newEntries = prev.filter((_, i) => i !== index);
      if (initialized) {
        localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      }
      return newEntries;
    });
  }, [initialized]);

  // Ekran ładowania
  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            System Rozliczania Czasu Pracy
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <Summary 
            budget={budget} 
            summary={summary} 
            entries={entries}
            onBudgetUpdate={handleBudgetUpdate} 
          />
          <TimeEntry onSave={handleNewEntry} />
          <EntryHistory 
            entries={entries} 
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import TimeEntry from '../components/TimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState<Budget>(defaultBudget);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

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

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  const handleBudgetUpdate = useCallback((newBudget: Budget) => {
    setBudget(newBudget);
    localStorage.setItem('budget', JSON.stringify(newBudget));
  }, []);

  const handleNewEntry = useCallback((entry: TimeEntry) => {
    setEntries(prev => {
      const newEntries = [...prev, entry];
      localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      return newEntries;
    });
  }, []);

  const handleEditEntry = useCallback((index: number, updatedEntry: TimeEntry) => {
    setEntries(prev => {
      const newEntries = [...prev];
      newEntries[index] = updatedEntry;
      localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      return newEntries;
    });
  }, []);

  const handleDeleteEntry = useCallback((index: number) => {
    setEntries(prev => {
      const newEntries = prev.filter((_, i) => i !== index);
      localStorage.setItem('timeEntries', JSON.stringify(newEntries));
      return newEntries;
    });
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">
            System Rozliczania Czasu Pracy
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              Zalogowany jako: {user}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Wyloguj
            </button>
          </div>
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

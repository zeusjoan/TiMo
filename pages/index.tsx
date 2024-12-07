import { useState, useEffect } from 'react';
import TimeEntry from '../components/TimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';
import { useAuth } from '../contexts/AuthContext';
import { useTimeEntries } from '../hooks/useTimeEntries';

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
  const { entries, loading, fetchEntries, addEntry, updateEntry, deleteEntry } = useTimeEntries();

  useEffect(() => {
    if (user) {
      fetchEntries();
      // Wczytaj budżet z localStorage (można później przenieść do bazy danych)
      const savedBudget = localStorage.getItem(`${user}_budget`);
      if (savedBudget) {
        setBudget(JSON.parse(savedBudget));
      }
    }
  }, [user, fetchEntries]);

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  const handleBudgetUpdate = (newBudget: Budget) => {
    setBudget(newBudget);
    if (user) {
      localStorage.setItem(`${user}_budget`, JSON.stringify(newBudget));
    }
  };

  const handleNewEntry = async (entry: any) => {
    try {
      await addEntry(entry);
    } catch (error) {
      console.error('Błąd podczas dodawania wpisu:', error);
      alert('Wystąpił błąd podczas zapisywania wpisu');
    }
  };

  const handleEditEntry = async (index: number, updatedEntry: any) => {
    try {
      const entryToUpdate = entries[index];
      if (entryToUpdate._id) {
        await updateEntry(entryToUpdate._id, updatedEntry);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji wpisu:', error);
      alert('Wystąpił błąd podczas aktualizacji wpisu');
    }
  };

  const handleDeleteEntry = async (index: number) => {
    try {
      const entryToDelete = entries[index];
      if (entryToDelete._id) {
        await deleteEntry(entryToDelete._id);
      }
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu:', error);
      alert('Wystąpił błąd podczas usuwania wpisu');
    }
  };

  // Reset stanu przy wylogowaniu
  const handleLogout = () => {
    setBudget(defaultBudget);
    logout();
  };

  if (loading) {
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
              onClick={handleLogout}
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

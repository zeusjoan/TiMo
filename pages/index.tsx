import { useEffect, useState } from 'react';
import TimeEntry from '../components/TimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';
import { useAuth } from '../contexts/AuthContext';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { useOvertimes } from '../hooks/useOvertimes';
import { useBudget } from '../hooks/useBudget';
import { TimeEntry as TimeEntryType, Overtime, Budget } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overtime'); // 'overtime' lub 'monthly'
  const { user, logout } = useAuth();
  const { 
    entries, 
    loading: entriesLoading, 
    error: entriesError,
    fetchEntries, 
    approveMonth,
    updateEntry, 
    deleteEntry,
    getApprovedMonths
  } = useTimeEntries();

  const {
    overtimes,
    loading: overtimesLoading,
    error: overtimesError,
    fetchOvertimes,
    addOvertime,
    deleteOvertime
  } = useOvertimes();
  
  const { 
    budget, 
    loading: budgetLoading, 
    error: budgetError,
    fetchBudget, 
    updateBudget 
  } = useBudget();

  useEffect(() => {
    if (user) {
      console.log('Pobieranie danych dla użytkownika:', user);
      fetchEntries();
      fetchOvertimes();
      fetchBudget();
    }
  }, [user, fetchEntries, fetchOvertimes, fetchBudget]);

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  const handleBudgetUpdate = async (newBudget: Budget) => {
    try {
      await updateBudget(newBudget);
      console.log('Budżet zaktualizowany pomyślnie');
    } catch (error) {
      console.error('Błąd podczas aktualizacji budżetu:', error);
      alert('Wystąpił błąd podczas zapisywania budżetu');
    }
  };

  const handleApproveMonth = async (entry: Omit<TimeEntryType, 'id' | 'userId' | 'isApproved' | 'overtimeHours' | 'overtimes'>) => {
    try {
      await approveMonth(entry);
      console.log('Miesiąc zatwierdzony pomyślnie');
      // Odświeżamy dane po zatwierdzeniu
      fetchEntries();
      fetchOvertimes();
    } catch (error: any) {
      console.error('Błąd podczas zatwierdzania miesiąca:', error);
      alert(error.message || 'Wystąpił błąd podczas zatwierdzania miesiąca');
    }
  };

  const handleEditEntry = async (id: number, updatedEntry: Partial<TimeEntryType>) => {
    try {
      await updateEntry(id, updatedEntry);
      console.log('Wpis zaktualizowany pomyślnie');
    } catch (error: any) {
      console.error('Błąd podczas aktualizacji wpisu:', error);
      alert(error.message || 'Wystąpił błąd podczas aktualizacji wpisu');
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteEntry(id);
      console.log('Wpis usunięty pomyślnie');
    } catch (error: any) {
      console.error('Błąd podczas usuwania wpisu:', error);
      alert(error.message || 'Wystąpił błąd podczas usuwania wpisu');
    }
  };

  const handleAddOvertime = async (overtime: Omit<Overtime, 'id' | 'userId' | 'isApproved'>) => {
    try {
      await addOvertime(overtime);
      console.log('Nadgodziny dodane pomyślnie');
      fetchOvertimes(); // Odświeżamy listę nadgodzin
    } catch (error: any) {
      console.error('Błąd podczas dodawania nadgodzin:', error);
      alert(error.message || 'Wystąpił błąd podczas dodawania nadgodzin');
    }
  };

  const handleDeleteOvertime = async (id: number) => {
    try {
      await deleteOvertime(id);
      console.log('Nadgodziny usunięte pomyślnie');
      fetchOvertimes(); // Odświeżamy listę nadgodzin
    } catch (error: any) {
      console.error('Błąd podczas usuwania nadgodzin:', error);
      alert(error.message || 'Wystąpił błąd podczas usuwania nadgodzin');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (entriesLoading || budgetLoading || overtimesLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Ładowanie...</div>
      </div>
    );
  }

  if (entriesError || budgetError || overtimesError) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-red-600">
          {entriesError && <div>Błąd wpisów: {entriesError}</div>}
          {budgetError && <div>Błąd budżetu: {budgetError}</div>}
          {overtimesError && <div>Błąd nadgodzin: {overtimesError}</div>}
        </div>
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

          <EntryHistory 
            entries={entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />

          {/* Zakładki */}
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overtime')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overtime'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Rejestracja Nadgodzin
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Zamknięcie Miesiąca
              </button>
            </nav>
          </div>

          {/* Zawartość zakładek */}
          <div>
            <TimeEntry 
              onSave={handleApproveMonth}
              approvedMonths={getApprovedMonths()}
              overtimes={overtimes}
              onAddOvertime={handleAddOvertime}
              onDeleteOvertime={handleDeleteOvertime}
              mode={activeTab as 'overtime' | 'monthly'}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

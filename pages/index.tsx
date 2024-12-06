import { useState, useEffect } from 'react';
import MonthlyEntry from '../components/MonthlyEntry';
import OvertimeEntry from '../components/OvertimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';
import MonthSummary from '../components/MonthSummary';
import Card from '../components/Card';
import Modal from '../components/Modal';

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
  const [budget, setBudget] = useState<Budget>(defaultBudget);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [overtimes, setOvertimes] = useState<Overtime[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overtime' | 'monthly'>('overtime');
  const [editingOvertime, setEditingOvertime] = useState<{ index: number; overtime: Overtime } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'overtime' | 'entry'; index: number } | null>(null);

  // Ładowanie danych tylko po stronie klienta
  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedEntries = localStorage.getItem('timeEntries');
    const savedOvertimes = localStorage.getItem('overtimes');
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedOvertimes) {
      setOvertimes(JSON.parse(savedOvertimes));
    }
    
    setIsLoaded(true);
  }, []);

  const summary = {
    capexUsed: entries.reduce((sum, entry) => sum + entry.capexHours, 0),
    opexUsed: entries.reduce((sum, entry) => sum + entry.opexHours, 0),
    supportUsed: entries.reduce((sum, entry) => sum + entry.supportHours, 0)
  };

  // Lista istniejących miesięcy
  const existingMonths = entries.map(entry => entry.month);

  // Grupowanie nadgodzin po miesiącach
  const overtimesByMonth = overtimes.reduce((acc, overtime) => {
    const month = overtime.date.slice(0, 7);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(overtime);
    return acc;
  }, {} as Record<string, Overtime[]>);

  const handleBudgetUpdate = (newBudget: Budget) => {
    setBudget(newBudget);
    localStorage.setItem('budget', JSON.stringify(newBudget));
  };

  const handleNewOvertime = (overtime: Overtime) => {
    if (editingOvertime !== null) {
      // Edycja istniejącej nadgodziny
      const newOvertimes = [...overtimes];
      newOvertimes[editingOvertime.index] = overtime;
      setOvertimes(newOvertimes);
      localStorage.setItem('overtimes', JSON.stringify(newOvertimes));
      setEditingOvertime(null);
    } else {
      // Dodawanie nowej nadgodziny
      const newOvertimes = [...overtimes, overtime];
      setOvertimes(newOvertimes);
      localStorage.setItem('overtimes', JSON.stringify(newOvertimes));
    }
  };

  const handleEditOvertime = (index: number) => {
    setEditingOvertime({ index, overtime: overtimes[index] });
  };

  const handleDeleteOvertime = (index: number) => {
    setDeleteConfirm({ type: 'overtime', index });
  };

  const handleDeleteEntry = (index: number) => {
    setDeleteConfirm({ type: 'entry', index });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'overtime') {
      const newOvertimes = overtimes.filter((_, i) => i !== deleteConfirm.index);
      setOvertimes(newOvertimes);
      localStorage.setItem('overtimes', JSON.stringify(newOvertimes));
    } else {
      const newEntries = entries.filter((_, i) => i !== deleteConfirm.index);
      setEntries(newEntries);
      localStorage.setItem('timeEntries', JSON.stringify(newEntries));
    }

    setDeleteConfirm(null);
  };

  const handleNewMonthlyEntry = (entry: TimeEntry) => {
    // Sprawdź czy miesiąc już istnieje
    if (existingMonths.includes(entry.month)) {
      return;
    }

    const newEntries = [...entries, entry];
    setEntries(newEntries);
    localStorage.setItem('timeEntries', JSON.stringify(newEntries));

    // Usuń zatwierdzone nadgodziny z listy
    const remainingOvertimes = overtimes.filter(ot => !ot.date.startsWith(entry.month));
    setOvertimes(remainingOvertimes);
    localStorage.setItem('overtimes', JSON.stringify(remainingOvertimes));

    // Przełącz na zakładkę nadgodzin po zatwierdzeniu
    setActiveTab('overtime');
  };

  const handleEditEntry = (index: number, updatedEntry: TimeEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    setEntries(newEntries);
    localStorage.setItem('timeEntries', JSON.stringify(newEntries));
  };

  if (!isLoaded) {
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

          {/* Zakładki */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('overtime')}
                  className={`
                    py-4 px-6 font-medium text-sm border-b-2
                    ${activeTab === 'overtime'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  Rejestracja nadgodzin
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={`
                    py-4 px-6 font-medium text-sm border-b-2
                    ${activeTab === 'monthly'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  Podsumowanie miesięczne
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Aktywny formularz */}
              {activeTab === 'overtime' ? (
                <div className="space-y-6">
                  <OvertimeEntry 
                    onSave={handleNewOvertime}
                    initialOvertime={editingOvertime?.overtime}
                    onCancel={() => setEditingOvertime(null)}
                    existingMonths={existingMonths}
                  />
                  {overtimes.length > 0 && (
                    <Card title="Nadgodziny oczekujące na zatwierdzenie">
                      {Object.entries(overtimesByMonth).map(([month, monthOvertimes]) => {
                        const totalHours = monthOvertimes.reduce((sum, ot) => sum + ot.duration, 0);
                        const totalValue = totalHours * budget.hourlyRate;

                        return (
                          <div key={month} className="mb-8 last:mb-0">
                            <div className="mb-4 flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {new Date(month + '-01').toLocaleDateString('pl-PL', { 
                                  year: 'numeric', 
                                  month: 'long' 
                                })}
                              </h3>
                              <div className="text-sm text-slate-500">
                                Suma: {totalHours}h ({totalValue.toFixed(2)} PLN)
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Godziny</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Wartość</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nr incydentu</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                                    <th className="px-4 py-2"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {monthOvertimes.map((overtime, idx) => {
                                    const globalIndex = overtimes.findIndex(ot => 
                                      ot.date === overtime.date && 
                                      ot.startTime === overtime.startTime &&
                                      ot.endTime === overtime.endTime
                                    );
                                    return (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">
                                          {overtime.startTime} - {overtime.endTime}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.duration}h</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">
                                          {(overtime.duration * budget.hourlyRate).toFixed(2)} PLN
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                                        <td className="px-4 py-2 space-x-2">
                                          <button
                                            onClick={() => handleEditOvertime(globalIndex)}
                                            className="text-blue-600 hover:text-blue-800"
                                          >
                                            Edytuj
                                          </button>
                                          <button
                                            onClick={() => handleDeleteOvertime(globalIndex)}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            Usuń
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </Card>
                  )}
                </div>
              ) : (
                <MonthlyEntry 
                  onSave={handleNewMonthlyEntry} 
                  existingMonths={existingMonths}
                  pendingOvertimes={overtimes}
                  hourlyRate={budget.hourlyRate}
                />
              )}
            </div>
          </div>

          {/* Podsumowanie miesięczne */}
          {entries.length > 0 && (
            <MonthSummary 
              entries={entries}
              hourlyRate={budget.hourlyRate}
            />
          )}

          <EntryHistory 
            entries={entries} 
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </div>
      </main>

      {/* Modal potwierdzenia usunięcia */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Potwierdź usunięcie"
        >
          <div className="p-6">
            <p className="text-slate-900 mb-6">
              {deleteConfirm.type === 'overtime'
                ? 'Czy na pewno chcesz usunąć te nadgodziny?'
                : 'Czy na pewno chcesz usunąć to rozliczenie miesięczne?'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 focus:outline-none"
              >
                Anuluj
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Usuń
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

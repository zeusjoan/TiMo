import { useState, useEffect } from 'react';
import MonthlyEntry from '../components/MonthlyEntry';
import OvertimeEntry from '../components/OvertimeEntry';
import Summary from '../components/Summary';
import EntryHistory from '../components/EntryHistory';
import Card from '../components/Card';

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

  const handleBudgetUpdate = (newBudget: Budget) => {
    setBudget(newBudget);
    localStorage.setItem('budget', JSON.stringify(newBudget));
  };

  const handleNewOvertime = (overtime: Overtime) => {
    const newOvertimes = [...overtimes, overtime];
    setOvertimes(newOvertimes);
    localStorage.setItem('overtimes', JSON.stringify(newOvertimes));
  };

  const handleNewMonthlyEntry = (entry: TimeEntry) => {
    // Znajdź nadgodziny z danego miesiąca
    const monthOvertimes = overtimes.filter(ot => ot.date.startsWith(entry.month));
    const overtimeHours = monthOvertimes.reduce((sum, ot) => sum + ot.duration, 0);

    const newEntry = {
      ...entry,
      overtimes: monthOvertimes,
      overtimeHours
    };

    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    localStorage.setItem('timeEntries', JSON.stringify(newEntries));

    // Usuń wykorzystane nadgodziny z listy
    const remainingOvertimes = overtimes.filter(ot => !ot.date.startsWith(entry.month));
    setOvertimes(remainingOvertimes);
    localStorage.setItem('overtimes', JSON.stringify(remainingOvertimes));
  };

  const handleEditEntry = (index: number, updatedEntry: TimeEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    setEntries(newEntries);
    localStorage.setItem('timeEntries', JSON.stringify(newEntries));
  };

  const handleDeleteEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
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
                  <OvertimeEntry onSave={handleNewOvertime} />
                  {overtimes.length > 0 && (
                    <Card title="Niezaksięgowane nadgodziny">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Godziny</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nr incydentu</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {overtimes.map((overtime, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                                <td className="px-4 py-2 text-sm text-slate-900">
                                  {overtime.startTime} - {overtime.endTime}
                                </td>
                                <td className="px-4 py-2 text-sm text-slate-900">{overtime.duration}h</td>
                                <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                                <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <MonthlyEntry onSave={handleNewMonthlyEntry} />
              )}
            </div>
          </div>

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

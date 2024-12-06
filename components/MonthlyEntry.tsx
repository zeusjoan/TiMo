import { useState, useEffect } from 'react';
import Card from './Card';

interface Overtime {
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
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

interface MonthlyEntryProps {
  onSave: (entry: TimeEntry) => void;
  initialEntry?: TimeEntry;
  existingMonths: string[];
  pendingOvertimes: Overtime[];
  hourlyRate: number;
}

export default function MonthlyEntry({ onSave, initialEntry, existingMonths, pendingOvertimes, hourlyRate }: MonthlyEntryProps) {
  const [entry, setEntry] = useState<TimeEntry>(initialEntry || {
    month: new Date().toISOString().slice(0, 7),
    capexHours: 0,
    opexHours: 0,
    supportHours: 0,
    overtimes: [],
    description: '',
    overtimeHours: 0
  });

  const [error, setError] = useState<string | null>(null);

  // Filtruj nadgodziny dla wybranego miesiąca
  const monthOvertimes = pendingOvertimes.filter(ot => ot.date.startsWith(entry.month));
  const overtimeHours = monthOvertimes.reduce((sum, ot) => sum + ot.duration, 0);
  const overtimeValue = overtimeHours * hourlyRate;

  useEffect(() => {
    if (initialEntry) {
      setEntry(initialEntry);
    }
  }, [initialEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sprawdzamy czy miesiąc już istnieje (pomijamy jeśli to edycja)
    if (!initialEntry && existingMonths.includes(entry.month)) {
      setError('Wpis dla tego miesiąca już istnieje');
      return;
    }

    // Dodaj nadgodziny do wpisu
    const finalEntry = {
      ...entry,
      overtimes: monthOvertimes,
      overtimeHours
    };

    onSave(finalEntry);
    if (!initialEntry) {
      // Reset formularza tylko przy dodawaniu nowego wpisu
      setEntry({
        month: new Date().toISOString().slice(0, 7),
        capexHours: 0,
        opexHours: 0,
        supportHours: 0,
        overtimes: [],
        description: '',
        overtimeHours: 0
      });
      setError(null);
    }
  };

  // Sprawdzanie przy zmianie miesiąca
  const handleMonthChange = (month: string) => {
    setEntry({...entry, month});
    if (existingMonths.includes(month)) {
      setError('Wpis dla tego miesiąca już istnieje');
    } else {
      setError(null);
    }
  };

  // Oblicz sumę wszystkich godzin
  const totalHours = entry.capexHours + entry.opexHours + entry.supportHours + overtimeHours;
  const standardValue = (entry.capexHours + entry.opexHours + entry.supportHours) * hourlyRate;
  const totalValue = standardValue + overtimeValue;

  return (
    <Card title="Podsumowanie miesięczne">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Miesiąc rozliczeniowy
          </label>
          <input
            type="month"
            value={entry.month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-slate-300'
            } text-slate-900`}
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-medium text-slate-900 mb-2">
              Godziny CAPEX
            </label>
            <input
              type="number"
              value={entry.capexHours}
              onChange={(e) => setEntry({...entry, capexHours: Number(e.target.value)})}
              className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-slate-900 mb-2">
              Godziny OPEX
            </label>
            <input
              type="number"
              value={entry.opexHours}
              onChange={(e) => setEntry({...entry, opexHours: Number(e.target.value)})}
              className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-slate-900 mb-2">
              Godziny asysty
            </label>
            <input
              type="number"
              value={entry.supportHours}
              onChange={(e) => setEntry({...entry, supportHours: Number(e.target.value)})}
              className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900"
              min="0"
              step="0.5"
              required
            />
          </div>
        </div>

        {/* Podsumowanie nadgodzin */}
        {monthOvertimes.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Nadgodziny do zatwierdzenia
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200">
                <thead className="bg-yellow-100/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Godziny</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Wartość</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nr incydentu</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200">
                  {monthOvertimes.map((overtime, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">
                        {overtime.startTime} - {overtime.endTime}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.duration}h</td>
                      <td className="px-4 py-2 text-sm text-slate-900">
                        {(overtime.duration * hourlyRate).toFixed(2)} PLN
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                    </tr>
                  ))}
                  <tr className="bg-yellow-100/50 font-medium">
                    <td colSpan={2} className="px-4 py-2 text-right">Suma nadgodzin:</td>
                    <td className="px-4 py-2">{overtimeHours}h</td>
                    <td className="px-4 py-2">{overtimeValue.toFixed(2)} PLN</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Opis wykonanych prac
          </label>
          <textarea
            value={entry.description}
            onChange={(e) => setEntry({...entry, description: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900"
            rows={4}
            required
          />
        </div>

        {/* Podsumowanie wszystkich godzin */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Podsumowanie godzin
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-slate-600">CAPEX:</dt>
                  <dd className="font-medium text-slate-900">{entry.capexHours}h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">OPEX:</dt>
                  <dd className="font-medium text-slate-900">{entry.opexHours}h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Konsultacje:</dt>
                  <dd className="font-medium text-slate-900">{entry.supportHours}h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Nadgodziny:</dt>
                  <dd className="font-medium text-slate-900">{overtimeHours}h</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                  <dt className="font-medium text-slate-900">Łącznie:</dt>
                  <dd className="font-bold text-slate-900">{totalHours}h</dd>
                </div>
              </dl>
            </div>
            <div>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Standardowe:</dt>
                  <dd className="font-medium text-slate-900">{standardValue.toFixed(2)} PLN</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Nadgodziny:</dt>
                  <dd className="font-medium text-slate-900">{overtimeValue.toFixed(2)} PLN</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                  <dt className="font-medium text-slate-900">Łącznie:</dt>
                  <dd className="font-bold text-slate-900">{totalValue.toFixed(2)} PLN</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!!error}
          className={`w-full py-2 px-4 rounded-md ${
            error
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {initialEntry ? 'Zapisz zmiany' : 'Zatwierdź rozliczenie'}
        </button>
      </form>
    </Card>
  );
}

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
}

export default function MonthlyEntry({ onSave, initialEntry }: MonthlyEntryProps) {
  const [entry, setEntry] = useState<TimeEntry>(initialEntry || {
    month: new Date().toISOString().slice(0, 7),
    capexHours: 0,
    opexHours: 0,
    supportHours: 0,
    overtimes: [],
    description: '',
    overtimeHours: 0
  });

  useEffect(() => {
    if (initialEntry) {
      setEntry(initialEntry);
    }
  }, [initialEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entry);
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
    }
  };

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
            onChange={(e) => setEntry({...entry, month: e.target.value})}
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900"
            required
          />
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {initialEntry ? 'Zapisz zmiany' : 'Zapisz rozliczenie'}
        </button>
      </form>
    </Card>
  );
}

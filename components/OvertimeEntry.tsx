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

interface OvertimeEntryProps {
  onSave: (overtime: Overtime) => void;
  initialOvertime?: Overtime;
  onCancel?: () => void;
  existingMonths: string[];
}

export default function OvertimeEntry({ onSave, initialOvertime, onCancel, existingMonths }: OvertimeEntryProps) {
  const [overtime, setOvertime] = useState<Overtime>({
    date: '',
    startTime: '',
    endTime: '',
    incidentNumber: '',
    description: '',
    duration: 0
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOvertime) {
      setOvertime(initialOvertime);
    }
  }, [initialOvertime]);

  // Obliczanie czasu trwania nadgodzin
  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overtime.date && overtime.startTime && overtime.endTime) {
      // Sprawdź czy miesiąc nie jest już rozliczony
      const month = overtime.date.slice(0, 7);
      if (!initialOvertime && existingMonths.includes(month)) {
        setError('Nie można dodać nadgodzin - miesiąc został już rozliczony');
        return;
      }

      const duration = calculateDuration(overtime.startTime, overtime.endTime);
      onSave({ ...overtime, duration });
      
      // Reset formularza tylko jeśli to nie edycja
      if (!initialOvertime) {
        setOvertime({
          date: '',
          startTime: '',
          endTime: '',
          incidentNumber: '',
          description: '',
          duration: 0
        });
        setError(null);
      }
    }
  };

  // Sprawdzanie przy zmianie daty
  const handleDateChange = (date: string) => {
    const month = date.slice(0, 7);
    if (!initialOvertime && existingMonths.includes(month)) {
      setError('Nie można dodać nadgodzin - miesiąc został już rozliczony');
    } else {
      setError(null);
    }
    setOvertime({...overtime, date});
  };

  return (
    <Card title={initialOvertime ? "Edycja nadgodzin" : "Rejestracja nadgodzin"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Data</label>
            <input
              type="date"
              value={overtime.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
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
          <div>
            <label className="block text-sm font-medium text-slate-700">Nr incydentu</label>
            <input
              type="text"
              value={overtime.incidentNumber}
              onChange={(e) => setOvertime({...overtime, incidentNumber: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Od</label>
            <input
              type="time"
              value={overtime.startTime}
              onChange={(e) => setOvertime({...overtime, startTime: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Do</label>
            <input
              type="time"
              value={overtime.endTime}
              onChange={(e) => setOvertime({...overtime, endTime: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Opis</label>
          <textarea
            value={overtime.description}
            onChange={(e) => setOvertime({...overtime, description: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 focus:outline-none"
            >
              Anuluj
            </button>
          )}
          <button
            type="submit"
            disabled={!!error}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              error
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none`}
          >
            {initialOvertime ? 'Zapisz zmiany' : 'Dodaj nadgodziny'}
          </button>
        </div>
      </form>
    </Card>
  );
}

import { useState } from 'react';
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
}

export default function OvertimeEntry({ onSave }: OvertimeEntryProps) {
  const [overtime, setOvertime] = useState<Overtime>({
    date: '',
    startTime: '',
    endTime: '',
    incidentNumber: '',
    description: '',
    duration: 0
  });

  // Obliczanie czasu trwania nadgodzin
  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overtime.date && overtime.startTime && overtime.endTime) {
      const duration = calculateDuration(overtime.startTime, overtime.endTime);
      onSave({ ...overtime, duration });
      // Reset formularza
      setOvertime({
        date: '',
        startTime: '',
        endTime: '',
        incidentNumber: '',
        description: '',
        duration: 0
      });
    }
  };

  return (
    <Card title="Rejestracja nadgodzin">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Data</label>
            <input
              type="date"
              value={overtime.date}
              onChange={(e) => setOvertime({...overtime, date: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              required
            />
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Zapisz nadgodziny
        </button>
      </form>
    </Card>
  );
}

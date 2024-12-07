import { useState, useEffect } from 'react';
import Card from './Card';
import { TimeEntry, Overtime } from '../types';

interface TimeEntryFormProps {
    onSave: (entry: Omit<TimeEntry, 'id' | 'userId' | 'isApproved' | 'overtimeHours'>) => void;
    initialEntry?: TimeEntry;
    approvedMonths: string[];
    overtimes: Overtime[];
    onAddOvertime: (overtime: Omit<Overtime, 'id' | 'userId' | 'isApproved'>) => void;
    onDeleteOvertime: (id: number) => void;
    mode: 'overtime' | 'monthly';
}

export default function TimeEntryForm({ 
    onSave, 
    initialEntry, 
    approvedMonths = [],
    overtimes = [],
    onAddOvertime,
    onDeleteOvertime,
    mode
}: TimeEntryFormProps) {
    const [entry, setEntry] = useState<Omit<TimeEntry, 'id' | 'userId' | 'isApproved' | 'overtimeHours'>>(initialEntry || {
      month: new Date().toISOString().slice(0, 7),
      capexHours: 0,
      opexHours: 0,
      supportHours: 0,
      description: ''
    });

    const [error, setError] = useState<string | null>(null);
  
    const [currentOvertime, setCurrentOvertime] = useState<Omit<Overtime, 'id' | 'userId' | 'isApproved'>>({
      month: entry.month,
      date: '',
      startTime: '',
      endTime: '',
      incidentNumber: '',
      description: '',
      duration: 0
    });

    useEffect(() => {
      if (initialEntry) {
        setEntry({
          month: initialEntry.month,
          capexHours: initialEntry.capexHours,
          opexHours: initialEntry.opexHours,
          supportHours: initialEntry.supportHours,
          description: initialEntry.description
        });
      }
    }, [initialEntry]);

    useEffect(() => {
      setCurrentOvertime(prev => ({
        ...prev,
        month: entry.month
      }));
    }, [entry.month]);

    const isMonthApproved = (month: string) => {
      return approvedMonths.includes(month) && !initialEntry;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isMonthApproved(entry.month)) {
        setError('Ten miesiąc został już zatwierdzony.');
        return;
      }

      onSave(entry);
      if (!initialEntry) {
        setEntry({
          month: new Date().toISOString().slice(0, 7),
          capexHours: 0,
          opexHours: 0,
          supportHours: 0,
          description: ''
        });
      }
    };

    const handleMonthChange = (newMonth: string) => {
      if (isMonthApproved(newMonth)) {
        setError('Ten miesiąc został już zatwierdzony.');
      } else {
        setError(null);
      }
      setEntry({...entry, month: newMonth});
    };

    const calculateDuration = (start: string, end: string): number => {
      const startDate = new Date(`1970-01-01T${start}`);
      const endDate = new Date(`1970-01-01T${end}`);
      return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    };
  
    const handleAddOvertime = () => {
      if (currentOvertime.date && currentOvertime.startTime && currentOvertime.endTime) {
        // Sprawdź czy miesiąc z daty nadgodzin jest już zatwierdzony
        const overtimeMonth = currentOvertime.date.slice(0, 7);
        if (isMonthApproved(overtimeMonth)) {
          alert('Nie można dodać nadgodzin do zatwierdzonego miesiąca.');
          return;
        }

        const duration = calculateDuration(currentOvertime.startTime, currentOvertime.endTime);
        const newOvertime = { 
          ...currentOvertime, 
          duration
        };
        
        onAddOvertime(newOvertime);
  
        setCurrentOvertime({
          month: entry.month,
          date: '',
          startTime: '',
          endTime: '',
          incidentNumber: '',
          description: '',
          duration: 0
        });
      }
    };

    const handleDeleteOvertime = (id: number) => {
      if (window.confirm('Czy na pewno chcesz usunąć te nadgodziny? Tej operacji nie można cofnąć.')) {
        onDeleteOvertime(id);
      }
    };

    const totalOvertime = overtimes
      .filter(ot => !ot.isApproved && ot.date.startsWith(entry.month))
      .reduce((sum, ot) => sum + ot.duration, 0);

    // Renderowanie formularza nadgodzin
    const renderOvertimeForm = () => (
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Nadgodziny (niezatwierdzone: {totalOvertime}h)
        </h3>
        
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">Data</label>
            <div className="relative">
              <input
                type="date"
                value={currentOvertime.date}
                onChange={(e) => setCurrentOvertime({...currentOvertime, date: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 h-[42px] appearance-none bg-white"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">Od</label>
            <input
              type="time"
              value={currentOvertime.startTime}
              onChange={(e) => setCurrentOvertime({...currentOvertime, startTime: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 h-[42px] bg-white"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">Do</label>
            <input
              type="time"
              value={currentOvertime.endTime}
              onChange={(e) => setCurrentOvertime({...currentOvertime, endTime: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 h-[42px] bg-white"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">Incydent</label>
            <input
              type="text"
              value={currentOvertime.incidentNumber}
              onChange={(e) => setCurrentOvertime({...currentOvertime, incidentNumber: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 h-[42px]"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">Opis</label>
            <input
              type="text"
              value={currentOvertime.description}
              onChange={(e) => setCurrentOvertime({...currentOvertime, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 h-[42px]"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700">&nbsp;</label>
            <button
              type="button"
              onClick={handleAddOvertime}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-[42px]"
            >
              Dodaj
            </button>
          </div>
        </div>

        {overtimes.length > 0 && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Od</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Do</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Czas</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Incydent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Opis</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overtimes
                  .filter(ot => !ot.isApproved && ot.date.startsWith(entry.month))
                  .map((overtime) => (
                    <tr key={overtime.id}>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.startTime}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.endTime}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.duration}h</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => overtime.id && handleDeleteOvertime(overtime.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );

    // Renderowanie formularza miesięcznego
    const renderMonthlyForm = () => (
      <div className="space-y-6">
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
      </div>
    );
  
    return (
      <Card title={mode === 'overtime' ? "Rejestracja nadgodzin" : "Zamknięcie miesiąca"}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {mode === 'monthly' && (
            <div>
              <label className="block text-base font-medium text-slate-900 mb-2">
                Miesiąc rozliczeniowy
              </label>
              <div className="relative">
                <input
                  type="month"
                  value={entry.month}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md h-[42px] appearance-none bg-white ${
                    error ? 'border-red-500' : 'border-slate-300'
                  }`}
                  required
                  style={{ cursor: 'pointer' }}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>
          )}

          {mode === 'overtime' ? renderOvertimeForm() : renderMonthlyForm()}
  
          {mode === 'monthly' && (
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md ${
                error 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={!!error}
            >
              Zatwierdź miesiąc
            </button>
          )}
        </form>
      </Card>
    );
}

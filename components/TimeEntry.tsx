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

interface TimeEntryFormProps {
    onSave: (entry: TimeEntry) => void;
    initialEntry?: TimeEntry;
}
  
export default function TimeEntryForm({ onSave, initialEntry }: TimeEntryFormProps) {
    const [entry, setEntry] = useState<TimeEntry>(initialEntry || {
      month: new Date().toISOString().slice(0, 7),
      capexHours: 0,
      opexHours: 0,
      supportHours: 0,
      overtimes: [],
      description: '',
      overtimeHours: 0
    });
  
    const [currentOvertime, setCurrentOvertime] = useState<Overtime>({
      date: '',
      startTime: '',
      endTime: '',
      incidentNumber: '',
      description: '',
      duration: 0
    });

    // Inicjalizacja formularza danymi do edycji
    useEffect(() => {
      if (initialEntry) {
        setEntry(initialEntry);
      }
    }, [initialEntry]);
  
    // Obsługa zapisu formularza
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

    // Obliczanie czasu trwania nadgodzin
    const calculateDuration = (start: string, end: string): number => {
      const startDate = new Date(`1970-01-01T${start}`);
      const endDate = new Date(`1970-01-01T${end}`);
      return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    };
  
    // Dodawanie nowych nadgodzin
    const handleAddOvertime = () => {
      if (currentOvertime.date && currentOvertime.startTime && currentOvertime.endTime) {
        const duration = calculateDuration(currentOvertime.startTime, currentOvertime.endTime);
        const newOvertime = { ...currentOvertime, duration };
        
        setEntry(prev => ({
          ...prev,
          overtimes: [...prev.overtimes, newOvertime],
          overtimeHours: prev.overtimes.reduce((sum, ot) => sum + ot.duration, 0) + duration
        }));
  
        // Reset formularza nadgodzin
        setCurrentOvertime({
          date: '',
          startTime: '',
          endTime: '',
          incidentNumber: '',
          description: '',
          duration: 0
        });
      }
    };
  
    // Usuwanie nadgodzin
    const handleRemoveOvertime = (index: number) => {
      setEntry(prev => {
        const newOvertimes = prev.overtimes.filter((_, i) => i !== index);
        return {
          ...prev,
          overtimes: newOvertimes,
          overtimeHours: newOvertimes.reduce((sum, ot) => sum + ot.duration, 0)
        };
      });
    };
  
    // Obliczanie sumy nadgodzin
    const totalOvertime = entry.overtimes.reduce((sum, ot) => sum + ot.duration, 0);
  
    return (
      <Card title={initialEntry ? "Edycja rozliczenia" : "Rejestracja miesięczna"}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Główny formularz miesięczny */}
          <div className="space-y-6">
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
          </div>
  
          {/* Sekcja nadgodzin */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nadgodziny</h3>
            
            {/* Formularz dodawania nadgodzin */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">Data</label>
                <input
                  type="date"
                  value={currentOvertime.date}
                  onChange={(e) => setCurrentOvertime({...currentOvertime, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">Od</label>
                <input
                  type="time"
                  value={currentOvertime.startTime}
                  onChange={(e) => setCurrentOvertime({...currentOvertime, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">Do</label>
                <input
                  type="time"
                  value={currentOvertime.endTime}
                  onChange={(e) => setCurrentOvertime({...currentOvertime, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">Nr incydentu</label>
                <input
                  type="text"
                  value={currentOvertime.incidentNumber}
                  onChange={(e) => setCurrentOvertime({...currentOvertime, incidentNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">Opis</label>
                <input
                  type="text"
                  value={currentOvertime.description}
                  onChange={(e) => setCurrentOvertime({...currentOvertime, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700">&nbsp;</label>
                <button
                  type="button"
                  onClick={handleAddOvertime}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Dodaj
                </button>
              </div>
            </div>
  
            {/* Lista nadgodzin */}
            {entry.overtimes.length > 0 && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Od</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Do</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Czas</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Nr incydentu</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Opis</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {entry.overtimes.map((overtime, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.startTime}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.endTime}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.duration}h</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveOvertime(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-medium">
                      <td colSpan={3} className="px-4 py-2 text-right">Suma nadgodzin:</td>
                      <td className="px-4 py-2">{totalOvertime}h</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
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

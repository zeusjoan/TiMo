import { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import TimeEntryForm from './TimeEntry';

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

interface EntryHistoryProps {
  entries: TimeEntry[];
  onEdit: (index: number, updatedEntry: TimeEntry) => void;
  onDelete: (index: number) => void;
}

export default function EntryHistory({ entries, onEdit, onDelete }: EntryHistoryProps) {
  const [editingEntry, setEditingEntry] = useState<{ index: number; entry: TimeEntry } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.month).getTime() - new Date(a.month).getTime()
  );

  const formatMonth = (dateString: string) => {
    return new Date(dateString + '-01').toLocaleDateString('pl-PL', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleEdit = (index: number, entry: TimeEntry) => {
    setEditingEntry({ index, entry });
  };

  const handleDelete = (index: number) => {
    setShowDeleteConfirm(index);
  };

  const confirmDelete = (index: number) => {
    onDelete(index);
    setShowDeleteConfirm(null);
  };

  return (
    <Card title="Historia rozliczeń">
      {sortedEntries.map((entry, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {formatMonth(entry.month)}
            </h3>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(index, entry)}
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
              >
                Usuń
              </button>
            </div>
          </div>

          {/* Standardowe godziny */}
          <div className="grid grid-cols-3 gap-4 mb-4 bg-slate-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-slate-500">CAPEX</p>
              <p className="text-lg font-medium text-slate-900">{entry.capexHours}h</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">OPEX</p>
              <p className="text-lg font-medium text-slate-900">{entry.opexHours}h</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Konsultacje</p>
              <p className="text-lg font-medium text-slate-900">{entry.supportHours}h</p>
            </div>
          </div>

          {/* Nadgodziny */}
          {entry.overtimes && entry.overtimes.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Nadgodziny:</h4>
              <div className="bg-yellow-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-yellow-200">
                  <thead>
                    <tr className="bg-yellow-100/50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Godziny</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Incydent</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-200">
                    {entry.overtimes.map((overtime, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">
                          {overtime.startTime} - {overtime.endTime}
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-900 font-medium">
                          {overtime.duration}h
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                        <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                      </tr>
                    ))}
                    <tr className="bg-yellow-100/50">
                      <td colSpan={2} className="px-4 py-2 text-sm font-medium text-slate-900">
                        Suma nadgodzin:
                      </td>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-slate-900">
                        {entry.overtimeHours}h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {entry.description && (
            <div className="mt-4 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Opis:</p>
              <p className="mt-1">{entry.description}</p>
            </div>
          )}

          {index < sortedEntries.length - 1 && <hr className="my-6 border-slate-200" />}
        </div>
      ))}

      {/* Modal edycji wpisu */}
      {editingEntry && (
        <Modal
          isOpen={true}
          onClose={() => setEditingEntry(null)}
          title="Edycja rozliczenia"
        >
          <TimeEntryForm
            initialEntry={editingEntry.entry}
            onSave={(updatedEntry) => {
              onEdit(editingEntry.index, updatedEntry);
              setEditingEntry(null);
            }}
          />
        </Modal>
      )}

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteConfirm !== null && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          title="Potwierdź usunięcie"
        >
          <div className="p-6">
            <p className="text-slate-900 mb-6">
              Czy na pewno chcesz usunąć to rozliczenie? Tej operacji nie można cofnąć.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 focus:outline-none"
              >
                Anuluj
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Usuń
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

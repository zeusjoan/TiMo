import Card from './Card';
import { TimeEntry } from '../types';

interface EntryHistoryProps {
  entries: Omit<TimeEntry, 'overtimes'>[];
  onEdit?: (id: number, updatedEntry: Partial<TimeEntry>) => void;
  onDelete?: (id: number) => void;
}

export default function EntryHistory({ entries, onEdit, onDelete }: EntryHistoryProps) {
  const handleDelete = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten wpis? Tej operacji nie można cofnąć.')) {
      onDelete?.(id);
    }
  };

  return (
    <Card title="Historia rozliczeń">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Miesiąc</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">CAPEX</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">OPEX</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Konsultacje</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nadgodziny</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Suma</th>
              {(onEdit || onDelete) && <th className="px-4 py-2"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries
              .sort((a, b) => b.month.localeCompare(a.month))
              .map((entry) => {
                const totalHours = entry.capexHours + entry.opexHours + entry.supportHours + entry.overtimeHours;
                const entryId = entry.id;

                if (!entryId) return null;

                return (
                  <tr key={entryId}>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {new Date(entry.month + '-01').toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.capexHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.opexHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.supportHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.overtimeHours}h</td>
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">
                      {totalHours}h
                    </td>
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-2 space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(entryId, {...entry})}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edytuj
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(entryId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Usuń
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

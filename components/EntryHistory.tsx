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

interface EntryHistoryProps {
  entries: TimeEntry[];
  onEdit: (index: number, entry: TimeEntry) => void;
  onDelete: (index: number) => void;
}

export default function EntryHistory({ entries, onEdit, onDelete }: EntryHistoryProps) {
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
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries
              .sort((a, b) => b.month.localeCompare(a.month))
              .map((entry, index) => {
                const totalHours = entry.capexHours + entry.opexHours + entry.supportHours + 
                  entry.overtimes.reduce((sum, ot) => sum + ot.duration, 0);

                return (
                  <tr key={entry.month}>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {new Date(entry.month + '-01').toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.capexHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.opexHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">{entry.supportHours}h</td>
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {entry.overtimes.reduce((sum, ot) => sum + ot.duration, 0)}h
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">
                      {totalHours}h
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => onEdit(index, entry)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => onDelete(index)}
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
    </Card>
  );
}

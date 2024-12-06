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

interface MonthSummaryProps {
  entries: TimeEntry[];
  hourlyRate: number;
}

export default function MonthSummary({ entries, hourlyRate }: MonthSummaryProps) {
  // Grupowanie wpisów po miesiącach
  const monthlyStats = entries.reduce((acc, entry) => {
    const month = entry.month;
    if (!acc[month]) {
      acc[month] = {
        capexHours: 0,
        opexHours: 0,
        supportHours: 0,
        overtimeHours: 0,
        overtimes: []
      };
    }
    
    acc[month].capexHours += entry.capexHours;
    acc[month].opexHours += entry.opexHours;
    acc[month].supportHours += entry.supportHours;
    acc[month].overtimeHours += entry.overtimes.reduce((sum, ot) => sum + ot.duration, 0);
    acc[month].overtimes.push(...entry.overtimes);
    
    return acc;
  }, {} as Record<string, {
    capexHours: number;
    opexHours: number;
    supportHours: number;
    overtimeHours: number;
    overtimes: Overtime[];
  }>);

  return (
    <Card title="Podsumowanie miesięczne">
      <div className="space-y-8">
        {Object.entries(monthlyStats)
          .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
          .map(([month, stats]) => {
            const standardHours = stats.capexHours + stats.opexHours + stats.supportHours;
            const totalHours = standardHours + stats.overtimeHours;
            
            const standardValue = standardHours * hourlyRate;
            const overtimeValue = stats.overtimeHours * hourlyRate;
            const totalValue = standardValue + overtimeValue;

            return (
              <div key={month} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {new Date(month + '-01').toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Podsumowanie godzin */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-4">Godziny</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">CAPEX:</dt>
                          <dd className="text-sm font-medium text-slate-900">{stats.capexHours}h</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">OPEX:</dt>
                          <dd className="text-sm font-medium text-slate-900">{stats.opexHours}h</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">Konsultacje:</dt>
                          <dd className="text-sm font-medium text-slate-900">{stats.supportHours}h</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">Nadgodziny:</dt>
                          <dd className="text-sm font-medium text-slate-900">{stats.overtimeHours}h</dd>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                          <dt className="text-sm font-medium text-slate-900">Łącznie:</dt>
                          <dd className="text-sm font-bold text-slate-900">{totalHours}h</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Podsumowanie wartości */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-4">Wartość</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">Standardowe:</dt>
                          <dd className="text-sm font-medium text-slate-900">{standardValue.toFixed(2)} PLN</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-600">Nadgodziny:</dt>
                          <dd className="text-sm font-medium text-slate-900">{overtimeValue.toFixed(2)} PLN</dd>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                          <dt className="text-sm font-medium text-slate-900">Łącznie:</dt>
                          <dd className="text-sm font-bold text-slate-900">{totalValue.toFixed(2)} PLN</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Lista nadgodzin */}
                  {stats.overtimes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-slate-900 mb-4">Nadgodziny</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Godziny</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Wartość</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nr incydentu</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {stats.overtimes.map((overtime, idx) => (
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
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
}

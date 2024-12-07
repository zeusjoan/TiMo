import { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import BudgetForm from './BudgetForm';
import BudgetChart from './BudgetChart';
import { TimeEntry, Overtime, Budget } from '../types';

interface SummaryProps {
  budget: Budget;
  summary: {
    capexUsed: number;
    opexUsed: number;
    supportUsed: number;
  };
  entries?: TimeEntry[];
  onBudgetUpdate: (budget: Budget) => void;
}

export default function Summary({ budget, summary, entries = [], onBudgetUpdate }: SummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthEntries = entries.filter((entry: TimeEntry) => entry.month === currentMonth);
  
  const currentMonthSummary = {
    capexUsed: currentMonthEntries.reduce((sum: number, entry: TimeEntry) => sum + entry.capexHours, 0),
    opexUsed: currentMonthEntries.reduce((sum: number, entry: TimeEntry) => sum + entry.opexHours, 0),
    supportUsed: currentMonthEntries.reduce((sum: number, entry: TimeEntry) => sum + entry.supportHours, 0),
    overtimeHours: currentMonthEntries.reduce((sum: number, entry: TimeEntry) => 
      sum + (entry.overtimes?.reduce((oSum: number, ot: Overtime) => oSum + ot.duration, 0) || 0), 0
    )
  };

  const chartData = [
    {
      label: 'CAPEX',
      used: summary.capexUsed,
      total: budget.capex,
      color: '#3b82f6' // blue-500
    },
    {
      label: 'OPEX',
      used: summary.opexUsed,
      total: budget.opex,
      color: '#10b981' // emerald-500
    },
    {
      label: 'Konsultacje',
      used: summary.supportUsed,
      total: budget.support,
      color: '#8b5cf6' // violet-500
    }
  ];

  return (
    <Card title="Podsumowanie" action={
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {budget.orderNumber ? 'Edytuj zamówienie' : 'Dodaj zamówienie'}
      </button>
    }>
      {/* Informacje o zamówieniu */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Dane zamówienia</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-slate-500">Numer zamówienia</dt>
                <dd className="text-base font-medium text-slate-900">{budget.orderNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Numer dostawcy</dt>
                <dd className="text-base font-medium text-slate-900">{budget.supplierNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Numer umowy</dt>
                <dd className="text-base font-medium text-slate-900">{budget.contractNumber || '-'}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Budżet godzin</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-slate-500">CAPEX</dt>
                <dd className="text-base font-medium text-slate-900">
                  {summary.capexUsed}h / {budget.capex}h
                  <span className="text-sm text-slate-500 ml-1">
                    ({((summary.capexUsed / budget.capex) * 100 || 0).toFixed(1)}%)
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">OPEX</dt>
                <dd className="text-base font-medium text-slate-900">
                  {summary.opexUsed}h / {budget.opex}h
                  <span className="text-sm text-slate-500 ml-1">
                    ({((summary.opexUsed / budget.opex) * 100 || 0).toFixed(1)}%)
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Konsultacje</dt>
                <dd className="text-base font-medium text-slate-900">
                  {summary.supportUsed}h / {budget.support}h
                  <span className="text-sm text-slate-500 ml-1">
                    ({((summary.supportUsed / budget.support) * 100 || 0).toFixed(1)}%)
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Wykres wykorzystania budżetu */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Wykorzystanie budżetu</h3>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <BudgetChart data={chartData} />
          </div>
        </div>
      </div>

      {/* Sekcja nadgodzin */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Nadgodziny w bieżącym miesiącu</h3>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Suma nadgodzin</p>
              <p className="text-xl font-semibold text-slate-900">
                {currentMonthSummary.overtimeHours.toFixed(1)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Wartość nadgodzin</p>
              <p className="text-xl font-semibold text-slate-900">
                {(currentMonthSummary.overtimeHours * budget.hourlyRate).toFixed(2)} PLN
              </p>
            </div>
          </div>
        </div>

        {/* Lista nadgodzin w bieżącym miesiącu */}
        {currentMonthEntries.map((entry: TimeEntry) => 
          entry.overtimes && entry.overtimes.length > 0 && (
            <div key={entry.month} className="mt-4">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Data</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Czas</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Incydent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Opis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {entry.overtimes.map((overtime: Overtime, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.date}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">
                        {overtime.startTime} - {overtime.endTime} ({overtime.duration}h)
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.incidentNumber}</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{overtime.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modal do edycji budżetu */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={budget.orderNumber ? 'Edycja zamówienia' : 'Nowe zamówienie'}
      >
        <BudgetForm
          initialBudget={budget}
          onSave={(newBudget) => {
            onBudgetUpdate(newBudget);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </Card>
  );
}

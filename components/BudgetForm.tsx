import { useState, useEffect } from 'react';
import { Budget } from '../types';

interface BudgetFormProps {
  initialBudget: Budget;
  onSave: (budget: Budget) => void;
  existingYears?: number[];
}

export default function BudgetForm({ initialBudget, onSave, existingYears = [] }: BudgetFormProps) {
  const [budget, setBudget] = useState<Budget>(initialBudget);
  const currentYear = new Date().getFullYear();
  const [availableYears] = useState(() => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      if (!existingYears.includes(i)) {
        years.push(i);
      }
    }
    return years;
  });

  useEffect(() => {
    setBudget(initialBudget);
  }, [initialBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialBudget.orderNumber && budget.orderNumber === '') {
      if (!window.confirm('Czy na pewno chcesz usunąć dane zamówienia? Tej operacji nie można cofnąć.')) {
        return;
      }
    }
    onSave(budget);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Rok budżetowy
        </label>
        <select
          value={budget.year}
          onChange={(e) => setBudget({ ...budget, year: parseInt(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          required
        >
          <option value={budget.year}>{budget.year}</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Numer zamówienia
        </label>
        <input
          type="text"
          value={budget.orderNumber}
          onChange={(e) => setBudget({ ...budget, orderNumber: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Numer dostawcy
        </label>
        <input
          type="text"
          value={budget.supplierNumber}
          onChange={(e) => setBudget({ ...budget, supplierNumber: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Data dokumentu
        </label>
        <input
          type="date"
          value={budget.documentDate}
          onChange={(e) => setBudget({ ...budget, documentDate: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Data dostawy
        </label>
        <input
          type="date"
          value={budget.deliveryDate}
          onChange={(e) => setBudget({ ...budget, deliveryDate: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Numer umowy
        </label>
        <input
          type="text"
          value={budget.contractNumber}
          onChange={(e) => setBudget({ ...budget, contractNumber: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Godziny CAPEX
        </label>
        <input
          type="number"
          value={budget.capex}
          onChange={(e) => setBudget({ ...budget, capex: Number(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          min="0"
          step="0.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Godziny OPEX
        </label>
        <input
          type="number"
          value={budget.opex}
          onChange={(e) => setBudget({ ...budget, opex: Number(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          min="0"
          step="0.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Godziny asysty
        </label>
        <input
          type="number"
          value={budget.support}
          onChange={(e) => setBudget({ ...budget, support: Number(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          min="0"
          step="0.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Stawka godzinowa
        </label>
        <input
          type="number"
          value={budget.hourlyRate}
          onChange={(e) => setBudget({ ...budget, hourlyRate: Number(e.target.value) })}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          min="0"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Zapisz
      </button>
    </form>
  );
}

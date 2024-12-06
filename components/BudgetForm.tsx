import { useState } from 'react';

interface Budget {
  orderNumber: string;
  supplierNumber: string;
  documentDate: string;
  deliveryDate: string;
  contractNumber: string;
  capex: number | '';
  opex: number | '';
  support: number | '';
  hourlyRate: number | '';
}

interface BudgetFormProps {
  initialBudget: Budget;
  onSave: (budget: Budget & {
    capex: number;
    opex: number;
    support: number;
    hourlyRate: number;
  }) => void;
}

const inputBaseStyle = `
  block w-full
  px-4 py-3
  text-slate-900 font-medium
  bg-white
  border border-slate-300
  rounded-md
  shadow-sm
  placeholder:text-slate-400
  focus:ring-2 
  focus:ring-blue-500 
  focus:border-blue-500
`;

export default function BudgetForm({ initialBudget, onSave }: BudgetFormProps) {
  const [budget, setBudget] = useState({
    orderNumber: initialBudget.orderNumber || '',
    supplierNumber: initialBudget.supplierNumber || '',
    documentDate: initialBudget.documentDate || '',
    deliveryDate: initialBudget.deliveryDate || '',
    contractNumber: initialBudget.contractNumber || '',
    capex: initialBudget.capex || '',
    opex: initialBudget.opex || '',
    support: initialBudget.support || '',
    hourlyRate: initialBudget.hourlyRate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...budget,
      capex: Number(budget.capex) || 0,
      opex: Number(budget.opex) || 0,
      support: Number(budget.support) || 0,
      hourlyRate: Number(budget.hourlyRate) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Numer zamówienia
          </label>
          <input
            type="text"
            value={budget.orderNumber}
            onChange={(e) => setBudget({ ...budget, orderNumber: e.target.value })}
            className={inputBaseStyle}
            placeholder="Wprowadź numer zamówienia"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Numer dostawcy
          </label>
          <input
            type="text"
            value={budget.supplierNumber}
            onChange={(e) => setBudget({ ...budget, supplierNumber: e.target.value })}
            className={inputBaseStyle}
            placeholder="Wprowadź numer dostawcy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Data dokumentu
          </label>
          <input
            type="date"
            value={budget.documentDate}
            onChange={(e) => setBudget({ ...budget, documentDate: e.target.value })}
            className={inputBaseStyle}
          />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Data dostawy
          </label>
          <input
            type="date"
            value={budget.deliveryDate}
            onChange={(e) => setBudget({ ...budget, deliveryDate: e.target.value })}
            className={inputBaseStyle}
          />
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-slate-900 mb-2">
          Numer umowy
        </label>
        <input
          type="text"
          value={budget.contractNumber}
          onChange={(e) => setBudget({ ...budget, contractNumber: e.target.value })}
          className={inputBaseStyle}
          placeholder="Wprowadź numer umowy"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Godziny CAPEX
          </label>
          <input
            type="number"
            min="0"
            value={budget.capex}
            onChange={(e) => setBudget({ ...budget, capex: e.target.value ? Number(e.target.value) : '' })}
            className={inputBaseStyle}
            placeholder="Wprowadź liczbę godzin CAPEX"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-900 mb-2">
            Godziny OPEX
          </label>
          <input
            type="number"
            min="0"
            value={budget.opex}
            onChange={(e) => setBudget({ ...budget, opex: e.target.value ? Number(e.target.value) : '' })}
            className={inputBaseStyle}
            placeholder="Wprowadź liczbę godzin OPEX"
          />
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-slate-900 mb-2">
          Konsultacje telefoniczne (godziny)
        </label>
        <input
          type="number"
          min="0"
          value={budget.support}
          onChange={(e) => setBudget({ ...budget, support: e.target.value ? Number(e.target.value) : '' })}
          className={inputBaseStyle}
          placeholder="Wprowadź liczbę godzin konsultacji"
        />
      </div>

      <div>
        <label className="block text-base font-medium text-slate-900 mb-2">
          Stawka godzinowa
        </label>
        <input
          type="number"
          min="0"
          value={budget.hourlyRate}
          onChange={(e) => setBudget({ ...budget, hourlyRate: e.target.value ? Number(e.target.value) : '' })}
          className={inputBaseStyle}
          placeholder="Wprowadź stawkę godzinową"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-4 rounded-md text-base font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Zapisz budżet
      </button>
    </form>
  );
}
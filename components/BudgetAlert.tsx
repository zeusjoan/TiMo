interface BudgetAlertProps {
  category: string;
  used: number;
  total: number;
  type: 'capex' | 'opex' | 'support';
}

export default function BudgetAlert({ category, used, total, type }: BudgetAlertProps) {
  const percentage = (used / total) * 100;
  
  if (percentage < 80) return null;

  const getAlertStyle = () => {
    if (percentage >= 100) {
      return {
        wrapper: 'bg-red-50 border-red-500',
        text: 'text-red-800',
        strong: 'text-red-900',
        icon: 'text-red-500',
      };
    }
    if (percentage >= 90) {
      return {
        wrapper: 'bg-orange-50 border-orange-500',
        text: 'text-orange-800',
        strong: 'text-orange-900',
        icon: 'text-orange-500',
      };
    }
    return {
      wrapper: 'bg-yellow-50 border-yellow-500',
      text: 'text-yellow-800',
      strong: 'text-yellow-900',
      icon: 'text-yellow-500',
    };
  };

  const styles = getAlertStyle();
  
  const getMessage = () => {
    if (percentage >= 100) {
      return `Przekroczono budżet ${category} o ${(percentage - 100).toFixed(1)}%!`;
    }
    if (percentage >= 90) {
      return `Uwaga! Wykorzystano ${percentage.toFixed(1)}% budżetu ${category}!`;
    }
    return `Zbliżasz się do limitu budżetu ${category} (${percentage.toFixed(1)}%)`;
  };

  const getIcon = () => {
    if (percentage >= 100) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      );
    }
    if (percentage >= 90) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className={`mb-4 border-l-4 p-4 ${styles.wrapper}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {getIcon()}
        </div>
        <div className="ml-3">
          <p className={`text-sm ${styles.text}`}>
            <strong className={`font-medium ${styles.strong}`}>
              {getMessage()}
            </strong>
          </p>
          <p className={`mt-2 text-sm ${styles.text}`}>
            Wykorzystano {used}h z {total}h ({percentage.toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
}

interface ChartProps {
  data: {
    label: string;
    used: number;
    total: number;
    color: string;
  }[];
}

export default function BudgetChart({ data }: ChartProps) {
  return (
    <div className="space-y-6">
      {data.map((item, index) => {
        const percentage = (item.used / item.total) * 100 || 0;
        
        return (
          <div key={index} className="relative">
            {/* Etykieta */}
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">{item.label}</span>
              <span className="text-sm text-slate-600">
                {item.used}h / {item.total}h ({percentage.toFixed(1)}%)
              </span>
            </div>
            
            {/* Pasek postępu */}
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>

            {/* Wskaźnik przekroczenia budżetu */}
            {percentage > 100 && (
              <div className="absolute right-0 top-0 -translate-y-6">
                <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                  Przekroczono o {(percentage - 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

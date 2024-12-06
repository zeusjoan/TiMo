interface CardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
  }
  
  export default function Card({ title, children, action }: CardProps) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          {action && <div>{action}</div>}
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  }
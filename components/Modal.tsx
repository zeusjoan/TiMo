interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
  
  export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="fixed inset-0" aria-hidden="true" onClick={onClose}></div>
          
          <div className="relative bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
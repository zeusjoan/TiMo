export const styles = {
    // Formularze
    input: `
      mt-1 
      block 
      w-full 
      rounded-md 
      border-slate-300 
      shadow-sm 
      bg-white 
      text-slate-900 
      font-medium
      px-4 
      py-3 
      focus:ring-2 
      focus:ring-blue-500 
      focus:border-blue-500
      placeholder:text-slate-400
    `,
    label: "block text-base font-medium text-slate-900 mb-2",
    formGroup: "space-y-1 mb-4",
    gridCols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    container: "space-y-8",
    buttonPrimary: "w-full bg-blue-600 text-white px-6 py-4 rounded-md text-base font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
    buttonSecondary: "px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  } as const;
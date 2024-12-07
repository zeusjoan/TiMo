// Wspólne typy dla całej aplikacji

export interface Overtime {
  id?: number;
  userId: string;
  month: string;
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
  isApproved: boolean;
}

export interface TimeEntry {
  id?: number;
  userId: string;
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  overtimeHours: number;
  description: string;
  isApproved: boolean;
  overtimes?: Overtime[]; // Dodane pole overtimes jako opcjonalne
}

export interface Budget {
  orderNumber: string;
  supplierNumber: string;
  documentDate: string;
  deliveryDate: string;
  contractNumber: string;
  capex: number;
  opex: number;
  support: number;
  hourlyRate: number;
  year: number;
}

export interface Summary {
  capexUsed: number;
  opexUsed: number;
  supportUsed: number;
}

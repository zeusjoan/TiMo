import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

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

interface Budget {
  orderNumber: string;
  supplierNumber: string;
  documentDate: string;
  deliveryDate: string;
  contractNumber: string;
  capex: number;
  opex: number;
  support: number;
  hourlyRate: number;
}

interface ExportPDFProps {
  budget: Budget;
  entries: TimeEntry[];
  currentMonth?: boolean;
}

export default function ExportPDF({ budget, entries, currentMonth = false }: ExportPDFProps) {
  const generatePDF = () => {
    // Tworzenie dokumentu z obsługą polskich znaków
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    const filteredEntries = currentMonth 
      ? entries.filter(entry => entry.month === format(new Date(), 'yyyy-MM'))
      : entries;

    // Tytuł raportu
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Raport rozliczenia czasu pracy', 15, 20);
    
    // Informacje o zamówieniu
    doc.setFontSize(12);
    doc.text('Dane zamówienia:', 15, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const zamowienieInfo = [
      `Numer zamówienia: ${budget.orderNumber}`,
      `Numer dostawcy: ${budget.supplierNumber}`,
      `Numer umowy: ${budget.contractNumber}`,
      `Data dokumentu: ${budget.documentDate}`,
      `Data dostawy: ${budget.deliveryDate}`,
    ];

    zamowienieInfo.forEach((text, index) => {
      doc.text(text, 15, 45 + (index * 6));
    });

    // Budżet godzin
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Wykorzystanie budzetu:', 15, 80);
    
    const budgetData = [
      ['Kategoria', 'Wykorzystane', 'Calkowity budzet', 'Procent'],
      ['CAPEX', 
        filteredEntries.reduce((sum, e) => sum + e.capexHours, 0).toString() + 'h',
        budget.capex + 'h',
        ((filteredEntries.reduce((sum, e) => sum + e.capexHours, 0) / budget.capex) * 100).toFixed(1) + '%'
      ],
      ['OPEX',
        filteredEntries.reduce((sum, e) => sum + e.opexHours, 0).toString() + 'h',
        budget.opex + 'h',
        ((filteredEntries.reduce((sum, e) => sum + e.opexHours, 0) / budget.opex) * 100).toFixed(1) + '%'
      ],
      ['Konsultacje',
        filteredEntries.reduce((sum, e) => sum + e.supportHours, 0).toString() + 'h',
        budget.support + 'h',
        ((filteredEntries.reduce((sum, e) => sum + e.supportHours, 0) / budget.support) * 100).toFixed(1) + '%'
      ],
    ];

    let yPos = 85;
    autoTable(doc, {
      head: [budgetData[0]],
      body: budgetData.slice(1),
      startY: yPos,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10
      },
      headStyles: {
        fillColor: [59, 130, 246], // blue-600
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249] // slate-100
      }
    });

    // Pobieramy nową pozycję Y po tabeli
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Nadgodziny
    const overtimes = filteredEntries.flatMap(entry => 
      entry.overtimes?.map(ot => ({
        ...ot,
        month: entry.month,
      })) || []
    );

    if (overtimes.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Nadgodziny:', 15, yPos);

      const overtimeData = overtimes.map(ot => [
        format(new Date(ot.date), 'd MMMM yyyy', { locale: pl })
          .normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // Usuwamy znaki diakrytyczne
        `${ot.startTime} - ${ot.endTime}`,
        ot.duration + 'h',
        ot.incidentNumber,
        ot.description,
      ]);

      autoTable(doc, {
        head: [['Data', 'Godziny', 'Czas', 'Nr incydentu', 'Opis']],
        body: overtimeData,
        startY: yPos + 5,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 10
        },
        headStyles: {
          fillColor: [245, 158, 11], // amber-500
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [254, 252, 232] // yellow-50
        }
      });

      // Aktualizujemy pozycję Y
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Podsumowanie nadgodzin
      const totalOvertime = overtimes.reduce((sum, ot) => sum + ot.duration, 0);
      const overtimeValue = totalOvertime * budget.hourlyRate * 1.5;

      doc.setFont('helvetica', 'normal');
      const overtimeSummary = [
        `Suma nadgodzin: ${totalOvertime}h`,
        `Wartosc nadgodzin: ${overtimeValue.toFixed(2)} PLN (stawka x 150%)`
      ];

      overtimeSummary.forEach((text, index) => {
        doc.text(text, 15, yPos + (index * 6));
      });

      // Aktualizujemy pozycję Y
      yPos += 20;
    }

    // Podsumowanie finansowe
    const standardHours = filteredEntries.reduce((sum, e) => 
      sum + e.capexHours + e.opexHours + e.supportHours, 0
    );
    const standardValue = standardHours * budget.hourlyRate;
    const overtimeValue = overtimes.reduce((sum, ot) => 
      sum + (ot.duration * budget.hourlyRate * 1.5), 0
    );
    const totalValue = standardValue + overtimeValue;

    doc.setFont('helvetica', 'bold');
    doc.text('Podsumowanie finansowe:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    
    const financialSummary = [
      `Godziny standardowe: ${standardValue.toFixed(2)} PLN`,
      `Nadgodziny: ${overtimeValue.toFixed(2)} PLN`,
      `Lacznie: ${totalValue.toFixed(2)} PLN`
    ];

    financialSummary.forEach((text, index) => {
      doc.text(text, 15, yPos + 10 + (index * 6));
    });

    // Stopka z datą wygenerowania
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const generatedDate = format(new Date(), 'd MMMM yyyy, HH:mm', { locale: pl })
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Usuwamy znaki diakrytyczne
      doc.text(
        `Wygenerowano: ${generatedDate}`,
        15,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Strona ${i} z ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }

    // Nazwa pliku
    const fileName = currentMonth
      ? `Raport_${format(new Date(), 'yyyy-MM')}.pdf`
      : 'Raport_pelny.pdf';

    // Pobieranie pliku
    doc.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {currentMonth ? 'Eksportuj raport miesięczny' : 'Eksportuj pełny raport'}
    </button>
  );
}

// lib/exportToExcel.js
import * as XLSX from 'xlsx';

export function exportTicketsToExcel(tickets) {
  if (!tickets || tickets.length === 0) {
    alert('No tickets to export.');
    return;
  }

  // Customize column order if needed
  const columns = [
    'period',
    'ticket_no',
    'ticket_type',
    'date_created',
    'date_closed',
    'status',
    'ext_support',
    'problem_id',
    'requestor',
    'severity',
    'shop',
    'floor',
    'area-corner',
    'problem',
    'hardware',
    'hardware_vendor',
    'software',
    'resolver',
    'description'
  ];

  // Ensure consistent order and headers
  const formattedData = tickets.map(ticket => {
    const row = {};
    columns.forEach(col => {
      row[col] = ticket[col] || '';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

   worksheet['!cols'] = columns.map(() => ({ wch: 13 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

  // XLSX.writeFile does the download automatically
  XLSX.writeFile(workbook, `tickets-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

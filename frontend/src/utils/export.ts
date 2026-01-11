/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data: any[], headers?: string[]): string => {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      // Handle values that contain commas, quotes, or newlines
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (data: any[], filename: string, headers?: string[]): void => {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Format date for export
 */
export const formatDateForExport = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Export attendees to CSV
 */
export const exportAttendeesToCSV = (attendees: any[], eventTitle: string): void => {
  const formattedData = attendees.map(attendee => ({
    'Ticket Code': attendee.ticketCode,
    'Name': attendee.userId?.name || 'N/A',
    'Email': attendee.userId?.email || 'N/A',
    'Phone': attendee.userId?.phone || 'N/A',
    'Registration Date': formatDateForExport(attendee.registeredAt),
    'Status': attendee.status,
  }));
  
  const filename = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_attendees_${Date.now()}.csv`;
  downloadCSV(formattedData, filename);
};

/**
 * Export events to CSV
 */
export const exportEventsToCSV = (events: any[]): void => {
  const formattedData = events.map(event => ({
    'Title': event.title,
    'Date': formatDateForExport(event.date),
    'Location': event.location,
    'Capacity': event.capacity,
    'Registered': event.registeredCount || 0,
    'Status': event.status,
    'Organizer': event.organizerId?.name || 'N/A',
  }));
  
  const filename = `events_export_${Date.now()}.csv`;
  downloadCSV(formattedData, filename);
};

import api from './api';

export interface CheckIn {
  _id: string;
  registrationId: string;
  scannedBy: string;
  scannedAt: Date;
  method: 'qr' | 'manual';
}

export interface ScanTicketDto {
  ticketCode: string;
  method?: 'qr' | 'manual';
  notes?: string;
}

export interface ManualCheckInDto {
  registrationId: string;
}

const checkinsService = {
  scan: async (data: ScanTicketDto) => {
    const response = await api.post('/api/check-ins/scan', data);
    return response.data;
  },

  manualCheckIn: async (data: ManualCheckInDto) => {
    const response = await api.post('/api/check-ins/manual', data);
    return response.data;
  },

  getByEvent: async (eventId: string) => {
    const response = await api.get(`/api/check-ins/event/${eventId}`);
    return response.data;
  },

  getStatistics: async (eventId: string) => {
    const response = await api.get(`/api/check-ins/stats/${eventId}`);
    return response.data;
  },
};

export default checkinsService;

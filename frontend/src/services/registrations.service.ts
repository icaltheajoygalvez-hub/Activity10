import api from './api';

export interface Registration {
  _id: string;
  eventId: string;
  userId: string;
  ticketCode: string;
  qrCodeUrl: string;
  status: 'confirmed' | 'cancelled';
  registeredAt: Date;
}

export interface CreateRegistrationDto {
  eventId: string;
}

const registrationsService = {
  create: async (data: CreateRegistrationDto) => {
    const response = await api.post('/api/registrations', data);
    return response.data;
  },

  getMyRegistrations: async (userId: string) => {
    const response = await api.get(`/api/registrations/user/${userId}`);
    return response.data;
  },

  getByEvent: async (eventId: string) => {
    const response = await api.get(`/api/registrations/event/${eventId}`);
    return response.data;
  },

  getEventStatistics: async (eventId: string) => {
    const response = await api.get(`/api/registrations/event/${eventId}/statistics`);
    return response.data;
  },

  getTicket: async (id: string) => {
    const response = await api.get(`/api/registrations/${id}/ticket`);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.delete(`/api/registrations/${id}`);
    return response.data;
  },
};

export default registrationsService;

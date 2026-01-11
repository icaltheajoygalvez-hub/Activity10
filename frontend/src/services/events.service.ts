 import api from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  organizerId: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location: string;
  capacity: number;
  imageUrl?: string;
}

export interface FilterEventDto {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
}

const eventsService = {
  getAll: async (filters?: FilterEventDto) => {
    const response = await api.get('/api/events', { params: filters });
    // Backend returns { events: [], pagination: {} }, extract events array
    return response.data.events || response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  create: async (data: CreateEventDto) => {
    const response = await api.post('/api/events', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEventDto>) => {
    const response = await api.put(`/api/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  getByOrganizer: async (organizerId: string) => {
    const response = await api.get(`/api/events/organizer/${organizerId}`);
    return response.data;
  },
};

export default eventsService;

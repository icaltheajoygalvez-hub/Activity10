import api from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'attendee';
  phone?: string;
  company?: string;
  createdAt: Date;
}

export interface UpdateUserRoleDto {
  role: 'admin' | 'organizer' | 'attendee';
}

export interface SystemStats {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalRegistrations: number;
    totalCheckIns: number;
  };
  usersByRole: Array<{
    _id: string;
    count: number;
  }>;
  recentUsers: User[];
  upcomingEvents: Array<{
    _id: string;
    title: string;
    date: Date;
    location: string;
    capacity: number;
    registeredCount: number;
    organizerId: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
  registrationsTrend: Array<{
    _id: string;
    count: number;
  }>;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const adminService = {
  getAllUsers: async (page: number = 1, limit: number = 10, search?: string): Promise<UsersResponse> => {
    const response = await api.get('/api/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  updateUserRole: async (userId: string, data: UpdateUserRoleDto) => {
    const response = await api.put(`/api/admin/users/${userId}/role`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  getStatistics: async (): Promise<SystemStats> => {
    const response = await api.get('/api/admin/statistics');
    return response.data;
  },

  exportEvents: async () => {
    const response = await api.get('/api/admin/export/events');
    return response.data;
  },

  exportRegistrations: async (eventId?: string) => {
    const response = await api.get('/api/admin/export/registrations', {
      params: { eventId }
    });
    return response.data;
  },
};

export default adminService;

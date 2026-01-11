import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventsService from '../../services/events.service';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  registeredCount: number;
  organizerId: {
    _id: string;
    name: string;
  };
}

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user?.id && (user.role === 'organizer' || user.role === 'admin')) {
      fetchMyEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getByOrganizer(user?.id || '');
      setEvents(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch events error:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date((event as any).endDate || event.date);
    
    if (endDate < now) return 'past';
    if (startDate <= now && now < endDate) return 'ongoing';
    return 'upcoming';
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return getEventStatus(event) === filter;
  });

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await eventsService.delete(eventId);
      showSuccess('Event deleted successfully');
      await fetchMyEvents();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;

  const upcomingCount = events.filter(e => getEventStatus(e) === 'upcoming').length;
  const ongoingCount = events.filter(e => getEventStatus(e) === 'ongoing').length;
  const pastCount = events.filter(e => getEventStatus(e) === 'past').length;

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">My Events</h1>
          <p className="text-body-md text-secondary-700">Manage your created events</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30">
            <p className="text-body-xs text-secondary-700 mb-1">Total Events</p>
            <p className="text-heading-md font-bold text-secondary-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30">
            <p className="text-body-xs text-secondary-700 mb-1">Upcoming</p>
            <p className="text-heading-md font-bold text-blue-600">{upcomingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30">
            <p className="text-body-xs text-secondary-700 mb-1">Ongoing</p>
            <p className="text-heading-md font-bold text-green-600">{ongoingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30">
            <p className="text-body-xs text-secondary-700 mb-1">Past</p>
            <p className="text-heading-md font-bold text-red-600">{pastCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'upcoming', 'ongoing', 'past'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-body-xs ${
                filter === f
                  ? 'bg-gradient-primary text-white shadow-soft'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Create Event Button */}
        <div className="mb-6">
          <Link
            to="/events/create"
            className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-soft transition-all text-body-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </Link>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-8 text-center border border-white/30">
            <svg className="mx-auto h-16 w-16 text-primary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-heading-sm font-bold text-secondary-900 mb-2">No Events Yet</h3>
            <p className="text-body-sm text-secondary-700 mb-6">
              You haven't created any {filter !== 'all' ? filter : ''} events yet.
            </p>
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-soft transition-all text-body-sm"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => {
              const status = getEventStatus(event);
              const statusColors = {
                upcoming: 'bg-blue-100 text-blue-800 border-blue-300',
                ongoing: 'bg-green-100 text-green-800 border-green-300',
                past: 'bg-red-100 text-red-800 border-red-300'
              };
              
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-all overflow-hidden border border-white/30"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-primary p-3 text-white">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-body-sm font-bold flex-1 text-white line-clamp-2">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap border ${statusColors[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <p className="text-body-xs text-primary-100 truncate">{event.description.substring(0, 50)}...</p>
                  </div>

                  {/* Event Details */}
                  <div className="p-3">
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-body-xs text-secondary-700">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-body-xs text-secondary-700">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center text-body-xs text-secondary-700">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.registeredCount} / {event.capacity}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 text-body-xs">
                      <Link
                        to={`/events/${event._id}`}
                        className="flex-1 px-2 py-1.5 bg-primary-600 text-white rounded text-center font-medium hover:shadow-soft transition-all"
                      >
                        View
                      </Link>
                      <Link
                        to={`/events/${event._id}/edit`}
                        className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded text-center font-medium hover:shadow-soft transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id, event.title)}
                        className="flex-1 px-2 py-1.5 bg-red-600 text-white rounded text-center font-medium hover:shadow-soft transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import registrationsService from '../../services/registrations.service';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { QRCodeSVG } from 'qrcode.react';

interface Registration {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date: Date;
    location: string;
  };
  ticketCode: string;
  status: string;
  registeredAt: Date;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await registrationsService.getMyRegistrations(user.id);
      console.log('Fetched tickets:', data);
      setTickets(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch tickets error:', err);
      setError(err.response?.data?.message || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }

    try {
      setCancellingId(registrationId);
      
      // Optimistically remove the ticket from state before API call
      setTickets(prevTickets => 
        prevTickets.filter(ticket => ticket._id !== registrationId)
      );
      
      // Call API to delete the ticket
      await registrationsService.cancel(registrationId);
      
      showSuccess('Registration cancelled successfully');
    } catch (err: any) {
      // Revert optimistic update on error by fetching fresh data
      await fetchTickets();
      showError(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">
            My Tickets
          </h1>
          <p className="text-body-md text-secondary-700">
            View and manage your event registrations
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-8 text-center border border-white/30">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-primary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <h3 className="text-heading-sm font-semibold text-secondary-900 mb-2">No Tickets Yet</h3>
              <p className="text-body-sm text-secondary-700 mb-6">
                You haven't registered for any events yet. Browse events and register to get your tickets!
              </p>
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-soft transition-all text-body-sm"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tickets.filter(ticket => ticket.eventId).map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 border border-white/30"
              >
                {/* Ticket Header */}
                <div className="bg-gradient-primary p-4 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-body-sm font-bold mb-2">{ticket.eventId?.title || 'Event'}</h3>
                      <div className="space-y-1 text-body-xs text-primary-100">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {ticket.eventId?.date ? new Date(ticket.eventId.date).toLocaleDateString() : 'Date not available'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {ticket.eventId?.location || 'Location not available'}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ml-2 ${
                      ticket.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {ticket.status}
                    </div>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* QR Code */}
                    <div className="bg-white p-2 rounded border border-primary-300 shadow-soft flex-shrink-0">
                      <QRCodeSVG 
                        value={ticket.ticketCode}
                        size={100}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 w-full">
                      <div className="mb-3">
                        <p className="text-body-xs text-secondary-700 mb-1">Ticket Code</p>
                        <p className="font-mono text-body-xs font-semibold text-secondary-900 break-all">{ticket.ticketCode}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-body-xs text-secondary-700 mb-1">Registered On</p>
                        <p className="text-body-xs text-secondary-900">
                          {new Date(ticket.registeredAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <Link
                          to={`/tickets/${ticket._id}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-primary-600 text-white rounded font-medium text-body-xs hover:shadow-soft transition-all"
                        >
                          View Ticket
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {ticket.status !== 'cancelled' && ticket.eventId && (
                          <button
                            onClick={() => handleCancelRegistration(ticket._id, ticket.eventId?.title || 'Event')}
                            disabled={cancellingId === ticket._id}
                            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-red-600 hover:shadow-soft text-white font-medium text-body-xs rounded transition-all disabled:opacity-50"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {cancellingId === ticket._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 pt-3 border-t border-primary-200">
                    <p className="text-body-xs text-secondary-700">
                      <strong>Tip:</strong> Show this QR code at the event entrance for check-in
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {tickets.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-soft p-5 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body-sm font-semibold text-secondary-900">Total Tickets</h3>
                <p className="text-heading-md font-bold text-secondary-900">{tickets.length}</p>
              </div>
              <div className="text-right">
                <p className="text-body-xs text-secondary-700">Active Registrations</p>
                <p className="text-heading-md font-bold text-green-600">
                  {tickets.filter(t => t.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;

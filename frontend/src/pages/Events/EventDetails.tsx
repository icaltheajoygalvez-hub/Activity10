import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import eventsService from '../../services/events.service';
import registrationsService from '../../services/registrations.service';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  organizerId: {
    _id: string;
    name: string;
    email: string;
  };
  imageUrl?: string;
  createdAt: Date;
}

interface EventStatistics {
  totalRegistrations?: number;
  total?: number;
  availableSpots: number;
  checkedInCount?: number;
  checkedIn?: number;
  confirmed?: number;
  cancelled?: number;
  activeRegistrations?: number;
  capacity?: number;
  checkInRate?: string | number;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [statistics, setStatistics] = useState<EventStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchStatistics();
      if (user?.id) {
        checkIfRegistered();
      }
    }
  }, [id, user?.id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getById(id!);
      setEvent(data);
      setError('');
    } catch (err: any) {
      console.error('Fetch event error:', err);
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await registrationsService.getEventStatistics(id!);
      setStatistics(stats);
    } catch (err) {
      console.error('Fetch statistics error:', err);
    }
  };

  const checkIfRegistered = async () => {
    try {
      if (!user?.id) return;
      const userTickets = await registrationsService.getMyRegistrations(user.id);
      const isRegistered = userTickets.some((ticket: any) => ticket.eventId._id === id);
      setIsAlreadyRegistered(isRegistered);
    } catch (err) {
      console.error('Check registration error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await eventsService.delete(id!);
      showSuccess('Event deleted successfully');
      navigate('/events');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete event');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleRegister = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      const response = await registrationsService.create({
        eventId: id!,
      });
      showSuccess('Registration successful! Your ticket has been generated.');
      setShowRegisterModal(false);
      
      // Refresh statistics
      await fetchStatistics();
      
      // Navigate to tickets page after a short delay
      setTimeout(() => {
        navigate('/my-tickets');
      }, 1500);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Registration failed');
      setRegistering(false);
    }
  };

  const canRegister = 
    user && 
    user.id && 
    user.role === 'attendee' && 
    (!statistics || statistics.availableSpots > 0) && 
    !isAlreadyRegistered;

  if (loading) return <LoadingSpinner />;
  if (!event) return <ErrorMessage message="Event not found" />;

  const eventDate = new Date(event.date);
  const eventEndDate = new Date((event as any).endDate || event.date);
  const now = new Date();
  const isPastEvent = eventEndDate < now;
  const isOngoing = eventDate <= now && now < eventEndDate;
  const eventStatus = isPastEvent ? 'passed' : isOngoing ? 'ongoing' : 'upcoming';

  const canEdit = user && event && !isPastEvent && (
    user.role === 'admin' || 
    (user.role === 'organizer' && event.organizerId._id === user.id)
  );

  const canDelete = user && event && !isPastEvent && (
    user.role === 'admin' || 
    (user.role === 'organizer' && event.organizerId._id === user.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/events"
          className="inline-flex items-center text-secondary-700 hover:text-secondary-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {error && <ErrorMessage message={error} />}

        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-medium overflow-hidden mb-6 border-b-4 border-primary-500">
          {event.imageUrl && (
            <div 
              className="h-64 bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-300 relative overflow-hidden"
              style={{
                backgroundImage: `url(${event.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">{event.title}</h1>
                <p className="text-secondary-700">
                  Organized by <span className="font-semibold">{event.organizerId.name}</span>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {canEdit && (
                  <Link
                    to={`/events/${id}/edit`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Edit Event
                  </Link>
                )}
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Event Status Banner */}
            {eventStatus === 'passed' && (
              <div className="mb-6 p-4 bg-red-100 border-b-4 border-red-500 rounded-xl">
                <p className="text-red-800 font-semibold">⏰ This event has already passed</p>
              </div>
            )}
            {eventStatus === 'ongoing' && (
              <div className="mb-6 p-4 bg-green-100 border-b-4 border-green-500 rounded-xl">
                <p className="text-green-800 font-semibold">🎉 Ongoing Event</p>
              </div>
            )}

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Start Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {eventDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-semibold">End Time</p>
                  <p className="text-sm text-gray-600">
                    {eventEndDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold text-gray-900">
                    {statistics ? `${statistics.totalRegistrations} / ${event.capacity}` : `${event.capacity} spots`}
                  </p>
                  {statistics && statistics.availableSpots > 0 && (
                    <p className="text-sm text-green-600">{statistics.availableSpots} spots available</p>
                  )}
                  {statistics && statistics.availableSpots === 0 && (
                    <p className="text-sm text-red-600">Event is full</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">About This Event</h2>
              <p className="text-secondary-700 whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-primary-50 rounded-2xl p-4 border-b-4 border-primary-500">
                  <p className="text-sm text-secondary-700">Total Registrations</p>
                  <p className="text-3xl font-bold text-secondary-900">{statistics.total || statistics.totalRegistrations || 0}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 border-b-4 border-green-500">
                  <p className="text-sm text-secondary-700">Available Spots</p>
                  <p className="text-3xl font-bold text-green-600">{statistics.availableSpots}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border-b-4 border-blue-500">
                  <p className="text-sm text-secondary-700">Checked In</p>
                  <p className="text-3xl font-bold text-blue-600">{statistics.checkedIn || statistics.checkedInCount || 0}</p>
                </div>
              </div>
            )}

            {/* Registration Button */}
            {user && !isPastEvent && user.role === 'attendee' ? (
              canRegister ? (
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-medium transform hover:scale-[1.02] transition-all shadow-medium"
                >
                  🎫 Register for This Event
                </button>
              ) : isAlreadyRegistered ? (
                <div className="w-full bg-green-100 text-green-700 py-4 rounded-xl text-center font-semibold border-b-4 border-green-500">
                  ✅ You're registered for this event
                </div>
              ) : (
                <div className="w-full bg-red-100 text-red-700 py-4 rounded-xl text-center font-semibold border-b-4 border-red-500">
                  ⚠️ Event is full
                </div>
              )
            ) : !user ? (
              <Link
                to="/login"
                className="w-full text-center bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-medium transform hover:scale-[1.02] transition-all shadow-medium block"
              >
                🔐 Login to Register
              </Link>
            ) : user.role !== 'attendee' && !isPastEvent ? (
              <div className="w-full bg-secondary-100 text-secondary-700 py-4 rounded-xl text-center font-semibold border-b-4 border-secondary-500">
                Only attendees can register for events
              </div>
            ) : (
              <div className="w-full bg-gray-100 text-gray-600 py-4 rounded-lg text-center font-semibold">
                This event has already passed
              </div>
            )}

            {/* Organizer Actions */}
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer Actions</h3>
                <div className="flex gap-4">
                  <Link
                    to={`/events/${id}/attendees`}
                    className="flex-1 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-center font-semibold"
                  >
                    View Attendees
                  </Link>
                  <Link
                    to={`/scanner?eventId=${id}`}
                    className="flex-1 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-center font-semibold"
                  >
                    Check-in Scanner
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => !registering && setShowRegisterModal(false)}
        title="Confirm Registration"
      >
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You are about to register for:
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{event?.title}</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>📅 {event && new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p>📍 {event?.location}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                ✨ After registration, you'll receive a ticket with a QR code that you can use for check-in at the event.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                📧 A confirmation email with your QR code will be sent to your registered email address.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowRegisterModal(false)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={registering}
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registering ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : 'Confirm Registration'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this event? This action cannot be undone.
          All registrations and check-ins will also be deleted.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetails;

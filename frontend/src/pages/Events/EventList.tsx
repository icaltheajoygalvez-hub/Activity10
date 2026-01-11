import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import eventsService, { Event } from '../../services/events.service';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { PageContainer, PageHeader, Card, CardContent, Badge, Grid } from '../../components/common/Layout';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/FormInputs';
import { SearchIcon, CreateIcon, CalendarIcon, LocationIcon } from '../../components/icons/IconSystem';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to generate gradient based on event title - kept for future use with background images
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getEventGradient = (title: string): string => {
    const gradients = [
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-blue-500 via-cyan-500 to-teal-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-green-500 via-emerald-500 to-teal-500',
      'from-purple-600 via-pink-500 to-red-500',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-indigo-600 via-blue-500 to-cyan-500',
      'from-rose-500 via-fuchsia-500 to-purple-500',
      'from-amber-500 via-orange-400 to-rose-500',
      'from-slate-600 via-purple-600 to-slate-600'
    ];
    
    // Use hash of title to consistently select gradient
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  useEffect(() => {
    fetchEvents();
  }, [location.key]); // Refetch when navigation occurs

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getAll();
      console.log('Fetched events:', data); // Debug log
      setEvents(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch events error:', err); // Debug log
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = Array.isArray(events) ? events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Discover Events"
        subtitle="Find and register for amazing events happening near you"
        action={
          isOrganizer && (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/events/create')}
            >
              <CreateIcon size={16} className="mr-2" />
              Create Event
            </Button>
          )
        }
      />

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon size={20} className="absolute right-4 top-3 text-secondary-400" />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center glass">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-heading-lg text-secondary-900 font-bold mb-2">No Events Found</h3>
            <p className="text-body-md text-secondary-600 mb-6">
              {searchTerm
                ? 'No events match your search. Try different keywords.'
                : 'There are no events available at the moment. Check back soon!'}
            </p>
            {isOrganizer && !searchTerm && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/events/create')}
              >
                Create Your First Event
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          <Grid cols={3}>
            {filteredEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group no-underline"
              >
                <Card className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden glass">
                  {/* Event Banner with Background Image */}
                  <div 
                    className="h-40 relative overflow-hidden group-hover:opacity-90 transition-opacity"
                    style={{
                      backgroundImage: event.imageUrl 
                        ? `url(${event.imageUrl})` 
                        : 'linear-gradient(135deg, #a78bfa 0%, #c084fc 50%, #f472b6 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
                      <h3 className="text-heading-sm font-bold text-white line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                    {/* Capacity Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge label={`${event.capacity} spots`} variant="primary" />
                    </div>
                  </div>

                  {/* Event Details */}
                  <CardContent className="pt-5">
                    <p className="text-body-sm text-secondary-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-2 text-body-sm text-secondary-700 font-medium">
                        <CalendarIcon size={18} className="text-secondary-700 flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-secondary-700 font-medium">
                        <LocationIcon size={18} className="text-secondary-700 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-primary-100">
                      <span className="text-body-md font-semibold text-secondary-700 group-hover:text-primary-500 flex items-center justify-between transition-colors">
                        View Details
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Grid>

          {/* Results Count */}
          <div className="mt-8 text-center">
            <p className="text-body-md text-secondary-700">
              Showing <span className="font-semibold text-secondary-900">{filteredEvents.length}</span> of{' '}
              <span className="font-semibold text-secondary-900">{events.length}</span> events
            </p>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default EventList;

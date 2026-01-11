import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import registrationsService from '../../services/registrations.service';
import eventsService from '../../services/events.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

interface Attendee {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    company?: string;
  };
  ticketCode: string;
  status: string;
  registeredAt: Date;
  checkedIn: boolean;
}

interface Event {
  title: string;
  date: Date;
}

const ViewAttendees: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventData, attendeesData] = await Promise.all([
        eventsService.getById(id!),
        registrationsService.getByEvent(id!)
      ]);
      
      // Map the data and add checkedIn property based on status
      const mappedAttendees = (Array.isArray(attendeesData) ? attendeesData : []).map((a: any) => ({
        ...a,
        checkedIn: a.status === 'checked_in'
      }));
      
      setEvent(eventData);
      setAttendees(mappedAttendees);
      setError('');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load attendees');
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendees];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(attendee =>
        attendee.userId.name.toLowerCase().includes(term) ||
        attendee.userId.email.toLowerCase().includes(term) ||
        attendee.ticketCode.toLowerCase().includes(term) ||
        (attendee.userId.company && attendee.userId.company.toLowerCase().includes(term))
      );
    }

    if (filterStatus === 'checked-in') {
      filtered = filtered.filter(a => a.checkedIn);
    } else if (filterStatus === 'not-checked-in') {
      filtered = filtered.filter(a => !a.checkedIn);
    }

    setFilteredAttendees(filtered);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [attendees, searchTerm, filterStatus]);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Ticket Code', 'Status', 'Registered At', 'Checked In'];
    const rows = filteredAttendees.map(a => [
      a.userId.name,
      a.userId.email,
      a.userId.company || 'N/A',
      a.ticketCode,
      a.status,
      new Date(a.registeredAt).toLocaleString(),
      a.checkedIn ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${event?.title || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const notCheckedInCount = attendees.length - checkedInCount;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to={`/events/${id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event Details
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Attendees</h1>
          {event && (
            <p className="text-gray-600">
              {event.title} • {new Date(event.date).toLocaleDateString()}
            </p>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Registered</p>
            <p className="text-4xl font-bold text-indigo-600">{attendees.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Checked In</p>
            <p className="text-4xl font-bold text-green-600">{checkedInCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Not Checked In</p>
            <p className="text-4xl font-bold text-orange-600">{notCheckedInCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, company, or ticket code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Attendees</option>
                <option value="checked-in">Checked In</option>
                <option value="not-checked-in">Not Checked In</option>
              </select>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredAttendees.length} of {attendees.length} attendees
          </p>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Attendees Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No one has registered for this event yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ticket Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{attendee.userId.name}</p>
                          <p className="text-sm text-gray-600">{attendee.userId.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{attendee.userId.company || '-'}</td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{attendee.ticketCode}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(attendee.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {attendee.checkedIn ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendees;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import registrationsService from '../../services/registrations.service';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useToast } from '../../contexts/ToastContext';

interface TicketData {
  _id: string;
  eventId: {
    _id?: string;
    title: string;
    date: Date;
    location: string;
    description?: string;
    imageUrl?: string;
  };
  ticketCode: string;
  qrCodeUrl: string;
  status: string;
  registeredAt: Date;
  checkedInAt?: Date;
}

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useToast();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await registrationsService.getTicket(id!);
      console.log('Fetched ticket:', data);
      setTicket(data);
      setError('');
    } catch (err: any) {
      console.error('Fetch ticket error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to fetch ticket details';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const element = document.getElementById('qr-code-download');
    if (element) {
      // Try to get canvas first (fallback for older implementation)
      let canvas = element.querySelector('canvas');
      
      // If canvas not found, try to convert SVG to canvas
      if (!canvas) {
        const svg = element.querySelector('svg');
        if (svg) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const svgString = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${ticket?.ticketCode}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
          
          img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
          return;
        }
      }
      
      // Handle canvas version
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${ticket?.ticketCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
  if (error || !ticket) return <ErrorMessage message={error || 'Ticket not found'} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/my-tickets"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Tickets
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎫 Ticket Details</h1>
          <p className="text-gray-600">{ticket.eventId.title}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your QR Code</h2>
            <div
              id="qr-code-download"
              className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6"
            >
              <QRCodeSVG
                value={ticket.ticketCode}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>
            <button
              onClick={downloadQRCode}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              📥 Download QR Code
            </button>
          </div>

          {/* Ticket Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Event Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Event Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Event Title</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ticket.eventId.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date & Time</p>
                  <p className="text-lg text-gray-900">
                    {formatDate(ticket.eventId.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg text-gray-900">{ticket.eventId.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Description</p>
                  <p className="text-gray-700">{ticket.eventId.description}</p>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Ticket Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Ticket Code</p>
                  <p className="font-mono text-sm font-semibold text-indigo-600 break-all">
                    {ticket.ticketCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ticket.status === 'confirmed' ? '✅ Confirmed' : ticket.status}
                    </span>
                    {ticket.checkedInAt && (
                      <span className="ml-3 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        ✔️ Checked In
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Registered On</p>
                  <p className="text-gray-900">
                    {new Date(ticket.registeredAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {ticket.checkedInAt && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Checked In On</p>
                    <p className="text-gray-900">
                      {new Date(ticket.checkedInAt).toLocaleString('en-US')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Show the QR code above at the event entrance for check-in.
                You can download and save it for offline access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

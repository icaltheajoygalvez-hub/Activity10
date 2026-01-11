import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import checkinsService from '../../services/checkins.service';
import eventsService from '../../services/events.service';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../contexts/ToastContext';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface ScanResult {
  ticketCode: string;
  attendeeName: string;
  eventTitle: string;
  status: 'success' | 'error' | 'duplicate';
  message: string;
  timestamp: Date;
}

interface Event {
  _id: string;
  title: string;
}

const Scanner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(searchParams.get('eventId') || '');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchOrganizerEvents();
    }
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [user?.id]);

  const fetchOrganizerEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await eventsService.getByOrganizer(user?.id || '');
      setEvents(Array.isArray(data) ? data : []);
      
      // If eventId is in URL and it exists, use it
      if (searchParams.get('eventId') && data.some((e: Event) => e._id === searchParams.get('eventId'))) {
        setSelectedEventId(searchParams.get('eventId') || '');
      } else if (data.length > 0) {
        // Otherwise select first event
        setSelectedEventId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load your events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const startScanner = () => {
    setScanning(true);
    setError('');

    // Delay to allow DOM to render the qr-reader element
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          false
        );

        scanner.render(onScanSuccess, onScanError);
        scannerRef.current = scanner;
      } catch (err: any) {
        console.error('Scanner initialization error:', err);
        setError('Failed to start camera. Please check permissions.');
        setScanning(false);
      }
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setScanning(false);
        scannerRef.current = null;
      }).catch(console.error);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    await processCheckIn(decodedText);
  };

  const onScanError = (errorMessage: string) => {
    // Ignore continuous scanning errors
    console.log('Scan error:', errorMessage);
  };

  const processCheckIn = async (ticketCode: string) => {
    try {
      const response = await checkinsService.scan({ 
        ticketCode,
        method: 'qr'
      });
      
      const result: ScanResult = {
        ticketCode,
        attendeeName: response.attendeeName || 'Unknown',
        eventTitle: response.eventTitle || 'Unknown Event',
        status: 'success',
        message: 'Check-in successful!',
        timestamp: new Date(),
      };

      setScanResults(prev => [result, ...prev]);
      setStats(prev => ({
        total: prev.total + 1,
        successful: prev.successful + 1,
        failed: prev.failed,
      }));

      showSuccess(`✅ ${response.attendeeName || 'Attendee'} checked in successfully!`);
      playSound('success');
    } catch (err: any) {
      const isDuplicate = err.response?.data?.message?.includes('already checked in');
      const errorMessage = err.response?.data?.message || 'Check-in failed';
      
      const result: ScanResult = {
        ticketCode,
        attendeeName: 'Unknown',
        eventTitle: 'Unknown Event',
        status: isDuplicate ? 'duplicate' : 'error',
        message: errorMessage,
        timestamp: new Date(),
      };

      setScanResults(prev => [result, ...prev]);
      setStats(prev => ({
        total: prev.total + 1,
        successful: prev.successful,
        failed: prev.failed + 1,
      }));

      showError(errorMessage);
      playSound('error');
    }
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    await processCheckIn(manualCode.trim());
    setManualCode('');
  };

  const playSound = (type: 'success' | 'error') => {
    // Optional: Add sound effects
    const audio = new Audio(type === 'success' ? '/sounds/success.mp3' : '/sounds/error.mp3');
    audio.play().catch(() => {
      // Ignore if sound files don't exist
    });
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-gray-900 mb-2">
            QR Code Scanner
          </h1>
          <p className="text-body-md text-secondary-700">
            Scan attendee tickets for event check-in
          </p>
        </div>

        {loadingEvents ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Event Selector */}
            {events.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-soft p-5 border border-white/30">
                <label className="block text-body-xs font-semibold text-gray-700 mb-1">
                  Select Event to Check-In:
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setScanResults([]);
                    setStats({ total: 0, successful: 0, failed: 0 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select an event --</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                {!selectedEventId && (
                  <p className="text-body-xs text-red-600 mt-2">Please select an event before scanning</p>
                )}
              </div>
            )}

            {events.length === 0 && !loadingEvents && (
              <ErrorMessage message="No events found. Create an event first or you need to be an organizer." />
            )}

            {selectedEventId && events.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Scanner Section */}
                <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              {error && <ErrorMessage message={error} />}

              {!scanning ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <h3 className="text-heading-sm font-semibold text-gray-900 mb-2">Ready to Scan</h3>
                  <p className="text-body-sm text-secondary-700 mb-4">
                    Click the button below to start scanning QR codes
                  </p>
                  <button
                    onClick={startScanner}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Start Scanner
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-body-sm font-semibold text-gray-900">Scanning...</h3>
                    <button
                      onClick={stopScanner}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-body-xs"
                    >
                      Stop Scanner
                    </button>
                  </div>
                  <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                </div>
              )}

              {/* Manual Entry */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-body-sm font-semibold text-gray-900 mb-3">Manual Entry</h3>
                <form onSubmit={handleManualCheckIn} className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter ticket code manually"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-body-sm"
                  >
                    Check In
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Stats & Results Section */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              <h3 className="text-body-sm font-semibold text-gray-900 mb-3">Statistics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-body-xs text-gray-600">Total Scans</p>
                  <p className="text-heading-md font-bold text-gray-900">{stats.total}</p>
                </div>
                <div>
                  <p className="text-body-xs text-gray-600">Successful</p>
                  <p className="text-heading-md font-bold text-green-600">{stats.successful}</p>
                </div>
                <div>
                  <p className="text-body-xs text-gray-600">Failed</p>
                  <p className="text-heading-md font-bold text-red-600">{stats.failed}</p>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              <h3 className="text-body-sm font-semibold text-gray-900 mb-3">Recent Scans</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scanResults.length === 0 ? (
                  <p className="text-body-xs text-gray-500 text-center py-4">No scans yet</p>
                ) : (
                  scanResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : result.status === 'duplicate'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-body-xs text-gray-900">{result.attendeeName}</p>
                          <p className="text-body-xs text-gray-600">{result.eventTitle}</p>
                          <p className="text-body-xs text-gray-500 mt-1">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          {result.status === 'success' && (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {result.status === 'duplicate' && (
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                          {result.status === 'error' && (
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-body-xs text-gray-600 mt-1">{result.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Scanner;

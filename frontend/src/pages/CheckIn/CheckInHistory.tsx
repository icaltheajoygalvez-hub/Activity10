import React from 'react';
import { useParams } from 'react-router-dom';

const CheckInHistory: React.FC = () => {
  const { eventId } = useParams();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Check-in History</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Event ID: {eventId}</p>
          <p className="text-gray-600 mt-2">Check-in history and statistics will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInHistory;

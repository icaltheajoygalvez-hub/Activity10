import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventsService from '../../services/events.service';
import ErrorMessage from '../../components/common/ErrorMessage';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    capacity: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.description || !formData.date || !formData.endDate || !formData.location || !formData.capacity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.date);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      setError('Event date cannot be in the past');
      setLoading(false);
      return;
    }

    if (endDate <= startDate) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    if (parseInt(formData.capacity) < 1) {
      setError('Capacity must be at least 1');
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        date: new Date(formData.date),
        endDate: new Date(formData.endDate),
      };
      console.log('Creating event with data:', eventData); // Debug log
      const response = await eventsService.create(eventData);
      console.log('Event created successfully:', response); // Debug log
      alert('Event created successfully!');
      navigate('/events');
    } catch (err: any) {
      console.error('Create event error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit file size to 500KB before compression
      const maxFileSize = 500 * 1024; // 500KB
      if (file.size > maxFileSize) {
        setError('Image is too large. Please choose an image smaller than 500KB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large
          const maxWidth = 1200;
          const maxHeight = 800;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with quality 0.7 (70%)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setImagePreview(compressedBase64);
            setFormData(prev => ({
              ...prev,
              imageUrl: compressedBase64
            }));
            setError(''); // Clear any previous errors
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-secondary-700 hover:text-secondary-900 mb-4 text-body-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">Create New Event</h1>
          <p className="text-body-md text-secondary-700">Fill in the details to create your event</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-soft p-6 border border-white/30">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                placeholder="Tech Conference 2024"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                placeholder="Describe your event..."
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                Event Image (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  disabled={loading}
                />
              </div>
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-32 object-cover rounded-lg border border-secondary-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                  placeholder="100"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 text-body-sm"
                  placeholder="Convention Center, New York"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-900 font-medium rounded-lg hover:bg-secondary-50 transition-all text-body-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-primary text-white py-2 rounded-lg font-medium hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-body-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

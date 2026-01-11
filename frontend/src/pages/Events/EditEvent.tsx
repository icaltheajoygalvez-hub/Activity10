import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventsService from '../../services/events.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const event = await eventsService.getById(id);
        
        // Format date for datetime-local input
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        const eventEndDate = new Date((event as any).endDate || event.date);
        const formattedEndDate = eventEndDate.toISOString().slice(0, 16);
        
        setFormData({
          title: event.title,
          description: event.description,
          date: formattedDate,
          endDate: formattedEndDate,
          location: event.location,
          capacity: event.capacity.toString(),
          imageUrl: event.imageUrl || '',
        });
        if (event.imageUrl) {
          setImagePreview(event.imageUrl);
        }
        setError('');
      } catch (err: any) {
        console.error('Fetch event error:', err);
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validation
    if (!formData.title || !formData.description || !formData.date || !formData.endDate || !formData.location || !formData.capacity) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }

    const startDate = new Date(formData.date);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setError('End time must be after start time');
      setSaving(false);
      return;
    }

    if (parseInt(formData.capacity) < 1) {
      setError('Capacity must be at least 1');
      setSaving(false);
      return;
    }

    try {
      await eventsService.update(id!, {
        ...formData,
        capacity: parseInt(formData.capacity),
        date: new Date(formData.date),
        endDate: new Date(formData.endDate),
      });
      navigate(`/events/${id}`);
    } catch (err: any) {
      console.error('Update event error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to update event. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex items-center text-secondary-700 hover:text-secondary-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event Details
          </button>
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">Edit Event</h1>
          <p className="text-secondary-700">Update your event information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-medium p-8 border-b-4 border-primary-500">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-primary-900"
                placeholder="Tech Conference 2024"
                required
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900"
                placeholder="Describe your event..."
                required
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Event Image (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  disabled={saving}
                />
              </div>
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-secondary-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900"
                  placeholder="100"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-secondary-900"
                  placeholder="Convention Center, New York"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/events/${id}`)}
                className="flex-1 px-6 py-3 border-2 border-secondary-300 text-secondary-900 font-semibold rounded-xl hover:bg-secondary-50 transition-all"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;

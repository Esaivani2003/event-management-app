import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Protect page for ADMIN role only
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
        const decoded: any = jwtDecode(token);

      if (decoded.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Invalid token');
      router.push('/login');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token'); // ✅ Include token

    try {
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/events');
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to create event.');
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Create New Event</h1>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL (e.g., /event3.jpg)"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-medium py-3 rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

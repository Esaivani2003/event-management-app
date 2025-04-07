import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
};

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (res.ok) {
          setEvent(data);
        } else {
          setError(data.message || 'Failed to fetch event.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to register.');
      router.push('/login');
      return;
    }

    setIsRegistering(true);

    try {
      const decoded: any = jwtDecode(token);

      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          userId: decoded.userId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registered successfully!');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) return <p className="p-4">Loading event details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!event) return <p className="p-4">Event not found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center">
      <div className="mb-4">
        <Link href="/events">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
            ← Back to Events
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold text-purple-800 mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="flex flex-col gap-2 text-gray-700 text-sm mb-6">
          <p>📍 Location: {event.location}</p>
          <p>🗓️ Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>🕒 Time: {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {isRegistering ? 'Registering...' : 'Register'}
        </button>
      </div>
    </div>
  );
}

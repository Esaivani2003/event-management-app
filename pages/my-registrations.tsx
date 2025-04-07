import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Registration = {
  id: string;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    image: string;
  };
};

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch registrations on mount
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const res = await fetch('/api/events/register', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRegistrations(data);
        } else {
          setError(data.message || 'Failed to fetch registrations.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [token, router]);

  // Handle cancellation
  const cancelRegistration = async (eventId: string) => {
    if (!token) return;

    if (!confirm('Are you sure you want to cancel this registration?')) return;

    try {
      const res = await fetch('/api/events/register', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegistrations(prev => prev.filter(r => r.event.id !== eventId));
        alert('Registration cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel registration');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  if (loading) return <p className="p-4">Loading registrations...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">My Event Registrations</h1>

      {registrations.length === 0 ? (
        <p className="text-gray-600">You haven't registered for any events yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {registrations.map(({ id, event }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-purple-700">{event.title}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  📍 {event.location} <br />
                  🗓 {new Date(event.date).toLocaleString()}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <a
                    href={`/events/${event.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Event →
                  </a>
                  <button
                    onClick={() => cancelRegistration(event.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          setError(data.message || 'Failed to fetch events.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleDelete = async (eventId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Event deleted successfully!');
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
      } else {
        alert(data.message || 'Failed to delete event.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong.');
    }
  };

  if (loading) return <p className="p-4">Loading events...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Manage Events</h1>

      <Link href="/admin/create-event">
        <button className="mb-6 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
          + Create New Event
        </button>
      </Link>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-purple-800">{event.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{event.location}</p>
                <p className="text-gray-500 text-xs">{new Date(event.date).toLocaleString()}</p>

                <div className="mt-4 flex justify-between gap-2">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
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

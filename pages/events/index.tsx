import { useEffect, useState } from 'react';
import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
};

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        console.log('Fetched data:', data); // 🔍 Debug

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.warn('Unexpected data structure:', data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="p-4">Loading events...</p>;
  if (events.length === 0) return <p className="p-4">No events available.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Upcoming Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-purple-100"
          >
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow">
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold text-purple-800">{event.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                  <p>📍 {event.location}</p>
                  <p>🕒 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <Link href={`/events/${event.id}`}>
                    <button className="mt-4 w-full bg-purple-600 text-black px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                      View
                    </button>
                  </Link>

                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

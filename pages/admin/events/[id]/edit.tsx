import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
  });

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setForm({
            title: data.title,
            description: data.description,
            date: data.date.slice(0, 16),
            location: data.location,
            image: data.image,
          });
        } else {
          toast.error(data.message || 'Failed to load event');
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Event updated!');
        router.push('/admin/events');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Update Event
        </button>
      </form>
    </div>
  );
}

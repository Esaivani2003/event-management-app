import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

type Role = 'ADMIN' | 'USER';

interface DecodedToken {
  userId: string;
  role: Role;
  email: string;
}

export default function Dashboard() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setRole(decoded.role);
    } catch (err) {
      console.error('Invalid token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Dashboard</h1>

      {role === 'ADMIN' && (
        <div className="space-y-4">
          <p className="text-green-700 font-semibold">Welcome Admin!</p>

          

          <a
            href="/admin/events"
            className="block px-4 py-2 bg-green-800 text-white rounded hover:bg-gray-900 w-fit"
          >
            📋 Manage Events
          </a>
        </div>
      )}

      {role === 'USER' && (
        <div className="space-y-4">
          <p className="text-blue-700 font-semibold">Welcome User!</p>

          <a
            href="/events"
            className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-fit"
          >
            🎉 Browse Events
          </a>

          <a
            href="/my-registrations"
            className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 w-fit"
          >
            ✅ My Registrations
          </a>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/Login");
      return;
    }

    fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/auth/Login");
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("auth/login");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/Login");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#2B2B2B]">My Profile</h2>
          <button
            onClick={() => router.push("/profile/edit")}
            className="text-blue-600 hover:underline text-sm"
          >
            ✏️ Edit
          </button>
        </div>

        {/* Profile Image with fallback */}
        <div className="mb-6">
          <img
            src={user?.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border shadow"
          />
        </div>

        <div className="text-left space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Name</label>
            <div className="px-4 py-2 border border-[#D4D4D4] rounded-lg bg-gray-100">
              {user?.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Email</label>
            <div className="px-4 py-2 border border-[#D4D4D4] rounded-lg bg-gray-100">
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-20 mt-6 bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

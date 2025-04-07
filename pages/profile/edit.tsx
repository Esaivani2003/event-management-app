import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", image: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFormData({
            name: data.user.name,
            email: data.user.email,
            image: data.user.image || "",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: formData.name, image: formData.image }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated!");
      router.push("/profile");
    } else {
      alert(data.message || "Update failed");
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4 text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg"
              required
            />
          </div>

          {/* Profile Image Field */}
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Profile Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://your-image-url.com"
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg"
            />
          </div>

          {/* Read-only Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border border-[#D4D4D4] bg-gray-100 rounded-lg"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#2B2B2B] text-white py-2 rounded-lg hover:opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const events = {
  1: { title: "Tech Conference 2025", date: "April 20, 2025", location: "San Francisco, CA" },
  2: { title: "Music Festival", date: "May 15, 2025", location: "New York, NY" },
  3: { title: "Startup Meetup", date: "June 10, 2025", location: "Los Angeles, CA" },
};

const Register = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const event = events[Number(eventId) as keyof typeof events];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  if (!event) {
    return <p className="text-center text-lg">Event not found.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering for event:", event.title, formData);
    // TODO: Connect with API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-6 text-center">
          Register for {event.title}
        </h2>
        <p className="text-center text-[#B3B3B3] mb-4">
          {event.date} • {event.location}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-[#2B2B2B] text-white py-2 rounded-lg hover:opacity-90 transition">
            Register Now
          </button>
        </form>

        {/* Back to Events */}
        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          <Link href="/events" className="text-[#2B2B2B] underline hover:text-[#000]">
            Back to Events
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

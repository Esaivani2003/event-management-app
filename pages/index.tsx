
import Link from "next/link";

export default function Home() {
  return (

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3] text-white text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to EventApp</h1>
        <p className="text-lg mb-6">
          Discover and register for amazing events near you!
        </p>
        <Link href="/events">
          <button className="bg-white text-[#2B2B2B] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Get Started
          </button>
        </Link>
      </div>
    
  );
}

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Importing icons for menu

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3]">
            {/* Navbar */}
            <nav className="bg-[#2B2B2B] text-white py-4 px-6 flex justify-between items-center shadow-md">
                {/* Logo */}
                <Link href="/" className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                    Event <span className="text-white">REG</span>
                </Link>


                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Link href="/events">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            events
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            My Dashboard
                        </button>
                    </Link>
                    <Link href="/profile">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            Profile
                        </button>
                    </Link>
                    <Link href="/auth/Login">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            Login
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden focus:outline-none"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden  bg-[#2B2B2B] text-white py-4 px-6 space-y-4 absolute top-16 left-0 w-full shadow-lg">
                    <Link href="/events" onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            events
                        </button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            My Dashboard
                        </button>
                    </Link>
                    <Link href="/profile" onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            Profile
                        </button>
                    </Link>
                    <Link href="/auth/Login" onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">
                            Login
                        </button>
                    </Link>
                </div>
            )}

            {/* Page Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-[#2B2B2B] text-white text-center py-4 mt-10">
                &copy; {new Date().getFullYear()} Event Manager. All Rights Reserved.
            </footer>
        </div>
    );
};

export default Layout;

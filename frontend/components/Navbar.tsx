"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close menus when auth state changes
    setShowUserMenu(false);
  }, [user]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Clicks on the dropdown/toggle shouldn't close it; everything else should.
      if (target.closest("[data-user-menu]")) return;
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    await auth.signOut();
    setShowUserMenu(false);
    setIsOpen(false);
  };

  const isAuthed = !loading && !!user;

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all ${
        scrolled
          ? "bg-white/95 border-b border-gray-200 shadow-sm"
          : "bg-white/90 border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Journyzer
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isAuthed ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <Compass className="w-4 h-4" />
                  Explore
                </Link>
                <Link
                  href="/trips"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  My Trips
                </Link>

                <div className="relative" data-user-menu>
                  <button
                    type="button"
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full blur opacity-50" />
                      <div className="relative w-10 h-10 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-linear-to-br from-indigo-50/50 to-purple-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user?.displayName || "Travel Enthusiast"}
                            </p>
                            <p className="text-sm text-gray-600 truncate max-w-40">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group"
                        >
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <Compass className="w-4 h-4" />
                  Explore
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="group relative bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthed ? (
              <div className="flex flex-col gap-3">
                <div className="p-4 bg-linear-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {user?.displayName || "Travel Enthusiast"}
                      </p>
                      <p className="text-sm text-gray-600 truncate max-w-55">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Compass className="w-4 h-4" />
                  Explore
                </Link>
                <Link
                  href="/trips"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="w-4 h-4" />
                  My Trips
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/explore"
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-xl font-bold text-center hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  X, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  User, 
  MapPin,
  Compass,
  Settings,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const brandHref = !loading && user ? "/dashboard" : "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50" 
          : "bg-white/90 backdrop-blur-md border-b border-gray-200/30"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={brandHref} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Journyzer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="group flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50"
                >
                  <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Dashboard
                </Link>
                <Link 
                  href="/explore" 
                  className="group flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-50"
                >
                  <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Explore
                </Link>
                <Link 
                  href="/trips" 
                  className="group flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-pink-50"
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  My Trips
                </Link>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                {/* Notifications */}
                <button className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full blur opacity-50"></div>
                      <div className="relative w-10 h-10 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-linear-to-br from-indigo-50/50 to-purple-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user.displayName || "Travel Enthusiast"}
                            </p>
                            <p className="text-sm text-gray-600 truncate max-w-40">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium group"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          My Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all font-medium group"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            auth.signOut();
                            setShowUserMenu(false);
                          }}
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
                  href="/features" 
                  className="text-gray-700 hover:text-indigo-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50"
                >
                  Features
                </Link>
                <Link 
                  href="/explore" 
                  className="text-gray-700 hover:text-purple-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-50"
                >
                  Explore
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-pink-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-pink-50"
                >
                  Pricing
                </Link>

                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 transition-all font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="group relative bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200/50 animate-fadeIn">
            {user ? (
              <div className="flex flex-col gap-2">
                {/* User Info Card */}
                <div className="mb-4 p-4 bg-linear-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {user.displayName || "Travel Enthusiast"}
                      </p>
                      <p className="text-sm text-gray-600 truncate max-w-50">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/dashboard" 
                  className="group flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Dashboard
                </Link>
                <Link 
                  href="/explore" 
                  className="group flex items-center gap-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Explore
                </Link>
                <Link 
                  href="/trips" 
                  className="group flex items-center gap-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  My Trips
                </Link>

                <div className="h-px bg-gray-200 my-2"></div>

                <Link 
                  href="/profile" 
                  className="group flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  My Profile
                </Link>
                <Link 
                  href="/settings" 
                  className="group flex items-center gap-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Settings
                </Link>

                <div className="h-px bg-gray-200 my-2"></div>

                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="group flex items-center gap-3 text-red-600 hover:bg-red-50 transition-all font-semibold py-3.5 px-4 rounded-xl text-left"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  href="/features" 
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/explore" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Explore
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all font-semibold py-3.5 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>

                <div className="h-px bg-gray-200 my-2"></div>

                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all font-semibold py-3.5 px-4 rounded-xl text-center"
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
                  <Sparkles className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
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
  const [user, setUser] = useState(auth.currentUser);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Journyzer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/trips" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  My Trips
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button 
                    onClick={() => auth.signOut()}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur opacity-50"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user.displayName || "Travel Enthusiast"}
                            </p>
                            <p className="text-sm text-gray-600 truncate max-w-[160px]">
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
                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col gap-2">
                {/* User Info Card */}
                <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {user.displayName || "Travel Enthusiast"}
                      </p>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/trips" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="w-4 h-4" />
                  My Trips
                </Link>

                <div className="h-px bg-gray-200 my-2"></div>

                {/* <Link 
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
                </Link> */}

                <div className="h-px bg-gray-200 my-2"></div>

                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium py-2 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  href="/features" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-xl font-bold text-center hover:shadow-2xl transition-all flex items-center justify-center gap-2"
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
"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { Menu, X, Sparkles, LogOut, LayoutDashboard, User, MapPin } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  // Listen to auth state changes
  useState(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  });

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/features" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Pricing
                </Link>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Get Started
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
              <div className="flex flex-col gap-3">
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold text-center mt-2"
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
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import type { User } from "firebase/auth";
import { 
  Plus, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Map,
  Calendar,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";

type Trip = {
  _id: string;
  destination?: string;
  days?: number;
  budget?: string | number;
  createdAt?: string | number | Date;
  interests?: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [greeting, setGreeting] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTrips = async () => {
      setTripsLoading(true);
      setTripsError("");

      try {
        const res = await api.get("/trips");
        if (cancelled) return;
        const list = (res.data as Trip[]) || [];
        // Sort newest first (defensive parsing)
        list.sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
          return bt - at;
        });
        setTrips(list);
      } catch (err: any) {
        if (cancelled) return;
        setTripsError(err?.response?.data?.message || "Failed to load your trips");
      } finally {
        if (!cancelled) setTripsLoading(false);
      }
    };

    loadTrips();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickActions = [
    {
      title: "Plan New Trip",
      description: "Create AI-powered itinerary",
      icon: Sparkles,
      href: "/create-itinerary",
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "Explore Destinations",
      description: "Discover new places",
      icon: Map,
      href: "/explore",
      color: "from-blue-600 to-cyan-600"
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {greeting}, {user?.displayName?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">Ready to plan your next adventure?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className={`bg-linear-to-r ${action.color} rounded-2xl p-8 text-white hover:shadow-xl transition-all cursor-pointer group`}>
                  <div className="flex items-start justify-between mb-4">
                    <action.icon className="w-10 h-10" />
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                  <p className="text-white/90 text-lg">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Trips / Empty State */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {tripsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your plans...</p>
              </div>
            ) : tripsError ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>{tripsError}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Retry
                  </button>
                  <Link
                    href="/create-itinerary"
                    className="px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50"
                  >
                    Plan New Trip
                  </Link>
                </div>
              </div>
            ) : trips.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Your Plans</h3>
                    <p className="text-gray-600">Pick up where you left off</p>
                  </div>
                  <Link
                    href="/trips"
                    className="text-indigo-700 hover:text-indigo-800 font-semibold inline-flex items-center gap-2"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.slice(0, 6).map((trip) => (
                    <Link
                      key={trip._id}
                      href={`/trips/${trip._id}`}
                      className="block rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="h-20 bg-linear-to-r from-indigo-500 to-purple-600 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-white/80" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {trip.destination || "Trip"}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {trip.days ? (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{trip.days} {trip.days === 1 ? "day" : "days"}</span>
                            </div>
                          ) : null}
                          {trip.createdAt ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(trip.createdAt as any).toLocaleDateString()}</span>
                            </div>
                          ) : null}
                        </div>

                        {Array.isArray(trip.interests) && trip.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {trip.interests.slice(0, 3).map((interest) => (
                              <span
                                key={interest}
                                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <Link href="/create-itinerary">
                    <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Plan New Trip
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-linear-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Create your first AI-powered itinerary with personalized recommendations, maps, and budget tracking
                </p>
                <Link href="/create-itinerary">
                  <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Trip
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
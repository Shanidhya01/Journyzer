"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import WikiImage from "@/components/WikiImage";
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
            {/* Plan New Trip Card - visually rich */}
            <Link href="/create-itinerary">
              <div className="relative h-48 rounded-3xl overflow-hidden group cursor-pointer">
                {/* Background Image */}
                <img
                  src="https://picsum.photos/seed/plan-new-trip/1200/400"
                  alt="Plan New Trip"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-purple-500/70" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <ArrowRight className="ml-auto w-5 h-5 opacity-80" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">Plan New Trip</h3>
                    <p className="mt-1 text-white/90">
                      Create AI-powered itinerary
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Explore Destinations Card - visually rich */}
            <Link href="/explore">
              <div className="relative h-48 rounded-3xl overflow-hidden group cursor-pointer">
                {/* Background Image */}
                <img
                  src="https://picsum.photos/seed/explore-destinations/1200/400"
                  alt="Explore Destinations"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-500/70" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center gap-3">
                    <Map className="w-6 h-6" />
                    <ArrowRight className="ml-auto w-5 h-5 opacity-80" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">Explore Destinations</h3>
                    <p className="mt-1 text-white/90">
                      Discover new places
                    </p>
                  </div>
                </div>
              </div>
            </Link>
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
                      <div className="h-48 relative overflow-hidden rounded-t-3xl bg-gray-200">
                        <WikiImage 
                          city={trip.destination || ""} 
                          country="" 
                          gradient="from-indigo-200 to-purple-200" 
                        />

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
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
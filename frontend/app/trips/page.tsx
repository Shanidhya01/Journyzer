"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Loader2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  Edit
} from "lucide-react";

type Trip = {
  _id: string;
  destination?: string;
  status?: "upcoming" | "completed" | "draft" | (string & {});
  days?: number;
  budget?: number | string;
  createdAt?: string | number | Date;
  interests?: string[];
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    api.get("/trips")
      .then(res => {
        setTrips(res.data as Trip[]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load your trips. Please try again."
        );
        setLoading(false);
      });
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = (trip.destination ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const deleteTrip = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await api.delete(`/trips/${id}`);
        setTrips(prev => prev.filter(t => t._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load your trips
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            If this only happens after deployment, double-check your backend URL
            configuration (e.g. `NEXT_PUBLIC_API_URL`) and that your backend is
            reachable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-gray-600">Manage and view all your travel plans</p>
          </div>
          <Link href="/create-itinerary">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Trip
            </button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12">
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? "No trips found" : "No trips yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search or filters" 
                  : "Start planning your first adventure with AI-powered itineraries"}
              </p>
              {!searchQuery && (
                <Link href="/create-itinerary">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Trip
                  </button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                {/* Trip Image/Header */}
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-white/80" />
                  </div>
                  {trip.status && (
                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      trip.status === 'upcoming' ? 'bg-blue-500 text-white' :
                      trip.status === 'completed' ? 'bg-green-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  )}
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {trip.destination}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {trip.days && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{trip.days} {trip.days === 1 ? 'day' : 'days'}</span>
                      </div>
                    )}
                    {trip.budget && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{trip.budget} budget</span>
                      </div>
                    )}
                    {trip.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Created {new Date(trip.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {trip.interests && trip.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {trip.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                          {interest}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{trip.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Link href={`/trips/${trip._id}`} className="flex-1">
                      <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteTrip(trip._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredTrips.length > 0 && (
          <p className="text-center text-gray-600 mt-6">
            Showing {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'}
          </p>
        )}
      </div>
    </div>
  );
}
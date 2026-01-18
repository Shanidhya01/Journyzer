"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe,
  Heart,
  Award,
  Sparkles,
  Edit2,
  Save,
  X,
} from "lucide-react";

type UserProfile = {
  _id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  createdAt?: string;
  stats?: {
    totalTrips: number;
    totalDays: number;
    countriesVisited: number;
    citiesVisited: number;
  };
};

type Trip = {
  _id: string;
  destination: string;
  days?: number;
  budget?: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
  });

  const user = auth.currentUser;

  useEffect(() => {
    fetchProfile();
    fetchRecentTrips();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/user/profile");
      const profileData = res.data as UserProfile;
      setProfile(profileData);
      setFormData({
        displayName: profileData.displayName || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTrips = async () => {
    try {
      const res = await api.get("/trips?limit=3");
      setRecentTrips(res.data as Trip[]);
    } catch (err) {
      console.error("Failed to load recent trips:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.put("/user/profile", formData);
      setProfile(res.data as UserProfile);
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: profile?.displayName || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              </div>
              <Loader2 className="relative w-20 h-20 text-indigo-600 animate-spin mx-auto" />
            </div>
            <p className="text-gray-700 font-bold text-xl">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-6xl py-12">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/50">
            {/* Cover Banner */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-6 right-6">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="group flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-xl font-bold text-indigo-700 hover:bg-white transition-all shadow-lg hover:shadow-xl"
                  >
                    <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-8 -mt-20">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-50"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Details */}
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                          rows={3}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-black text-gray-900 mb-2">
                        {profile?.displayName || "Travel Enthusiast"}
                      </h1>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">{profile?.email}</span>
                        </div>
                        {profile?.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{profile.location}</span>
                          </div>
                        )}
                        {profile?.createdAt && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                      {profile?.bio && (
                        <p className="text-gray-700 leading-relaxed max-w-2xl">{profile.bio}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{profile?.stats?.totalTrips || 0}</p>
                  <p className="text-sm font-semibold text-gray-600">Total Trips</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{profile?.stats?.totalDays || 0}</p>
                  <p className="text-sm font-semibold text-gray-600">Days Traveled</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{profile?.stats?.countriesVisited || 0}</p>
                  <p className="text-sm font-semibold text-gray-600">Countries</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{profile?.stats?.citiesVisited || 0}</p>
                  <p className="text-sm font-semibold text-gray-600">Cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Recent Trips</h2>
              </div>
              <a href="/trips" className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">
                View All →
              </a>
            </div>

            {recentTrips.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-semibold">No trips yet</p>
                <p className="text-sm text-gray-500 mb-4">Start planning your first adventure!</p>
                <a
                  href="/create-itinerary"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Plan a Trip
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <a
                    key={trip._id}
                    href={`/trips/${trip._id}`}
                    className="block group p-6 rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {trip.destination}
                          </h3>
                          <div className="flex gap-3 text-sm text-gray-600 mt-1">
                            {trip.days && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {trip.days} days
                              </span>
                            )}
                            {trip.budget && (
                              <span>• {trip.budget}</span>
                            )}
                            <span>• {new Date(trip.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
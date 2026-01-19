"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
  Globe2,
  Clock,
  Users,
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plan Your Dream Trip
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
              in Minutes, Not Hours
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized day-wise itineraries with interactive maps, budget breakdowns, and smart recommendations powered by AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={!loading && user ? "/dashboard" : "/login"}
              className="group bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              {!loading && user ? "Go to Dashboard" : "Start Planning Free"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/50 transition-all">
              See How It Works
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Day-Wise Itineraries</h3>
            <p className="text-gray-600">
              Get detailed plans for each day with optimal timing, activities, and travel routes
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Maps</h3>
            <p className="text-gray-600">
              Visualize your journey with integrated maps showing all destinations and routes
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Budgeting</h3>
            <p className="text-gray-600">
              Track expenses with detailed cost breakdowns for accommodation, food, and activities
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Globe2 className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">195+</div>
            <div className="text-sm text-gray-600">Countries Covered</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">&lt; 2 min</div>
            <div className="text-sm text-gray-600">Planning Time</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">AI-Powered</div>
            <div className="text-sm text-gray-600">Smart Planning</div>
          </div>
        </div>
      </div>
    </main>
  );
}
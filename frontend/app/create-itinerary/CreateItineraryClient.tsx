"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Sparkles,
  Loader2,
  ArrowRight,
  Plus,
  X,
  MapPinned,
  CheckCircle2,
} from "lucide-react";

export default function CreateItineraryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destinationFromQuery = searchParams.get("destination");
  const interestsFromQueryRaw = searchParams.getAll("interests");

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("Medium");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = [
    "Food & Dining",
    "History & Culture",
    "Adventure",
    "Nature & Wildlife",
    "Shopping",
    "Nightlife",
    "Art & Museums",
    "Beach & Relaxation",
    "Photography",
    "Sports & Fitness",
  ];

  const budgetOptions = [
    { value: "Low", label: "Budget", description: "$ - Affordable options", emoji: "💰" },
    { value: "Medium", label: "Moderate", description: "$$ - Balanced experience", emoji: "💳" },
    { value: "High", label: "Luxury", description: "$$$ - Premium choices", emoji: "💎" },
  ];

  useEffect(() => {
    if (destinationFromQuery && !destination) {
      setDestination(destinationFromQuery);
    }

    // Support both:
    // - /create-itinerary?interests=Food%20%26%20Dining&interests=Shopping
    // - /create-itinerary?interests=Food%20%26%20Dining,Shopping,Nightlife
    if (interests.length === 0) {
      const fromAll = interestsFromQueryRaw
        .flatMap((v) => v.split(","))
        .map((v) => v.trim())
        .filter(Boolean);

      if (fromAll.length > 0) {
        const allowed = new Set(interestOptions);
        const filtered = Array.from(new Set(fromAll)).filter((v) => allowed.has(v));
        if (filtered.length > 0) setInterests(filtered);
      }
    }
    // intentionally not depending on `destination` to avoid overriding user input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationFromQuery, interestsFromQueryRaw.join("|")]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests((prev) => prev.filter((i) => i !== interest));
  };

  const generate = async () => {
    setError("");

    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    if (interests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/itinerary/generate", {
        destination: destination.trim(),
        days,
        budget,
        interests,
      });

      const trip = (res.data as any)?.trip;
      if (trip?._id) {
        router.push(`/trips/${trip._id}`);
        return;
      }

      setData(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to generate itinerary. Please ensure you're logged in and the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden bg-travel-pattern">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ede9fe_0%,_#f5f3ff_35%,_#ffffff_70%)]" />

        <div className="relative container mx-auto px-4 max-w-5xl py-12 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg mb-6 border border-indigo-100">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-sm font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Travel Planning
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Your Perfect Trip
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Tell us about your dream destination and we'll craft a personalized itinerary just for you
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-white/20">
            <div className="space-y-8">
              {/* Destination */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  Where do you want to go?
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Paris, Tokyo, New York, Bali..."
                  className="w-full px-6 py-4 text-black border border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm text-lg placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:scale-[1.01] focus:border-purple-400 outline-none"
                />
              </div>

              {/* Days */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  How many days?
                  <span className="ml-auto text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {days} {days === 1 ? "day" : "days"}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full h-3 bg-linear-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer accent-purple-600 transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:scale-[1.01]"
                  style={{
                    background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${((days - 1) / 13) * 100}%, rgb(243 232 255) ${((days - 1) / 13) * 100}%, rgb(243 232 255) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>1 day</span>
                  <span>1 week</span>
                  <span>2 weeks</span>
                </div>
              </div>

              {/* Budget */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  What's your budget?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBudget(option.value)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                        budget === option.value
                          ? "border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      {budget === option.value && (
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-1">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="font-bold text-gray-900 mb-1 text-lg">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                  <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  What are your interests?
                  {interests.length > 0 && (
                    <span className="ml-auto text-sm font-semibold text-indigo-600">
                      {interests.length} selected
                    </span>
                  )}
                </label>

                {/* Selected Interests */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-indigo-200 hover:shadow-md transition-all"
                      >
                        {interest}
                        <button
                          onClick={() => removeInterest(interest)}
                          className="hover:bg-indigo-100 rounded-full p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Interest Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        interests.includes(interest)
                          ? "border-indigo-500 bg-indigo-500 text-white shadow-md scale-105"
                          : "border-gray-200 text-gray-700 bg-white hover:border-indigo-300 hover:shadow-sm"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                {/* Custom Interest */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomInterest()}
                    placeholder="Add your own interest..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm text-sm transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:scale-[1.01] focus:border-purple-400 outline-none"
                  />
                  <button
                    onClick={addCustomInterest}
                    className="px-5 py-3 min-h-[48px] bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generate}
                disabled={loading}
                className="w-full min-h-[48px] bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Crafting Your Perfect Itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate My Itinerary
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Results (fallback only; normally we redirect to the created trip) */}
          {data && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl">
                  <MapPinned className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Itinerary Generated
                  </h2>
                  <p className="text-gray-600">
                    We couldn’t auto-open the trip page, but the response is shown below.
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                <pre className="overflow-auto text-sm text-gray-700 font-mono">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}

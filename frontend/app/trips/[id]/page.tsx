"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import MapView from "@/components/MapView";
import WikiImage from "@/components/WikiImage";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  CheckCircle2,
  Heart,
  Navigation,
  Plane,
  Camera,
  X,
  Download,
} from "lucide-react";

type Location = {
  lat: number;
  lng: number;
  name?: string;
  day?: number;
};

type ItineraryDayActivities = {
  day: number;
  title?: string;
  activities: string[];
};

type ItineraryDaySlots = {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
};

type Trip = {
  _id: string;
  destination?: string;
  days?: number;
  budget?: string | number;
  interests?: string[];
  createdAt?: string;
  itinerary?: unknown;
  locations?: Location[];
};

function isActivitiesItinerary(
  itinerary: unknown
): itinerary is ItineraryDayActivities[] {
  return (
    Array.isArray(itinerary) &&
    itinerary.every(
      (d) =>
        d &&
        typeof d === "object" &&
        "day" in d &&
        "activities" in d &&
        Array.isArray((d as any).activities)
    )
  );
}

function isSlotsItinerary(
  itinerary: unknown
): itinerary is ItineraryDaySlots[] {
  return (
    Array.isArray(itinerary) &&
    itinerary.every(
      (d) =>
        d &&
        typeof d === "object" &&
        "day" in d &&
        "morning" in d &&
        "afternoon" in d &&
        "evening" in d
    )
  );
}

// Enhanced ItineraryCard component with improved styling
const EnhancedItineraryCard = ({
  itinerary,
}: {
  itinerary: ItineraryDaySlots[];
}) => (
  <div className="space-y-6">
    {itinerary.map((day) => (
      <div
        key={day.day}
        className="border-2 border-indigo-100 rounded-2xl overflow-hidden bg-linear-to-br from-white to-indigo-50/30"
      >
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Day {day.day}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="p-2 bg-amber-100 rounded-lg h-fit">
              <Coffee className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-700 uppercase mb-1">
                Morning
              </div>
              <p className="text-gray-800">{day.morning}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 bg-orange-100 rounded-lg h-fit">
              <Sun className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-orange-700 uppercase mb-1">
                Afternoon
              </div>
              <p className="text-gray-800">{day.afternoon}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg h-fit">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-indigo-700 uppercase mb-1">
                Evening
              </div>
              <p className="text-gray-800">{day.evening}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function TripDetailsPage() {
  const params = useParams();
  const id = (params as any)?.id as string | undefined;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const locations = useMemo(
    () => (trip?.locations ?? []) as Location[],
    [trip]
  );

  const locationsByDay = useMemo(() => {
    const map: Record<number, Location[]> = {};
    for (const loc of locations) {
      const day =
        typeof loc.day === "number" && Number.isFinite(loc.day) ? loc.day : 1;
      if (!map[day]) map[day] = [];
      map[day].push(loc);
    }
    return map;
  }, [locations]);

  const derivedDays = useMemo(() => {
    const fromTrip =
      typeof trip?.days === "number" && trip.days > 0 ? trip.days : 0;
    const fromLocations =
      locations.length > 0
        ? Math.max(
            ...locations.map((l) => (typeof l.day === "number" ? l.day : 1))
          )
        : 0;
    const fromItinerary = Array.isArray(trip?.itinerary)
      ? (trip?.itinerary as any[]).length
      : 0;
    return Math.max(fromTrip, fromLocations, fromItinerary, 1);
  }, [trip, locations]);

  const dayNumbers = useMemo(
    () => Array.from({ length: derivedDays }, (_, i) => i + 1),
    [derivedDays]
  );

  const selectedDayLocations = useMemo(
    () => locationsByDay[selectedDay] ?? [],
    [locationsByDay, selectedDay]
  );

  useEffect(() => {
    // Keep the selected day within range
    if (selectedDay > derivedDays) setSelectedDay(1);
    if (selectedDay < 1) setSelectedDay(1);
  }, [derivedDays, selectedDay]);

  const buildDirectionsUrl = (loc: Location) => {
    const destination = `${loc.lat},${loc.lng}`;
    // Leaving origin unspecified lets Google Maps use current location / prompt user
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}&travelmode=driving`;
  };

  const openDirections = (loc: Location) => {
    if (!loc?.lat || !loc?.lng) return;
    window.open(buildDirectionsUrl(loc), "_blank", "noopener,noreferrer");
  };

  const buildDayRouteUrl = (locs: Location[]) => {
    if (!locs || locs.length === 0) return null;
    if (locs.length === 1) return buildDirectionsUrl(locs[0]);

    const destination = `${locs[locs.length - 1].lat},${
      locs[locs.length - 1].lng
    }`;
    const waypoints = locs
      .slice(0, -1)
      .map((l) => `${l.lat},${l.lng}`)
      .join("|");

    const params = new URLSearchParams({
      api: "1",
      origin: "Current Location",
      destination,
      travelmode: "driving",
    });

    if (waypoints) params.set("waypoints", waypoints);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  };

  const fetchTrip = async () => {
    if (!id) return;
    setError("");
    setLoading(true);
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data as Trip);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const generateItinerary = async () => {
    if (!trip?._id) return;

    setGenerating(true);
    setError("");
    try {
      const res = await api.post("/itinerary/generate", {
        tripId: trip._id,
        destination: trip.destination,
        days: trip.days,
        interests: trip.interests,
        budget: trip.budget,
      });

      // Backend returns { trip, itinerary, locations }
      const updatedTrip = (res.data as any)?.trip as Trip | undefined;
      if (updatedTrip) setTrip(updatedTrip);
      else await fetchTrip();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to generate itinerary");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!trip || !trip.itinerary) return;

    const response = await api.post(
      "/pdf/trip",
      {
        destination: trip.destination,
        itinerary: trip.itinerary,
        locations: trip.locations,
      },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${trip.destination || "trip"}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-700 font-semibold px-4 py-2 rounded-xl hover:bg-white/50 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Trips
            </Link>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-16 text-center border border-white/20">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
              <p className="text-gray-700 font-semibold text-lg">
                Loading your adventure...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Oops! Something went wrong
                </h2>
                <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 mb-6 inline-block">
                  {error}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={fetchTrip}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/trips"
                    className="px-8 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:bg-white/50 transition-all"
                  >
                    Go Back
                  </Link>
                </div>
              </div>
            </div>
          ) : !trip ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20">
              <p className="text-gray-700 text-lg">Trip not found.</p>
            </div>
          ) : (
            <>
              {/* Header Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/20">
                {/* City Image Banner with overlays */}
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

                  {/* Status dots (preserved from original) */}
                  <div className="absolute top-4 right-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            {trip.destination || "Your Trip"}
                          </h1>
                          <div className="flex flex-wrap gap-4 text-sm">
                            {trip.days && (
                              <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold border border-indigo-200">
                                <Clock className="w-4 h-4" />
                                {trip.days} {trip.days === 1 ? "day" : "days"}
                              </span>
                            )}
                            {trip.budget && (
                              <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-semibold border border-green-200">
                                <DollarSign className="w-4 h-4" />
                                {trip.budget}
                              </span>
                            )}
                            {trip.createdAt && (
                              <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-semibold border border-purple-200">
                                <Calendar className="w-4 h-4" />
                                {new Date(trip.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {Array.isArray(trip.interests) &&
                        trip.interests.length > 0 && (
                          <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Heart className="w-4 h-4 text-indigo-600" />
                              <span className="text-sm font-bold text-indigo-900">
                                Your Interests
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {trip.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="inline-flex items-center gap-1.5 bg-white text-indigo-700 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-indigo-200"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={generateItinerary}
                        disabled={generating}
                        className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center gap-3">
                          {generating ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Creating Magic...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              Generate Itinerary
                            </>
                          )}
                        </span>
                      </button>
                      {!!trip.itinerary && (
                        <button
                          onClick={downloadPDF}
                          className="bg-white text-indigo-700 border-2 border-indigo-500 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all inline-flex items-center justify-center gap-3"
                        >
                          <Download className="w-5 h-5" /> Export Itinerary as PDF
                        </button>
                      )}

                      {!!trip.itinerary && (
                        <div className="text-center">
                          <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full font-semibold border border-green-200">
                            <CheckCircle2 className="w-4 h-4" />
                            Itinerary Ready
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Itinerary Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Itinerary
                    </h2>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
                    {isSlotsItinerary(trip.itinerary) ? (
                      <EnhancedItineraryCard itinerary={trip.itinerary} />
                    ) : isActivitiesItinerary(trip.itinerary) ? (
                      <div className="space-y-6">
                        {trip.itinerary.map((day) => (
                          <div
                            key={day.day}
                            className="border-2 border-indigo-100 rounded-2xl overflow-hidden bg-linear-to-br from-white to-indigo-50/30"
                          >
                            <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
                              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Day {day.day}
                                {day.title && (
                                  <span className="text-white/80">
                                    • {day.title}
                                  </span>
                                )}
                              </h3>
                            </div>
                            <div className="p-6">
                              <ul className="space-y-3">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <span className="text-xs font-bold text-indigo-600">
                                        {idx + 1}
                                      </span>
                                    </div>
                                    <span className="text-gray-800 leading-relaxed">
                                      {activity}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          No Itinerary Yet
                        </h3>
                        <p className="text-gray-600 mb-1">
                          Ready to start your adventure?
                        </p>
                        <p className="text-sm text-gray-500">
                          Click{" "}
                          <span className="font-semibold text-indigo-600">
                            Generate Itinerary
                          </span>{" "}
                          to create your personalized plan
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-pink-500 to-purple-500 rounded-xl">
                      <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Day-wise Maps
                    </h2>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
                    {/* Day Tabs */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {dayNumbers.map((d) => (
                        <button
                          key={d}
                          onClick={() => setSelectedDay(d)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            selectedDay === d
                              ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                              : "border-gray-200 bg-white/70 text-gray-700 hover:border-indigo-300"
                          }`}
                        >
                          Day {d}
                        </button>
                      ))}
                    </div>

                    <MapView
                      locations={selectedDayLocations}
                      height={420}
                      zoom={13}
                      onLocationClick={(loc) => openDirections(loc)}
                    />

                    {/* Day Locations List */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">
                          Stops for Day {selectedDay}
                        </h3>
                        {selectedDayLocations.length > 1 ? (
                          <button
                            onClick={() => {
                              const url =
                                buildDayRouteUrl(selectedDayLocations);
                              if (url)
                                window.open(
                                  url,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                            }}
                            className="text-sm font-bold text-indigo-700 hover:text-indigo-800"
                            title="Open a route covering all stops for the day"
                          >
                            Open day route
                          </button>
                        ) : null}
                      </div>

                      {selectedDayLocations.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                          <p className="text-gray-700 font-semibold">
                            No saved locations for this day.
                          </p>
                          <p className="text-sm text-gray-600">
                            Generate itinerary to populate map points.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedDayLocations.map((loc, idx) => (
                            <div
                              key={`${loc.lat}-${loc.lng}-${idx}`}
                              className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200 bg-white/70 hover:shadow-md transition-all"
                            >
                              <button
                                onClick={() => openDirections(loc)}
                                className="flex-1 text-left"
                                title="Open directions in Google Maps"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-extrabold text-indigo-700">
                                      {idx + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900">
                                      {loc.name || `Stop ${idx + 1}`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Tap to open directions
                                    </div>
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => openDirections(loc)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
                              >
                                <Navigation className="w-4 h-4" />
                                Directions
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
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
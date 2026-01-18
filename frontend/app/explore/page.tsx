"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Compass,
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  Filter,
} from "lucide-react";

type Destination = {
  name: string;
  country: string;
  region: string;
  tags: string[];
  highlight: string;
  color: "indigo" | "blue" | "emerald" | "rose" | "amber";
};

const DESTINATIONS: Destination[] = [
  {
    name: "Patna",
    country: "India",
    region: "Asia",
    tags: ["History & Culture", "Art & Museums", "Food & Dining"],
    highlight: "Ancient Pataliputra heritage and riverfront evenings.",
    color: "indigo",
  },
  {
    name: "Jaipur",
    country: "India",
    region: "Asia",
    tags: ["History & Culture", "Shopping", "Photography"],
    highlight: "Palaces, forts, bazaars, and sunrise viewpoints.",
    color: "rose",
  },
  {
    name: "Goa",
    country: "India",
    region: "Asia",
    tags: ["Beach & Relaxation", "Nightlife", "Food & Dining"],
    highlight: "Beach days, cafés, and sunset rides.",
    color: "amber",
  },
  {
    name: "Kathmandu",
    country: "Nepal",
    region: "Asia",
    tags: ["History & Culture", "Adventure", "Photography"],
    highlight: "Temples, heritage squares, and nearby hikes.",
    color: "emerald",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    region: "Asia",
    tags: ["Food & Dining", "Shopping", "Nightlife"],
    highlight: "Markets, street food, and river cruises.",
    color: "blue",
  },
  {
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    tags: ["Shopping", "Photography", "Food & Dining"],
    highlight: "Skyline views, deserts, and modern attractions.",
    color: "indigo",
  },
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    tags: ["Art & Museums", "Food & Dining", "Photography"],
    highlight: "Museums, café stops, and walkable neighborhoods.",
    color: "rose",
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    tags: ["Food & Dining", "Art & Museums", "Shopping"],
    highlight: "Neighborhood hopping, ramen trails, and day trips.",
    color: "blue",
  },
  {
    name: "New York",
    country: "USA",
    region: "North America",
    tags: ["Art & Museums", "Nightlife", "Food & Dining"],
    highlight: "Iconic sights, shows, and diverse food.",
    color: "emerald",
  },
];

function gradientFor(color: Destination["color"]) {
  switch (color) {
    case "blue":
      return "bg-linear-to-br from-blue-500 to-cyan-500";
    case "emerald":
      return "bg-linear-to-br from-emerald-500 to-teal-500";
    case "rose":
      return "bg-linear-to-br from-rose-500 to-pink-500";
    case "amber":
      return "bg-linear-to-br from-amber-500 to-orange-500";
    case "indigo":
    default:
      return "bg-linear-to-br from-indigo-500 to-purple-600";
  }
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const d of DESTINATIONS) set.add(d.region);
    return ["all", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchesRegion = region === "all" || d.region === region;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-3">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Explore</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
              <p className="text-gray-600">
                Discover places and start planning in one click.
              </p>
            </div>

            <Link
              href="/create-itinerary"
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Plan New Trip
            </Link>
          </div>

          {/* Search / Filters */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search destinations, countries, or interests..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r === "all" ? "All Regions" : r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No matches</h3>
              <p className="text-gray-600">Try a different search or region.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <div
                  key={`${d.name}-${d.country}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className={`h-28 ${gradientFor(d.color)} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-white/85" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{d.country} • {d.region}</p>

                    <p className="text-gray-700 mb-4">{d.highlight}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {d.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/create-itinerary?destination=${encodeURIComponent(d.name)}&interests=${encodeURIComponent(d.tags.join(","))}`}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Plan this trip
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

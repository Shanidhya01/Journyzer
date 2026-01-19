"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import WikiImage from "@/components/WikiImage";
import {
  Compass,
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  Filter,
  Globe,
  Plane,
  Star,
  TrendingUp,
  Heart,
  X,
  ChevronDown,
} from "lucide-react";

type Destination = {
  name: string;
  country: string;
  region: string;
  tags: string[];
  highlight: string;
  color: "indigo" | "blue" | "emerald" | "rose" | "amber" | "purple" | "cyan";
  rating?: number;
  trending?: boolean;
  imageGradient?: string;
};

const DESTINATIONS: Destination[] = [
  {
    name: "Patna",
    country: "India",
    region: "Asia",
    tags: ["History & Culture", "Art & Museums", "Food & Dining"],
    highlight: "Ancient Pataliputra heritage and riverfront evenings.",
    color: "indigo",
    rating: 4.2,
    imageGradient: "from-amber-600 via-orange-500 to-red-500",
  },
  {
    name: "Jaipur",
    country: "India",
    region: "Asia",
    tags: ["History & Culture", "Shopping", "Photography"],
    highlight: "Palaces, forts, bazaars, and sunrise viewpoints.",
    color: "rose",
    rating: 4.7,
    trending: true,
    imageGradient: "from-pink-600 via-rose-500 to-orange-500",
  },
  {
    name: "Goa",
    country: "India",
    region: "Asia",
    tags: ["Beach & Relaxation", "Nightlife", "Food & Dining"],
    highlight: "Beach days, cafés, and sunset rides.",
    color: "amber",
    rating: 4.8,
    trending: true,
    imageGradient: "from-yellow-600 via-amber-500 to-orange-600",
  },
  {
    name: "Kathmandu",
    country: "Nepal",
    region: "Asia",
    tags: ["History & Culture", "Adventure", "Photography"],
    highlight: "Temples, heritage squares, and nearby hikes.",
    color: "emerald",
    rating: 4.5,
    imageGradient: "from-emerald-600 via-green-500 to-teal-500",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    region: "Asia",
    tags: ["Food & Dining", "Shopping", "Nightlife"],
    highlight: "Markets, street food, and river cruises.",
    color: "blue",
    rating: 4.6,
    trending: true,
    imageGradient: "from-blue-600 via-cyan-500 to-teal-500",
  },
  {
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    tags: ["Shopping", "Photography", "Food & Dining"],
    highlight: "Skyline views, deserts, and modern attractions.",
    color: "indigo",
    rating: 4.9,
    imageGradient: "from-indigo-600 via-purple-500 to-pink-500",
  },
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    tags: ["Art & Museums", "Food & Dining", "Photography"],
    highlight: "Museums, café stops, and walkable neighborhoods.",
    color: "rose",
    rating: 4.9,
    trending: true,
    imageGradient: "from-rose-600 via-pink-500 to-purple-500",
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    tags: ["Food & Dining", "Art & Museums", "Shopping"],
    highlight: "Neighborhood hopping, ramen trails, and day trips.",
    color: "purple",
    rating: 4.8,
    imageGradient: "from-purple-600 via-fuchsia-500 to-pink-500",
  },
  {
    name: "New York",
    country: "USA",
    region: "North America",
    tags: ["Art & Museums", "Nightlife", "Food & Dining"],
    highlight: "Iconic sights, shows, and diverse food.",
    color: "cyan",
    rating: 4.7,
    imageGradient: "from-cyan-600 via-blue-500 to-indigo-500",
  },
];

function gradientFor(color: Destination["color"]) {
  switch (color) {
    case "blue":
      return "from-blue-500 to-cyan-500";
    case "emerald":
      return "from-emerald-500 to-teal-500";
    case "rose":
      return "from-rose-500 to-pink-500";
    case "amber":
      return "from-amber-500 to-orange-500";
    case "purple":
      return "from-purple-500 to-fuchsia-500";
    case "cyan":
      return "from-cyan-500 to-blue-500";
    case "indigo":
    default:
      return "from-indigo-500 to-purple-600";
  }
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "trending">(
    "popular",
  );

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const d of DESTINATIONS) set.add(d.region);
    return ["all", ...Array.from(set).sort()];
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const d of DESTINATIONS) {
      for (const t of d.tags) set.add(t);
    }
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let results = DESTINATIONS.filter((d) => {
      const matchesRegion = region === "all" || d.region === region;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => d.tags.includes(tag));
      return matchesRegion && matchesQuery && matchesTags;
    });

    // Sort results
    if (sortBy === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "trending") {
      results.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }

    return results;
  }, [query, region, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl py-12">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg mb-4 border border-indigo-100">
                  <Globe className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Explore World
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 leading-tight">
                  Discover Your Next
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Adventure
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Explore curated destinations and start planning your dream
                  trip in one click.
                </p>
              </div>

              <Link
                href="/create-itinerary"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sparkles className="relative w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative">Plan New Trip</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search destinations, countries, or interests..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-500"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="pl-10 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold bg-white appearance-none cursor-pointer text-gray-900"
                    >
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {r === "all" ? "All Regions" : r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="pl-10 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold bg-white appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="popular">Popular</option>
                      <option value="rating">Top Rated</option>
                      <option value="trending">Trending</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Interest Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-gray-700">
                    Filter by interests:
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
              destination{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-16 text-center border border-white/50">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-3xl opacity-20"></div>
                </div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No destinations found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setRegion("all");
                  setSelectedTags([]);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((d, idx) => (
                <div
                  key={`${d.name}-${d.country}`}
                  className="group bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Card Header with City Image */}
                  <div className="h-48 relative overflow-hidden rounded-t-3xl bg-gray-200">
                    <WikiImage
                      city={d.name}
                      country={d.country}
                      gradient={d.imageGradient || gradientFor(d.color)}
                    />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 -mt-8 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                          {d.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{d.country}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{d.region}</span>
                        </div>
                      </div>
                      {d.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-amber-700">
                            {d.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-5 leading-relaxed">
                      {d.highlight}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {d.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-bold border border-indigo-200"
                        >
                          {t}
                        </span>
                      ))}
                      {d.tags.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-bold">
                          +{d.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/create-itinerary?destination=${encodeURIComponent(d.name)}&interests=${encodeURIComponent(d.tags.join(","))}`}
                      className="group/btn relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <Heart className="relative w-5 h-5 group-hover/btn:fill-white transition-all" />
                      <span className="relative">Plan this trip</span>
                      <ArrowRight className="relative w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
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

"use client";

import { Clock, Users, Cloud } from "lucide-react";

interface CrowdInfoProps {
  crowdInfo: Array<{
    location: string;
    bestTime: string;
    crowdedHours: string;
    crowdLevel: string;
    peakDays: string[];
    weatherSuitability: string;
    tips: string;
  }>;
}

export default function CrowdInfo({ crowdInfo }: CrowdInfoProps) {
  if (!crowdInfo || crowdInfo.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-indigo-600" />
        Crowd & Best Time Information
      </h3>

      <div className="space-y-4">
        {crowdInfo.map((info, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
          >
            <h4 className="font-bold text-lg text-gray-900 mb-3">{info.location}</h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Best Time to Visit</p>
                  <p className="text-sm text-gray-600">{info.bestTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Crowded Hours</p>
                  <p className="text-sm text-gray-600">{info.crowdedHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Weather Suitability</p>
                  <p className="text-sm text-gray-600">{info.weatherSuitability}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">{info.crowdLevel.includes("🟢") ? "🟢" : info.crowdLevel.includes("🔴") ? "🔴" : "🟡"}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Crowd Level</p>
                  <p className="text-sm text-gray-600">{info.crowdLevel}</p>
                </div>
              </div>
            </div>

            {info.tips && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-900">
                  <span className="font-semibold">💡 Tip:</span> {info.tips}
                </p>
              </div>
            )}

            {info.peakDays && info.peakDays.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Peak Days:</span> {info.peakDays.join(", ")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

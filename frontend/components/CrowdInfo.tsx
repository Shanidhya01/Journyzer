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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-600" />
        Crowd & Best Time
      </h3>

      <div className="space-y-3">
        {crowdInfo.map((info, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="font-bold text-base text-gray-900">{info.location}</h4>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">{info.bestTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                <div>
                  <p className="font-semibold text-gray-700">Crowded</p>
                  <p className="text-gray-600">{info.crowdedHours}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-700">Weather</p>
                  <p className="text-gray-600">{info.weatherSuitability}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.crowdLevel.includes("🟢") ? "🟢" : info.crowdLevel.includes("🔴") ? "🔴" : "🟡"}</span>
                <span className="text-xs font-semibold text-gray-700">{info.crowdLevel}</span>
              </div>
              
              {info.peakDays && info.peakDays.length > 0 && (
                <span className="text-xs text-gray-500">
                  Peak: {info.peakDays.slice(0, 2).join(", ")}
                </span>
              )}
            </div>

            {info.tips && (
              <div className="mt-3 p-2 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-900">
                  <span className="font-semibold">💡</span> {info.tips}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

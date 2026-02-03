"use client";

import { Bus, Car, Footprints, DollarSign, Clock } from "lucide-react";

interface TransportInfoProps {
  transportInfo: {
    totalDistance: string;
    totalCost: string;
    totalTime: number;
    mode: string;
    details?: Array<{
      from: string;
      to: string;
      distance: string;
      time: number;
      cost: string;
    }>;
    recommendation?: {
      suggestion: string;
      reason: string;
    };
  };
  currentMode?: string;
}

export default function TransportInfo({ transportInfo, currentMode }: TransportInfoProps) {
  if (!transportInfo) return null;

  const getModeIcon = (mode: string) => {
    const lowerMode = mode.toLowerCase();
    if (lowerMode.includes("public")) return <Bus className="w-6 h-6" />;
    if (lowerMode.includes("cab") || lowerMode.includes("taxi")) return <Car className="w-6 h-6" />;
    if (lowerMode.includes("walk")) return <Footprints className="w-6 h-6" />;
    return <Bus className="w-6 h-6" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        {getModeIcon(transportInfo.mode)}
        Transport Information
      </h3>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <p className="text-sm text-gray-600 mb-1">Total Distance</p>
          <p className="text-2xl font-bold text-indigo-600">{transportInfo.totalDistance} km</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <p className="text-sm text-gray-600">Total Cost</p>
          </div>
          <p className="text-2xl font-bold text-green-600">${transportInfo.totalCost}</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <p className="text-sm text-gray-600">Total Time</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{Math.floor(transportInfo.totalTime / 60)}h {transportInfo.totalTime % 60}m</p>
        </div>
      </div>

      {/* Mode */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-1">Transport Mode</p>
        <p className="text-lg font-bold text-gray-900">{transportInfo.mode}</p>
      </div>

      {/* Recommendation */}
      {transportInfo.recommendation && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-1">💡 Recommendation</p>
          <p className="text-sm text-blue-800">
            Consider using <span className="font-bold">{transportInfo.recommendation.suggestion}</span>: {transportInfo.recommendation.reason}
          </p>
        </div>
      )}

      {/* Detailed breakdown */}
      {transportInfo.details && transportInfo.details.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Route Details</h4>
          <div className="space-y-3">
            {transportInfo.details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {detail.from} → {detail.to}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">{detail.distance} km</span>
                  <span className="text-gray-600">{detail.time} min</span>
                  <span className="font-semibold text-green-600">${detail.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

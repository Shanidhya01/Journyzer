"use client";

import { Phone, MapPin, AlertCircle, Info } from "lucide-react";

interface EmergencyInfoProps {
  emergencyInfo: {
    destination: string;
    country: string;
    police: string;
    ambulance: string;
    fire: string;
    touristHelpline: string;
    safeZones: string[];
    localCustoms: string[];
    usefulPhrases?: string[];
  };
}

export default function EmergencyInfo({ emergencyInfo }: EmergencyInfoProps) {
  if (!emergencyInfo) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-red-600" />
        Emergency & Safety Information
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Destination: <span className="font-semibold text-gray-900">{emergencyInfo.destination}</span>
        </p>
        <p className="text-sm text-gray-600">
          Country: <span className="font-semibold text-gray-900">{emergencyInfo.country}</span>
        </p>
      </div>

      {/* Emergency Numbers */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-600" />
          Emergency Numbers
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xs text-gray-600 mb-1">Police</p>
            <p className="text-xl font-bold text-red-600">{emergencyInfo.police}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Ambulance</p>
            <p className="text-xl font-bold text-orange-600">{emergencyInfo.ambulance}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-xs text-gray-600 mb-1">Fire</p>
            <p className="text-xl font-bold text-yellow-600">{emergencyInfo.fire}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Tourist Helpline</p>
            <p className="text-xl font-bold text-blue-600">{emergencyInfo.touristHelpline}</p>
          </div>
        </div>
      </div>

      {/* Safe Zones */}
      {emergencyInfo.safeZones && emergencyInfo.safeZones.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Safe Zones
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {emergencyInfo.safeZones.map((zone, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-gray-700">{zone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Customs */}
      {emergencyInfo.localCustoms && emergencyInfo.localCustoms.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            Local Customs & Tips
          </h4>
          <div className="space-y-2">
            {emergencyInfo.localCustoms.map((custom, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span className="text-sm text-gray-700">{custom}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Useful Phrases */}
      {emergencyInfo.usefulPhrases && emergencyInfo.usefulPhrases.length > 0 && (
        <div>
          <h4 className="font-bold text-lg text-gray-900 mb-3">📢 Useful Emergency Phrases</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {emergencyInfo.usefulPhrases.map((phrase, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-purple-900">{phrase}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
        <p className="text-sm text-yellow-900">
          <span className="font-semibold">⚠️ Important:</span> Save these numbers in your phone before you travel. 
          Keep copies of important documents and share your itinerary with family/friends.
        </p>
      </div>
    </div>
  );
}

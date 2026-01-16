"use client";

import { useState } from "react";
import { Sun, Utensils, Moon, Save, MapPin, Check } from "lucide-react";

type ItineraryDay = {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
};

export default function ItineraryCard({
  itinerary,
  onSave,
}: {
  itinerary: ItineraryDay[];
  onSave?: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (onSave) {
      await onSave();
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const timeSlots = [
    { key: 'morning', label: 'Morning', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
    { key: 'afternoon', label: 'Afternoon', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
    { key: 'evening', label: 'Evening', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <div
          key={day.day}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Day Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Day {day.day}
              </h3>
            </div>
          </div>

          {/* Day Content */}
          <div className="p-6 space-y-4">
            {timeSlots.map((slot) => {
              const Icon = slot.icon;
              return (
                <div key={slot.key} className="flex gap-4">
                  <div className={`${slot.bg} p-3 rounded-xl flex-shrink-0 h-fit`}>
                    <Icon className={`w-5 h-5 ${slot.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{slot.label}</h4>
                    <p className="text-gray-700 leading-relaxed">{day[slot.key]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {onSave && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved Successfully!
              </>
            ) : saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Itinerary
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
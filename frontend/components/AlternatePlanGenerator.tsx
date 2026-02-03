"use client";

import { useState } from "react";
import { RefreshCw, Cloud, Battery, DollarSign, Loader2 } from "lucide-react";

interface AlternatePlanGeneratorProps {
  tripId: string;
  onGenerate: (scenario: string) => Promise<void>;
}

export default function AlternatePlanGenerator({ tripId, onGenerate }: AlternatePlanGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = [
    {
      id: "weather",
      label: "Bad Weather",
      icon: Cloud,
      description: "Indoor alternatives for rainy days",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "tired",
      label: "Feeling Tired",
      icon: Battery,
      description: "More relaxed pace with rest time",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "budget",
      label: "Budget Reduced",
      icon: DollarSign,
      description: "Free and budget-friendly options",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "indoor",
      label: "Extreme Weather",
      icon: Cloud,
      description: "All indoor activities",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const handleGenerate = async (scenario: string) => {
    setLoading(true);
    setSelectedScenario(scenario);
    try {
      await onGenerate(scenario);
    } finally {
      setLoading(false);
      setSelectedScenario(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <RefreshCw className="w-6 h-6 text-indigo-600" />
        Generate Alternate Plan
      </h3>
      <p className="text-gray-600 mb-6">
        Need a backup plan? Generate alternate itineraries for different scenarios.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isGenerating = loading && selectedScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => handleGenerate(scenario.id)}
              disabled={loading}
              className={`relative p-6 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all text-left group overflow-hidden ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${scenario.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />

              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${scenario.color} mb-3`}>
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </div>

                <h4 className="font-bold text-lg text-gray-900 mb-2">{scenario.label}</h4>
                <p className="text-sm text-gray-600">{scenario.description}</p>

                {isGenerating && (
                  <p className="text-sm text-indigo-600 font-semibold mt-3">Generating...</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-900">
          <span className="font-semibold">💡 Tip:</span> Alternate plans are saved with your trip so you can switch between them anytime!
        </p>
      </div>
    </div>
  );
}

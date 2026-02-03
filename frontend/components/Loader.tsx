import React, { useState, useEffect } from 'react';
import {
  Plane,
  MapPin,
  Calendar,
  Compass,
  Globe,
  Sparkles,
  Map,
  Camera,
  Coffee,
  Mountain,
  Palmtree,
  type LucideIcon,
} from 'lucide-react';

export default function TripPlannerLoading() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Compass, text: "Analyzing your preferences", color: "from-blue-500 to-cyan-500" },
    { icon: Globe, text: "Exploring destinations", color: "from-purple-500 to-pink-500" },
    { icon: Map, text: "Mapping your journey", color: "from-emerald-500 to-teal-500" },
    { icon: Calendar, text: "Planning your itinerary", color: "from-orange-500 to-red-500" },
    { icon: Sparkles, text: "Adding magic touches", color: "from-indigo-500 to-purple-500" },
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const seeded01 = (seed: number) => {
    // Deterministic pseudo-random in [0,1). Must be stable across server/client renders.
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const FloatingIcon = ({
    Icon,
    delay,
    seed,
    size = "w-8 h-8",
    color = "text-indigo-400",
  }: {
    Icon: LucideIcon;
    delay: number;
    seed: number;
    size?: string;
    color?: string;
  }) => (
    <div 
      className={`absolute ${color} opacity-30 animate-float`}
      style={{ 
        animationDelay: `${delay}s`,
        left: `${seeded01(seed) * 80 + 10}%`,
        top: `${seeded01(seed + 42) * 60 + 20}%`
      }}
    >
      <Icon className={size} />
    </div>
  );

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <FloatingIcon Icon={Plane} delay={0} seed={1} color="text-blue-400" />
      <FloatingIcon Icon={MapPin} delay={0.5} seed={2} color="text-pink-400" />
      <FloatingIcon Icon={Camera} delay={1} seed={3} color="text-purple-400" />
      <FloatingIcon Icon={Coffee} delay={1.5} seed={4} color="text-amber-400" />
      <FloatingIcon Icon={Mountain} delay={2} seed={5} color="text-emerald-400" />
      <FloatingIcon Icon={Palmtree} delay={2.5} seed={6} color="text-green-400" />
      <FloatingIcon Icon={Globe} delay={3} seed={7} size="w-12 h-12" color="text-indigo-400" />

      {/* Main Loading Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50">
          {/* Animated Plane */}
          <div className="relative h-32 mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Plane Trail */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1">
                  <div className="h-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-pulse"></div>
                </div>
                
                {/* Animated Plane */}
                <div className="relative animate-fly">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-2xl">
                    <Plane className="w-12 h-12 text-white transform rotate-45" />
                  </div>
                </div>

                {/* Sparkles around plane */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-ping" />
                <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-pink-400 animate-ping animation-delay-500" />
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 animate-fadeIn">
              <div className={`p-4 bg-gradient-to-br ${steps[currentStep].color} rounded-2xl shadow-lg`}>
                <CurrentStepIcon className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 animate-fadeIn">
              Creating Your Dream Trip
            </h2>
            <p className="text-lg text-gray-600 font-semibold animate-fadeIn">
              {steps[currentStep].text}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm font-bold text-gray-600">{progress}%</span>
              <span className="text-sm font-bold text-indigo-600">Almost there!</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentStep
                    ? 'w-12 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full'
                    : index < currentStep
                    ? 'w-3 h-3 bg-green-500 rounded-full'
                    : 'w-3 h-3 bg-gray-300 rounded-full'
                }`}
              />
            ))}
          </div>

          {/* Fun Messages */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border-2 border-indigo-200 px-6 py-3 rounded-full">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
              <p className="text-sm font-bold text-indigo-700">
                Crafting the perfect adventure just for you...
              </p>
            </div>
          </div>

          {/* Pulsing Dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.6;
          }
        }
        @keyframes fly {
          0%, 100% { 
            transform: translateX(-10px) translateY(0);
          }
          50% { 
            transform: translateX(10px) translateY(-5px);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fly {
          animation: fly 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
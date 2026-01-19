"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";

type MapLocation = { lat: number; lng: number; name?: string };

type Props = {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
  height?: number | string;
  zoom?: number;
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

export default function MapView({ locations, onLocationClick, height = 500, zoom = 12 }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Map unavailable</h3>
        <p className="text-amber-800">
          Missing <span className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_KEY</span> in the frontend environment.
        </p>
      </div>
    );
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load map</h3>
        <p className="text-red-700">
          Google Maps failed to load. Common causes: invalid/locked API key, missing billing,
          or the <span className="font-mono">Maps JavaScript API</span> not enabled for this key.
        </p>
        <p className="text-xs text-red-600 mt-3 break-words">
          {String((loadError as any)?.message || loadError)}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading interactive map...</p>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations to display</h3>
        <p className="text-gray-600">Add locations to see them on the map.</p>
      </div>
    );
  }

  const center = locations[0];

  const mapContainerStyle = {
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: '1rem'
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">
            {locations.length} {locations.length === 1 ? 'Location' : 'Locations'}
          </h3>
        </div>
        <div className="flex gap-2">
          {locations.slice(0, 3).map((loc, i) => (
            <div key={i} className="w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          ))}
          {locations.length > 3 && (
            <span className="text-sm text-gray-600">+{locations.length - 3}</span>
          )}
        </div>
      </div>
      
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={mapContainerStyle}
        options={defaultMapOptions}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            label={{
              text: `${index + 1}`,
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            title={location.name || `Location ${index + 1}`}
            onClick={() => onLocationClick?.(location)}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
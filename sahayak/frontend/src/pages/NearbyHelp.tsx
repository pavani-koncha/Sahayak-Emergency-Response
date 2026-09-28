import React from 'react';
import { MapPin, Navigation, Info, ShieldAlert, Heart, Building2 } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

const NearbyHelp: React.FC = () => {
  const { location, error, loading } = useGeolocation();

  const getGoogleMapsLink = (query: string) => {
    if (location) {
      return `https://www.google.com/maps/search/${query}/@${location.latitude},${location.longitude},14z`;
    }
    return `https://www.google.com/maps/search/${query}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <MapPin className="text-gray-700" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Nearby Help</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start space-x-3">
        <Info size={24} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Select a category below to find the nearest emergency services using Google Maps. 
          For immediate life-threatening emergencies, always call 112 first.
        </p>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Determining your location...</div>
      )}
      
      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
          Warning: {error}. General search results will be provided instead of nearby locations.
        </div>
      )}

      <div className="space-y-4 pt-2">
        <a 
          href={getGoogleMapsLink('hospital')} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-red-200 transition group"
        >
          <div className="bg-red-100 p-3 rounded-full text-danger mr-4">
            <Heart size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-danger transition">Hospitals & Clinics</h3>
            <p className="text-sm text-gray-500">Find nearest medical facilities and emergency rooms</p>
          </div>
          <Navigation size={20} className="text-gray-400 group-hover:text-danger transition" />
        </a>

        <a 
          href={getGoogleMapsLink('police+station')} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition group"
        >
          <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
            <ShieldAlert size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">Police Stations</h3>
            <p className="text-sm text-gray-500">Find nearest law enforcement agencies</p>
          </div>
          <Navigation size={20} className="text-gray-400 group-hover:text-blue-600 transition" />
        </a>

        <a 
          href={getGoogleMapsLink('fire+station')} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition group"
        >
          <div className="bg-orange-100 p-3 rounded-full text-orange-600 mr-4">
            <Building2 size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition">Fire Stations</h3>
            <p className="text-sm text-gray-500">Find nearest fire and rescue departments</p>
          </div>
          <Navigation size={20} className="text-gray-400 group-hover:text-orange-600 transition" />
        </a>
      </div>
    </div>
  );
};

export default NearbyHelp;

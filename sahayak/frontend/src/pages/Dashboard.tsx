import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Share2, Users, ShieldPlus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import api from '../services/api';
import { EmergencyAlert, EmergencyContact } from '../types';

const Dashboard: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { location, error: locationError, refreshLocation } = useGeolocation(!!activeAlert);

  useEffect(() => {
    fetchActiveAlert();
    fetchContacts();
  }, []);

  const fetchActiveAlert = async () => {
    try {
      const response = await api.get('/emergency/history');
      const alerts = response.data;
      if (alerts.length > 0 && alerts[0].status === 'ACTIVE') {
        setActiveAlert(alerts[0]);
      } else {
        setActiveAlert(null);
      }
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const handleActivateSOS = async () => {
    setLoading(true);
    try {
      const response = await api.post('/emergency/activate', {
        latitude: location?.latitude,
        longitude: location?.longitude,
        accuracy: location?.accuracy
      });
      setActiveAlert(response.data);
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to activate SOS", err);
      alert("Failed to activate emergency alert. Please call 112 directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAlert = async (status: 'CANCELLED' | 'RESOLVED') => {
    if (!activeAlert) return;
    setLoading(true);
    try {
      await api.post(`/emergency/${activeAlert.id}/${status.toLowerCase()}`);
      setActiveAlert(null);
    } catch (err) {
      console.error(`Failed to ${status} alert`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = async () => {
    if (!location) {
      alert("Location not available. Please wait or refresh.");
      return;
    }
    const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const text = `EMERGENCY! I need help. My location is: ${mapUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Location',
          text: text,
          url: mapUrl,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Location link copied to clipboard!");
    }
  };

  if (activeAlert) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="bg-red-100 border-2 border-red-500 rounded-xl p-6 w-full max-w-md text-center shadow-lg animate-pulse">
          <AlertTriangle size={64} className="text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-danger mb-2">EMERGENCY ALERT ACTIVE</h2>
          <p className="text-red-800 font-medium">Your emergency alert has been activated.</p>
          <div className="mt-4 text-sm text-red-700 bg-red-200 p-3 rounded text-left">
            <p><strong>Status:</strong> ACTIVE</p>
            <p><strong>Time:</strong> {new Date(activeAlert.created_at).toLocaleTimeString()}</p>
            {location ? (
              <>
                <p><strong>Lat:</strong> {location.latitude.toFixed(6)}</p>
                <p><strong>Lng:</strong> {location.longitude.toFixed(6)}</p>
                <p><strong>Acc:</strong> ±{Math.round(location.accuracy)}m</p>
              </>
            ) : (
              <p>Acquiring location...</p>
            )}
          </div>
        </div>

        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          <a href="tel:112" className="bg-gray-900 text-white p-4 rounded-lg flex flex-col items-center justify-center shadow hover:bg-gray-800 transition">
            <Phone size={32} className="mb-2" />
            <span className="font-bold">CALL 112</span>
          </a>
          
          <button onClick={handleShareLocation} className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center justify-center shadow hover:bg-blue-700 transition">
            <Share2 size={32} className="mb-2" />
            <span className="font-bold">SHARE</span>
          </button>

          <Link to="/contacts" className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center justify-center shadow hover:bg-green-700 transition">
            <Users size={32} className="mb-2" />
            <span className="font-bold">FAMILY</span>
          </Link>
          
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to resolve this emergency?')) {
                handleCancelAlert('RESOLVED');
              }
            }} 
            disabled={loading}
            className="bg-gray-500 text-white p-4 rounded-lg flex flex-col items-center justify-center shadow hover:bg-gray-600 transition disabled:opacity-50"
          >
            <CheckCircle size={32} className="mb-2" />
            <span className="font-bold">RESOLVE</span>
          </button>
        </div>
        
        <button 
          onClick={() => {
            if(window.confirm('Are you sure you want to cancel this emergency?')) {
              handleCancelAlert('CANCELLED');
            }
          }} 
          disabled={loading}
          className="w-full max-w-md bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
        >
          CANCEL ALERT
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      
      {/* Location Status */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow border border-gray-100 flex items-start space-x-3">
        <MapPin className={location ? "text-green-500 mt-1" : "text-gray-400 mt-1"} size={24} />
        <div className="flex-1">
          <h3 className="font-medium">Current Location</h3>
          {locationError ? (
            <p className="text-xs text-red-500 mt-1">{locationError}</p>
          ) : location ? (
            <div className="text-xs text-gray-500 mt-1">
              <p>Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}</p>
              <p>Accuracy: ±{Math.round(location.accuracy)} meters</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Getting location...</p>
          )}
        </div>
        <button 
          onClick={refreshLocation}
          className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition"
        >
          Refresh
        </button>
      </div>

      {/* SOS Button Area */}
      <div className="w-full max-w-md flex flex-col items-center py-8">
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            className="w-64 h-64 bg-danger rounded-full shadow-[0_0_40px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center text-white transform transition hover:scale-105 active:scale-95 sos-button-pulse"
          >
            <ShieldPlus size={80} strokeWidth={1.5} className="mb-2" />
            <span className="text-4xl font-black tracking-widest">SOS</span>
            <span className="text-sm font-medium mt-2 opacity-90 uppercase tracking-widest">Press for Help</span>
          </button>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-xl border border-red-100 text-center w-full">
            <AlertTriangle size={48} className="text-danger mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Activate Emergency?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              This will create an emergency alert and record your location.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                CANCEL
              </button>
              <button 
                onClick={handleActivateSOS}
                disabled={loading}
                className="py-3 px-4 bg-danger text-white font-bold rounded-lg hover:bg-danger-hover transition shadow-lg disabled:opacity-50"
              >
                {loading ? '...' : 'ACTIVATE SOS'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        <a href="tel:112" className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col items-center text-center hover:bg-gray-50 transition">
          <div className="bg-red-100 p-3 rounded-full mb-3 text-danger">
            <Phone size={24} />
          </div>
          <span className="font-bold text-gray-800">Call 112</span>
          <span className="text-xs text-gray-500 mt-1">Emergency Services</span>
        </a>
        
        <button onClick={handleShareLocation} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col items-center text-center hover:bg-gray-50 transition">
          <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
            <Share2 size={24} />
          </div>
          <span className="font-bold text-gray-800">Share</span>
          <span className="text-xs text-gray-500 mt-1">Current Location</span>
        </button>
        
        <Link to="/contacts" className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col items-center text-center hover:bg-gray-50 transition">
          <div className="bg-green-100 p-3 rounded-full mb-3 text-green-600">
            <Users size={24} />
          </div>
          <span className="font-bold text-gray-800">Contacts</span>
          <span className="text-xs text-gray-500 mt-1">{contacts.length} Trusted</span>
        </Link>
        
        <Link to="/nearby" className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col items-center text-center hover:bg-gray-50 transition">
          <div className="bg-purple-100 p-3 rounded-full mb-3 text-purple-600">
            <MapPin size={24} />
          </div>
          <span className="font-bold text-gray-800">Nearby Help</span>
          <span className="text-xs text-gray-500 mt-1">Hospitals, Police</span>
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;

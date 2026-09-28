import React, { useState, useEffect } from 'react';
import { History, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { EmergencyAlert } from '../types';

const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/emergency/history');
      setAlerts(response.data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-red-100 text-danger border-red-200';
      case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <History className="text-gray-700" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Alert History</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading history...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200 text-center">
          <History size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Alert History</h3>
          <p className="text-gray-500 text-sm">You haven't activated any emergency alerts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${alert.status === 'ACTIVE' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <AlertTriangle size={20} className={alert.status === 'ACTIVE' ? 'text-danger' : 'text-gray-600'} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">SOS Alert</h4>
                    <p className="text-xs text-gray-500">ID: #{alert.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(alert.status)}`}>
                  {alert.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(alert.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>{formatTime(alert.created_at)}</span>
                </div>
                
                {alert.latitude && alert.longitude && (
                  <div className="col-span-2 flex items-start space-x-2 pt-2 border-t border-gray-200">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-gray-800">Recorded Location</span>
                      <span className="text-xs text-gray-500">
                        {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertHistory;

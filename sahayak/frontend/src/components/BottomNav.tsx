import React from 'react';
import { Home, Users, MapPin, Phone, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-danger" : "text-gray-500 hover:text-gray-900";
  };

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 px-2 pb-safe">
      <div className="flex justify-between items-center py-2 h-16">
        <Link to="/" className={`flex flex-col items-center justify-center w-full ${isActive('/')}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link to="/contacts" className={`flex flex-col items-center justify-center w-full ${isActive('/contacts')}`}>
          <Users size={20} />
          <span className="text-[10px] mt-1">Contacts</span>
        </Link>
        <Link to="/nearby" className={`flex flex-col items-center justify-center w-full ${isActive('/nearby')}`}>
          <MapPin size={20} />
          <span className="text-[10px] mt-1">Nearby</span>
        </Link>
        <Link to="/services" className={`flex flex-col items-center justify-center w-full ${isActive('/services')}`}>
          <Phone size={20} />
          <span className="text-[10px] mt-1">Services</span>
        </Link>
        <Link to="/safety" className={`flex flex-col items-center justify-center w-full ${isActive('/safety')}`}>
          <ShieldAlert size={20} />
          <span className="text-[10px] mt-1">Safety</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

import React from 'react';
import { Phone, ShieldAlert, Heart, Siren } from 'lucide-react';

const EmergencyServices: React.FC = () => {
  const services = [
    {
      name: "National Emergency Number",
      number: "112",
      description: "Single emergency number for Police, Fire, and Ambulance",
      icon: <ShieldAlert size={32} />,
      color: "bg-red-100 text-danger border-red-200",
      buttonColor: "bg-danger hover:bg-danger-hover text-white"
    },
    {
      name: "Police",
      number: "100",
      description: "Direct line for police assistance",
      icon: <Siren size={32} />,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      name: "Ambulance",
      number: "102",
      description: "Medical emergencies and ambulance dispatch",
      icon: <Heart size={32} />,
      color: "bg-green-100 text-green-700 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700 text-white"
    },
    {
      name: "Fire",
      number: "101",
      description: "Fire emergencies and rescue operations",
      icon: <ShieldAlert size={32} />,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      buttonColor: "bg-orange-500 hover:bg-orange-600 text-white"
    },
    {
      name: "Women Helpline",
      number: "1091",
      description: "Assistance for women in distress",
      icon: <Phone size={32} />,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Phone className="text-gray-700" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Emergency Services</h2>
      </div>
      
      <p className="text-gray-600">
        Tap on any service to call immediately. These are verified numbers for emergency assistance in India.
      </p>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
            <div className={`p-6 flex items-center justify-center sm:w-32 ${service.color}`}>
              {service.icon}
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{service.description}</p>
              
              <a 
                href={`tel:${service.number}`}
                className={`w-full py-3 px-4 rounded-lg font-bold text-center flex justify-center items-center space-x-2 transition ${service.buttonColor}`}
              >
                <Phone size={18} />
                <span>CALL {service.number}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyServices;

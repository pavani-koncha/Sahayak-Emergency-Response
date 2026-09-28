import React from 'react';
import { ShieldAlert, AlertCircle, Heart, Siren, Flame } from 'lucide-react';

const SafetyCenter: React.FC = () => {
  const guidelines = [
    {
      id: "personal",
      title: "Personal Safety",
      icon: <ShieldAlert size={24} className="text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      tips: [
        "Trust your instincts. If a situation feels wrong, leave immediately.",
        "Share your live location with a trusted contact when traveling alone.",
        "Stay in well-lit, populated areas.",
        "Keep your phone charged and easily accessible."
      ]
    },
    {
      id: "medical",
      title: "Medical Emergency",
      icon: <Heart size={24} className="text-danger" />,
      color: "bg-red-50 border-red-200",
      tips: [
        "Call 112 or 102 immediately.",
        "Do not move an injured person unless they are in immediate danger.",
        "If someone is unresponsive and not breathing, start CPR if trained.",
        "Apply firm pressure to severe bleeding with a clean cloth."
      ]
    },
    {
      id: "accident",
      title: "Road Accident",
      icon: <Siren size={24} className="text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      tips: [
        "Move to a safe area if possible to avoid further injury.",
        "Call 112 for police and ambulance.",
        "Turn on vehicle hazard lights.",
        "Do not attempt to remove a helmet from an injured motorcyclist."
      ]
    },
    {
      id: "fire",
      title: "Fire Emergency",
      icon: <Flame size={24} className="text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
      tips: [
        "Evacuate immediately. Do not stop to collect belongings.",
        "Call 101 or 112 once you are safely outside.",
        "Stay low to the ground where the air is clearer.",
        "Never use elevators during a fire; use stairs instead."
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <ShieldAlert className="text-gray-700" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Safety Center</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-3">
        <AlertCircle size={24} className="text-danger flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-gray-900">Important Disclaimer</h3>
          <p className="text-sm text-gray-600 mt-1">
            This information is for general guidance only and does not replace professional emergency services. 
            In any emergency, your first action should always be to contact the appropriate authorities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidelines.map((guide) => (
          <div key={guide.id} className={`p-5 rounded-xl border ${guide.color}`}>
            <div className="flex items-center space-x-2 mb-3">
              {guide.icon}
              <h3 className="font-bold text-gray-900">{guide.title}</h3>
            </div>
            <ul className="space-y-2">
              {guide.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="mt-1.5 mr-2 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyCenter;

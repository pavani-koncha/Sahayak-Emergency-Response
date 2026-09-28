export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  blood_group?: string;
  medical_info?: string;
  address?: string;
  created_at: string;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
}

export interface EmergencyAlert {
  id: number;
  alert_type: string;
  status: 'ACTIVE' | 'CANCELLED' | 'RESOLVED';
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  created_at: string;
  resolved_at?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

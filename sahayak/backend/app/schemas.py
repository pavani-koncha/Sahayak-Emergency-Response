from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    blood_group: Optional[str] = None
    medical_info: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    medical_info: Optional[str] = None
    address: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    relationship: str
    is_primary: Optional[bool] = False

class EmergencyContactResponse(EmergencyContactCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    accuracy: float

class LocationResponse(LocationCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class EmergencyAlertCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    accuracy: Optional[float] = None

class EmergencyAlertResponse(BaseModel):
    id: int
    alert_type: str
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    accuracy: Optional[float] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

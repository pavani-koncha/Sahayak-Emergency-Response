from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models, schemas, auth

router = APIRouter(prefix="/api/location", tags=["Location"])

@router.post("/", response_model=schemas.LocationResponse)
def update_location(
    location: schemas.LocationCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    new_location = models.Location(
        user_id=current_user.id,
        latitude=location.latitude,
        longitude=location.longitude,
        accuracy=location.accuracy
    )
    db.add(new_location)
    
    # Also update any active emergency alert with the latest location
    active_alert = db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.user_id == current_user.id,
        models.EmergencyAlert.status == "ACTIVE"
    ).first()
    
    if active_alert:
        active_alert.latitude = location.latitude
        active_alert.longitude = location.longitude
        active_alert.accuracy = location.accuracy
        
    db.commit()
    db.refresh(new_location)
    return new_location

@router.get("/latest", response_model=schemas.LocationResponse)
def get_latest_location(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    latest_location = db.query(models.Location).filter(
        models.Location.user_id == current_user.id
    ).order_by(models.Location.timestamp.desc()).first()
    
    if not latest_location:
        raise HTTPException(status_code=404, detail="No location data found")
        
    return latest_location

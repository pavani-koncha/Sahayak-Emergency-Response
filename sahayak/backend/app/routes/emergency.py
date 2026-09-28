from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import database, models, schemas, auth

router = APIRouter(prefix="/api/emergency", tags=["Emergency"])

@router.post("/activate", response_model=schemas.EmergencyAlertResponse)
def activate_emergency(
    alert: schemas.EmergencyAlertCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # Cancel any currently active alerts
    db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.user_id == current_user.id,
        models.EmergencyAlert.status == "ACTIVE"
    ).update({"status": "CANCELLED", "resolved_at": datetime.utcnow()})
    
    new_alert = models.EmergencyAlert(
        user_id=current_user.id,
        latitude=alert.latitude,
        longitude=alert.longitude,
        accuracy=alert.accuracy,
        status="ACTIVE",
        alert_type="SOS"
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

@router.post("/{id}/cancel", response_model=schemas.EmergencyAlertResponse)
def cancel_emergency(
    id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    alert = db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.id == id,
        models.EmergencyAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if alert.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Alert is not active")
        
    alert.status = "CANCELLED"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/{id}/resolve", response_model=schemas.EmergencyAlertResponse)
def resolve_emergency(
    id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    alert = db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.id == id,
        models.EmergencyAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if alert.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Alert is not active")
        
    alert.status = "RESOLVED"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert

@router.get("/history", response_model=List[schemas.EmergencyAlertResponse])
def get_alert_history(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    alerts = db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.user_id == current_user.id
    ).order_by(models.EmergencyAlert.created_at.desc()).all()
    return alerts

@router.get("/{id}", response_model=schemas.EmergencyAlertResponse)
def get_alert(
    id: int,
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    alert = db.query(models.EmergencyAlert).filter(
        models.EmergencyAlert.id == id,
        models.EmergencyAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    return alert

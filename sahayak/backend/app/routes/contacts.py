from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])

@router.get("/", response_model=List[schemas.EmergencyContactResponse])
def get_contacts(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    contacts = db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()
    return contacts

@router.post("/", response_model=schemas.EmergencyContactResponse)
def create_contact(
    contact: schemas.EmergencyContactCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if contact.is_primary:
        # Reset other primary contacts
        db.query(models.EmergencyContact).filter(
            models.EmergencyContact.user_id == current_user.id,
            models.EmergencyContact.is_primary == True
        ).update({"is_primary": False})
        
    new_contact = models.EmergencyContact(**contact.model_dump(), user_id=current_user.id)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.put("/{id}", response_model=schemas.EmergencyContactResponse)
def update_contact(
    id: int, 
    contact_update: schemas.EmergencyContactCreate,
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    contact = db.query(models.EmergencyContact).filter(
        models.EmergencyContact.id == id,
        models.EmergencyContact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    if contact_update.is_primary and not contact.is_primary:
        db.query(models.EmergencyContact).filter(
            models.EmergencyContact.user_id == current_user.id,
            models.EmergencyContact.is_primary == True
        ).update({"is_primary": False})
        
    update_data = contact_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(contact, key, value)
        
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{id}")
def delete_contact(
    id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    contact = db.query(models.EmergencyContact).filter(
        models.EmergencyContact.id == id,
        models.EmergencyContact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}

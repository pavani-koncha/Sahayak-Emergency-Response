import React, { useState, useEffect } from 'react';
import { UserPlus, Phone, Edit2, Trash2, Star, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { EmergencyContact } from '../types';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    is_primary: false
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/contacts/${editingId}`, formData);
      } else {
        await api.post('/contacts', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', phone: '', relationship: '', is_primary: false });
      fetchContacts();
    } catch (err) {
      console.error("Failed to save contact", err);
      alert("Failed to save contact.");
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      is_primary: contact.is_primary
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        console.error("Failed to delete contact", err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
        {!showForm && (
          <button 
            onClick={() => {
              setFormData({ name: '', phone: '', relationship: '', is_primary: false });
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <UserPlus size={18} />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Contact' : 'Add New Contact'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-danger focus:ring-danger sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                type="tel" name="phone" required value={formData.phone} onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-danger focus:ring-danger sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              <select 
                name="relationship" required value={formData.relationship} onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-danger focus:ring-danger sm:text-sm p-2 border"
              >
                <option value="">Select relationship</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Spouse">Spouse</option>
                <option value="Friend">Friend</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" name="is_primary" id="is_primary" checked={formData.is_primary} onChange={handleFormChange}
                className="h-4 w-4 text-danger focus:ring-danger border-gray-300 rounded"
              />
              <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-900">
                Set as Primary Contact
              </label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button 
                type="button" onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-200 text-center">
          <ShieldAlert size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Yet</h3>
          <p className="text-gray-500 mb-4 text-sm">Add trusted people who should be notified in case of an emergency.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <div key={contact.id} className={`bg-white p-4 rounded-xl shadow-sm border ${contact.is_primary ? 'border-danger bg-red-50/10' : 'border-gray-200'} flex items-center justify-between`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900">{contact.name}</h4>
                  {contact.is_primary && (
                    <span className="bg-red-100 text-danger text-xs px-2 py-0.5 rounded-full flex items-center font-medium">
                      <Star size={10} className="mr-1" /> Primary
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{contact.relationship}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-700 font-medium">{contact.phone}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <a 
                  href={`tel:${contact.phone}`} 
                  className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                  title="Call"
                >
                  <Phone size={20} />
                </a>
                <button 
                  onClick={() => handleEdit(contact)}
                  className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 bg-red-100 text-danger rounded-full hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;

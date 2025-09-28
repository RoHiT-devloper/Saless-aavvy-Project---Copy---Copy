import React, { useState, useEffect } from 'react';
import './AddressManager.css';

const AddressManager = ({ onAddressSelect, showSelector = false }) => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        addressType: 'HOME',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;

        try {
            const response = await fetch(`http://localhost:8080/api/addresses/user/${username}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
        
        try {
            const addressData = {
                ...formData,
                username
            };

            const url = editingAddress ? 
                `http://localhost:8080/api/addresses/${editingAddress.id}` :
                'http://localhost:8080/api/addresses/add';
            
            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });

            if (response.ok) {
                setShowForm(false);
                setEditingAddress(null);
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    addressType: 'HOME',
                    isDefault: false
                });
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const setDefaultAddress = async (addressId) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(
                `http://localhost:8080/api/addresses/${addressId}/set-default?username=${username}`,
                { method: 'POST' }
            );
            if (response.ok) {
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    const deleteAddress = async (addressId) => {
        const username = localStorage.getItem('username');
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/addresses/${addressId}?username=${username}`,
                    { method: 'DELETE' }
                );
                if (response.ok) {
                    fetchAddresses();
                }
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const editAddress = (address) => {
        setEditingAddress(address);
        setFormData({
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            addressType: address.addressType,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    return (
        <div className="address-manager">
            <div className="address-header">
                <h3>Shipping Addresses</h3>
                <button 
                    onClick={() => {
                        setEditingAddress(null);
                        setShowForm(true);
                        setFormData({
                            fullName: '',
                            phoneNumber: '',
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            addressType: 'HOME',
                            isDefault: false
                        });
                    }}
                    className="add-address-btn"
                >
                    + Add New Address
                </button>
            </div>

            {showForm && (
                <form className="address-form" onSubmit={handleSubmit}>
                    <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                    
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            required
                        />
                    </div>

                    <textarea
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        required
                    />

                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <select
                            value={formData.addressType}
                            onChange={(e) => setFormData({...formData, addressType: e.target.value})}
                        >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work</option>
                            <option value="OTHER">Other</option>
                        </select>
                        
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                            />
                            Set as default address
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">
                            {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowForm(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="addresses-list">
                {addresses.map(address => (
                    <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                        <div className="address-content">
                            <div className="address-type">{address.addressType}</div>
                            {address.isDefault && <span className="default-badge">Default</span>}
                            <p><strong>{address.fullName}</strong> | {address.phoneNumber}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                        </div>
                        <div className="address-actions">
                            {!address.isDefault && (
                                <button 
                                    onClick={() => setDefaultAddress(address.id)}
                                    className="set-default-btn"
                                >
                                    Set Default
                                </button>
                            )}
                            <button 
                                onClick={() => editAddress(address)}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => deleteAddress(address.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                            {showSelector && onAddressSelect && (
                                <button 
                                    onClick={() => onAddressSelect(address)}
                                    className="select-btn"
                                >
                                    Select
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManager;
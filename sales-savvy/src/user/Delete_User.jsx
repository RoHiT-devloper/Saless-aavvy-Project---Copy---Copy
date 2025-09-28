import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Delete_User.css';

const Delete_User = () => {
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [error, setError] = useState("");
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const usersData = await response.json();
            setUsers(usersData);
            setError("");
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. Please try again.");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        const user = users.find(u => u.id === parseInt(e.target.value));
        setSelectedUser(user || null);
    };

    const handleUserSelect = (user) => {
        setUserId(user.id.toString());
        setSelectedUser(user);
        setSearchTerm("");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm)
    );

    const validateForm = () => {
        if (!userId.trim()) {
            setError("Please select a user or enter a User ID");
            return false;
        }
        
        if (isNaN(userId) || Number(userId) <= 0) {
            setError("Please enter a valid User ID");
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setShowConfirmPopup(true);
    };

    const confirmDelete = async () => {
        setShowConfirmPopup(false);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/auth/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server returned ${response.status}`);
            }

            const result = await response.text();
            setSuccessMessage(result || "User deleted successfully!");
            setShowSuccessPopup(true);
            
            fetchAllUsers();
            
        } catch (error) {
            console.error("Error deleting user:", error);
            setError(error.message || "Failed to delete user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        setUserId("");
        setSelectedUser(null);
        setSearchTerm("");
    };

    const handleCancel = () => {
        setUserId("");
        setSelectedUser(null);
        setError("");
        setSearchTerm("");
    };

    const handleRefreshUsers = () => {
        setIsLoadingUsers(true);
        setError("");
        fetchAllUsers();
    };

    const getInitials = (username) => {
        if (!username) return '??';
        return username.substring(0, 2).toUpperCase();
    };

    return (
        <div className="delete-user-container">
            <div className="delete-user-card">
                <div className="delete-user-header">
                    <div className="warning-icon">⚠️</div>
                    <h1 className="delete-user-title">Delete User</h1>
                    <p className="delete-user-subtitle">Remove a user account from the system</p>
                </div>

                {error && (
                    <div className="status-message message-error">
                        {error}
                    </div>
                )}

                <div className="user-search-section">
                    <h3 className="section-title">
                        <span>🔍</span> Select User to Delete
                    </h3>
                    
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="Search users by name, email, or ID..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="section-header">
                        <button 
                            onClick={handleRefreshUsers} 
                            disabled={isLoadingUsers}
                            className="refresh-btn"
                        >
                            {isLoadingUsers ? "Refreshing..." : "🔄 Refresh List"}
                        </button>
                    </div>

                    {isLoadingUsers ? (
                        <div className="loading-users">
                            <div className="loading-spinner"></div>
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="no-users">
                            <p>No users found{searchTerm ? ' matching your search' : ' in the system'}.</p>
                        </div>
                    ) : (
                        <div className="user-results">
                            {filteredUsers.map(user => (
                                <div 
                                    key={user.id} 
                                    className={`user-result-item ${userId === user.id.toString() ? 'selected' : ''}`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="user-avatar">
                                        {getInitials(user.username)}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.username}</div>
                                        <div className="user-details">
                                            <span className="user-email">{user.email}</span>
                                            <span className={`user-role role-${user.role?.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="delete-user-form">
                    <div className="form-group">
                        <label className="form-label required">
                            User ID to Delete:
                        </label>
                        <input
                            type="number"
                            name="userId"
                            value={userId}
                            onChange={handleUserIdChange}
                            disabled={isLoading}
                            min="1"
                            className="search-input"
                            placeholder="Enter user ID or select from list above"
                        />
                        {selectedUser && (
                            <div className="selected-user-info">
                                <strong>Selected User:</strong> {selectedUser.username} 
                                ({selectedUser.email}) - {selectedUser.role}
                            </div>
                        )}
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            type="submit" 
                            disabled={isLoading || !userId}
                            className="btn btn-delete"
                        >
                            {isLoading ? "⏳ Deleting..." : "🗑️ Delete User"}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="btn btn-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {showConfirmPopup && selectedUser && (
                    <div className="confirmation-section">
                        <h3 className="confirmation-title">
                            <span>⚠️</span> Confirm Deletion
                        </h3>
                        <p>Are you sure you want to delete this user?</p>
                        
                        <div className="selected-user-info">
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                        </div>
                        
                        <div className="warning-message">
                            <p>⚠️ This action cannot be undone. All user data will be permanently deleted.</p>
                        </div>
                        
                        <div className="action-buttons">
                            <button 
                                onClick={confirmDelete}
                                className="btn btn-delete"
                            >
                                ✅ Yes, Delete User
                            </button>
                            <button 
                                onClick={handleCancelDelete}
                                className="btn btn-cancel"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                )}

                {showSuccessPopup && (
                    <div className="confirmation-section">
                        <h3 className="confirmation-title">
                            <span>✅</span> Success!
                        </h3>
                        <p>{successMessage}</p>
                        <button 
                            onClick={handlePopupOk}
                            className="btn btn-delete"
                        >
                            OK
                        </button>
                    </div>
                )}

                <div className="safety-warning">
                    <h3>⚠️ Important Notice</h3>
                    <p>
                        Deleting a user is a permanent action. All user data will be 
                        removed from the system and cannot be recovered. Please double-check 
                        the user information before proceeding with deletion.
                    </p>
                </div>

                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Delete_User;
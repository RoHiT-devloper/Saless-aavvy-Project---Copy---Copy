// /sales-savvy/src/user/User_Management.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./User_Management.css";

const User_Management = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    customers: 0,
    active: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    updateStats();
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const usersData = await response.json();
      setUsers(usersData);
      setError('');
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = () => {
    const total = users.length;
    const admins = users.filter(user => user.role?.toLowerCase() === 'admin').length;
    const customers = users.filter(user => user.role?.toLowerCase() === 'customer').length;
    const active = users.filter(user => user.status === 'active').length;

    setStats({ total, admins, customers, active });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError('');
    fetchUsers();
  };

  if (isLoading) {
    return (
      <div className="user-management-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="view-users-header">
        <h1 className="view-users-title">User Management</h1>
        <p className="view-users-subtitle">View and manage all registered users</p>
        
        <div className="users-stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.admins}</span>
            <span className="stat-label">ADMINISTRATORS</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.customers}</span>
            <span className="stat-label">CUSTOMERS</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">ACTIVE USERS</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">TOTAL USERS</span>
          </div>
        </div>
      </div>

      <div className="user-management-cards">
        <Link to="/show-users" className="user-management-card">
          <div className="card-icon">👥</div>
          <h3>View All Users</h3>
          <p>Browse and search through all registered users</p>
          <div className="card-cta">
            <span>View Users</span>
            <span>→</span>
          </div>
        </Link>
        
        <Link to="/delete-users" className="user-management-card danger">
          <div className="card-icon">🗑️</div>
          <h3>Delete Users</h3>
          <p>Remove user accounts from the system</p>
          <div className="card-cta">
            <span>Manage Users</span>
            <span>→</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default User_Management;
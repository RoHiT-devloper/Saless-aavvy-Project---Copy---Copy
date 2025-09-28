import React, { useState, useEffect } from 'react';
import './View_User.css';

const View_User = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
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
        filterUsers();
        updateStats();
    }, [users, searchTerm, roleFilter]);

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

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id?.toString().includes(searchTerm)
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user =>
                user.role?.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        setFilteredUsers(filtered);
    };

    const updateStats = () => {
        const total = users.length;
        const admins = users.filter(user => user.role?.toLowerCase() === 'admin').length;
        const customers = users.filter(user => user.role?.toLowerCase() === 'customer').length;
        const active = users.filter(user => user.status === 'active').length;

        setStats({ total, admins, customers, active });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setError('');
        fetchUsers();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('en-GB');
        } catch (error) {
            return dateString;
        }
    };

    const getInitials = (username) => {
        if (!username) return '??';
        return username.substring(0, 2).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="view-users-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-users-container">
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
        <div className="view-users-container">
            <div className="view-users-header">
                <h1 className="view-users-title">View Users</h1>
                <div className="users-stats-grid">
                    <div className="stat-card">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.admins}</span>
                        <span className="stat-label">Administrators</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.customers}</span>
                        <span className="stat-label">Customers</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Active Users</span>
                    </div>
                </div>
            </div>

            <div className="users-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users by name, email, or ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
                
                <div className="filter-controls">
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                    
                    <button onClick={handleRefresh} className="refresh-btn">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="users-table-container">
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No users found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="user-row">
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="user-avatar">
                                                {getInitials(user.username)}
                                            </div>
                                            <div>
                                                <div className="user-name">{user.username || 'N/A'}</div>
                                                <div className="user-id">ID: {user.id || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="user-email">{user.email || 'N/A'}</td>
                                    <td className="user-gender">
                                        <span className={`gender-badge ${user.gender?.toLowerCase() || 'unknown'}`}>
                                            {user.gender || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="user-dob">{formatDate(user.dob)}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role?.toLowerCase() || 'unknown'}`}>
                                            {user.role || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default View_User;
import React from 'react';
import AdminNavbar from './AdminNavbar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <AdminNavbar />
            <main className="admin-main-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
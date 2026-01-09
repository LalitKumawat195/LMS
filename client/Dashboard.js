import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Library Management System</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Books</h3>
            <p>Manage library books</p>
            <button>View Books</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Members</h3>
            <p>Manage library members</p>
            <button>View Members</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Transactions</h3>
            <p>Book issue/return tracking</p>
            <button>View Transactions</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Reports</h3>
            <p>Generate library reports</p>
            <button>View Reports</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
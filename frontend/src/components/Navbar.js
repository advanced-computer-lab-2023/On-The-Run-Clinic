// Navbar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import Notifications from './Notifications';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  // State to manage notifications
  const [notifications, setNotifications] = useState([]);

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Clinic</h1>
        </Link>
        <nav>
          {/* Add the Notifications component and pass the 'notifications' prop */}
          {user && <Notifications notifications={notifications} currentUser={user} />}
          {user && (
            <div className="navbar-options">
              <Link to="/notifications" className="notifications-icon">
                🔔
              </Link>
              <span>{user.user}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div className="navbar-options">
              <Link to="/login">Login</Link>
              <Link to="/register/doctor">Signup as Doctor</Link>
              <Link to="/register/patient">Signup as Patient</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

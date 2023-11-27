// Notifications.js

import React from 'react';

const Notifications = ({ notifications, currentUser }) => {
  // Filter notifications based on the current user
  const userNotifications = notifications.filter(
    (notification) => notification.userId === currentUser.id
  );

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {userNotifications.length > 0 ? (
        <ul>
          {userNotifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default Notifications;

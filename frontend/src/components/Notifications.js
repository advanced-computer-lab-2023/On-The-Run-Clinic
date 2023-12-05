import { useState, useEffect } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const Notifications = () => {
  const {user} = useAuthContext();
  const {username} = useParams();
  const [Notifications, setNotifications] = useState([]); 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
    console.log("usern" + username);
    console.log("roleee " + user.role);
      if(user.role === 'patient') {
        console.log("imhere");
      try {
        const notifications = await axios.get(`http://localhost:4000/getPatientNotifications/${username}`);
        if(notifications.status===200) {
          setNotifications(notifications.data.notifications);
          console.log("p" , notifications.data.notifications);        }
      }catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching patient data:', error);
    }
    finally {
      setLoading(false); 
    }
    }

    else if(user.role==='doctor')  {
      try {
        const notifications = await axios.get(`http://localhost:4000/getDoctorNotifications/${username}`);
        if(notifications.status===200) {
          setNotifications(notifications.data.notifications);
        }
      }catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching patient data:', error);
    }
    finally {
      setLoading(false); 
    }
    }
  };
  fetchNotifications();
  }, [username,user.role]);

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {Notifications.length > 0 ? (
            <ul>
              {Notifications.map((notification) => (
                <li key={notification._id}>
                  Message: {notification.message} <br />
                  Date: {notification.date} <br />
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </>
      )}
    </div>
  );

};

export default Notifications;

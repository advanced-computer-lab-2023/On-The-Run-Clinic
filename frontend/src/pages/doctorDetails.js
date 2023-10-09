import React from 'react';

const DoctorDetails = ({ doctor, onClose }) => {
  return (
    <div className="doctor-details">
      <h2>{doctor.name}</h2>
      <p><strong>Speciality:</strong> {doctor.speciality}</p>
      <p><strong>Username:</strong> {doctor.username}</p>
      <p><strong>Affiliation:</strong> {doctor.Affiliation}</p>
      <p><strong>Educational Background:</strong> {doctor.educational_background}</p>
      {/* Add more details as needed */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default DoctorDetails;
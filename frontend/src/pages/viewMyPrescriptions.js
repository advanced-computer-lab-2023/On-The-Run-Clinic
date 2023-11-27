import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jsPDF'

const MyPrescription = () => {
  const { username } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorUsername, setDoctorUsername] = useState('');
  const [filledOnly, setFilledOnly] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getMyPrescriptions/${username}`);

        if (response.status === 200) {
          let filteredPrescriptions = response.data;

          // Apply filters to the prescriptions
          if (doctorUsername) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.doctorUsername === doctorUsername
            );
          }

          if (filledOnly) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.filled === true
            );
          }

          if (filterDate) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.date.substring(0, 10)  === filterDate
            );
          }

          setPrescriptions(filteredPrescriptions);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [username, doctorUsername, filledOnly, filterDate]);
  const handleViewPrescription = (prescription) => {
    // Set the selected prescription to display its details in a modal or side panel
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    // Clear the selected prescription to close the modal or side panel
    setSelectedPrescription(null);
  };

  const handleDownloadPrescription = async(prescription) => {
    //create pdf
    const pdfGenerate=()=>{
      try{
      var doc = new jsPDF('landscape', 'px', 'a4',false);
      doc.addPage();
      doc.setFont('Helvetica', 'bold');
      doc.text(60,60,'Medication Name: ');
      doc.text(60,80,'Dosage: ');
      doc.text(60,100,'Instructions: ');
      doc.text(60,120,'Date: ');
      doc.text(60,140,'Doctor ID: ');
      doc.text(60,160,'Filled: ');
      doc.setFont('Helvetica','normal');
      doc.text(100,60, `${prescription.medicationName}`);
      doc.text(100,80, `${prescription.dosage}`);
      doc.text(100,100, `${prescription.instructions}`);
      doc.text(100,120, `${prescription.date}`);
      doc.text(100,140, `${prescription.doctor}`);
      doc.text(100,160, `${prescription.filled ? 'Yes' : 'No'}`);
      doc.save('prescription.pdf');
      
      //create download link and trigger download
      const url = URL.createObjectURL(doc.output('blob'));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'prescription.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      }
      catch (error){
        console.error('error creating pdf: ', error);
      }
      };
      pdfGenerate();
  };

  return (
    <div>
      <h1>Prescriptions of {username}</h1>

      {/* Filter form */}
      <form>
        <div>
          <label>
            Doctor Username:
            <input
              type="text"
              value={doctorUsername}
              onChange={(e) => setDoctorUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Filled Only:
            <input
              type="checkbox"
              checked={filledOnly}
              onChange={() => setFilledOnly(!filledOnly)}
            />
          </label>
        </div>
        <div>
          <label>
            Filter by Date:
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length > 0 ? (
        <ul>
          {prescriptions.map((prescription) => (
             <li key={prescription._id}>
             Medication Name: {prescription.medicationName}<br />
             
             <button onClick={() => handleViewPrescription(prescription)}>View Prescription</button>
             <button onClick={() => handleDownloadPrescription(prescription)}>Download Prescription</button>
           </li>
          ))}
        </ul>
      ) : (
        <p>No Prescriptions found.</p>
      )}
      {selectedPrescription && (
        <div>
          {/* Display prescription details here */}
          <h2>Prescription Details</h2>
          <p>Medication Name: {selectedPrescription.medicationName}</p>
          <p>Dosage: {selectedPrescription.dosage}</p>
          <p>Instructions: {selectedPrescription.instructions}</p>
          <p>Date: {selectedPrescription.date}</p>
          <p>Doctor ID: {selectedPrescription.doctor}</p>
          <p>Filled: {selectedPrescription.filled ? 'Yes' : 'No'}</p>
          {/* Add close button or functionality to close the modal */}
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default MyPrescription;
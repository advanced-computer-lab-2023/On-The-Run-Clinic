import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import HealthPackagesForm from '../components/HealthPackagesForm';
import PackageDetailsModal from '../components/HealthPackageModal';

const ManageHealthPackages = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagee, setPackagee] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the list of health packages from the server
    axios.get('http://localhost:4000/getPackages', {
      withCredentials: true
    })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching health packages:', error);
      });
  }, []);

  const handlePackagesFetched = (isLinked) => {
    if (isLinked) {
      axios.get('http://localhost:4000/getPackages', {
        withCredentials: true
      })
        .then((response) => {
          setPackages(response.data);
        })
        .catch((error) => {
          console.error('Error fetching health packages:', error);
        });
      setIsFormVisible(false);
    }
  };
  const handleDelete = (packageId) => {
    // Send a DELETE request to delete the selected package
    axios.delete(`http://localhost:4000/deletePackage?id=${packageId}`, {
      withCredentials: true
    })
      .then((response) => {
        console.log('Package deleted successfully:', response.data);
        // Fetch the updated list of health packages after deletion
        axios.get('http://localhost:4000/getPackages', {
          withCredentials: true
        })
          .then((response) => {
            setPackages(response.data);
          })
          .catch((error) => {
            console.error('Error fetching health packages:', error);
          });
      })
      .catch((error) => {
        console.error('Error deleting health package:', error);
      });
  };


  return (
    <div className="container">
      <div className="prescriptions-list">
        <h2>
          Health Packages
          <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
        </h2>
        <ul>
          {packages.map((p) => (
            <li key={p._id}>
              <div className="prescription-card">
                <div className="prescription-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Name: </strong>  {p.name}</span>
                  <div>
                    <FontAwesomeIcon
                      className="view-icon"
                      icon={faEye}
                      style={{marginRight:'10px'}}
                      onClick={() => {
                        setActiveId(p._id)
                        setPackagee(p);
                        setIsModalOpen(true);
                      }}
                    />
                    <FontAwesomeIcon
                      className="delete-icon"
                      icon={faTrash}
                      onClick={() => handleDelete(p._id)}
                    />
                  </div>
                </div>
                  <div><strong>Package ID: </strong> {p._id}</div>
                </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="prescription-form">
        {isFormVisible && <HealthPackagesForm onPackagesFetched={handlePackagesFetched} />}
      </div>
      {isModalOpen && packagee &&
        <PackageDetailsModal
          setOpenModal={setIsModalOpen}
          packagee={packagee}
          onSuccess={handlePackagesFetched}
        />
      }

    </div>

  )
}
export default ManageHealthPackages

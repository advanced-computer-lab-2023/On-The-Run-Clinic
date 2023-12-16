import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from 'react-spinners/BeatLoader';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const MyPharma = () => {
  const [pharmas, setPharmas] = useState([]);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPharmas = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getPharma`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPharmas(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching pharmacists:', error);
      }
    };

    fetchPharmas();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="patients-list">
        <h2>Pharmacists</h2>

        {loading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : pharmas.length === 0 ? (
          <p>No pharmacists found</p>
        ) : (
          <ul className="patients-list">
            {pharmas.map((p) => (
              <li key={p._id}>
                <div className="patients-header">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Name: </strong>
                    {p.name}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>ID: </strong>
                    {p._id}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                    <Link to={`/chat/${username}/${p.username}`}>
                      <button style={{ background: 'transparent', border: 'none' }}>
                        <FontAwesomeIcon icon={faComments} color="#14967f" style={{ marginLeft: '10px' }} />
                      </button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
     
    </div>
  );
};

export default MyPharma;

import axios from 'axios';
import React, { useState, useEffect } from 'react';

function HealthPackagesForm(
    { onPackagesFetched }
) {
   const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [services, setServices] = useState('');

    const handleCreatePackage = () => {
        // Send a POST request to create the new health package
        axios.post('http://localhost:4000/createPackage', {name,price,services},{
          withCredentials: true
        })
          .then((response) => {
            onPackagesFetched(true);
            console.log('Package created successfully:', response.data,{
              withCredentials: true
            });
           //reset
           setName('');
              setPrice('');
                setServices('');
            // Fetch the updated list of health packages
           
         
          });
      };

    return (

        <div className="form-container">
            <h2>Create New Health Package</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value )}
            />
            <input
                type="Number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <input
                type="text"
                placeholder="Services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
            />
            <div className="form-group">
                <button onClick={handleCreatePackage}>Create</button>
            </div>
        </div>

    );
}

export default HealthPackagesForm;
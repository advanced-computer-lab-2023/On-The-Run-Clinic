import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function FamMemForm({ onLinkSuccess }) {
    const { username } = useParams();

    const [name, setName] = useState('');
    const [national_id, setNational_id] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(''); // Initialize gender state
    const [relation, setRelation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all fields are filled
        if (!name || !national_id || !age || !gender || !relation) {
            setError('Please fill in all fields.');
            return;
        }
    
        const mem = { name, national_id, age, gender, relation, patientUsername: username };
        try {
            const response = await axios.post('http://localhost:4000/addFamilyMember', mem, {
                withCredentials: true
            });
    
            if (response.status === 201) {
                console.log('Family member added successfully:', response.data);
                setName('');
                setNational_id('');
                setAge('');
                setGender('');
                setRelation('');
                setError(null);
                onLinkSuccess(true);// Set isAdded to true when family member is added
            } else {
                console.error('Family member addition failed:', response.data);
                setError('Family member addition failed.');
            }
        } catch (error) {
            console.error('Family member addition failed:', error);
            setError('Family member addition failed.');
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <h2>Add Family Member</h2>
                {loading ? <p>Loading...</p> : (
                    <>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="national_id">National ID</label>
                            <input
                                type="text"
                                id="national_id"
                                name="national_id"
                                value={national_id}
                                onChange={(e) => setNational_id(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            {/* Use a select input for gender */}
                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="relation">Relation</label>
                            {/* Use a select input for relation */}
                            <select
                                id="relation"
                                name="relation"
                                value={relation}
                                onChange={(e) => setRelation(e.target.value)}
                                required
                            >
                                <option value="">Select Relation</option>
                                <option value="Wife">Wife</option>
                                <option value="Child">Child</option>
                                <option value="Husband">Husband</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit">Submit Prescription</button>
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}

export default FamMemForm;
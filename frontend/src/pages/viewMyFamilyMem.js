import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Container, Row, Col, Spinner ,OverlayTrigger,Popover} from 'react-bootstrap';

const FamilyMembersList = () => {
  const { username } = useParams();
  const navigate=useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [linkedFamilyMembers, setLinkedFamilyMembers] = useState([]); // Add this line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
       
        const response = await axios.get(`http://localhost:4000/getFamilyMem/${username}`,{
          withCredentials: true
        });
        console.log(response.data);

        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
        const linkedResponse = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`,{
          withCredentials: true
        });
        if (linkedResponse.status === 200) {
          setLinkedFamilyMembers(linkedResponse.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [username]);
  
  const FamilyMember = ({ member, isLinked }) => (


    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Header as="h5">{isLinked ? member.linkedPatientName : member.name}</Card.Header>
      <ListGroup variant="flush">
        {!isLinked && (
          <>
            <ListGroup.Item>National ID: {member.national_id}</ListGroup.Item>
            <ListGroup.Item>Age: {member.age}</ListGroup.Item>
            <ListGroup.Item>Gender: {member.gender}</ListGroup.Item>
          </>
        )}
        <ListGroup.Item>Relation: {isLinked ? member.linkedPatientRelation : member.relation}</ListGroup.Item>
        {isLinked && (
 <Button
 variant="primary"

 onClick={() => {
   navigate(`/filterAppointmentsPatient/${member.linkedPatientUsername}`);
 }}
>
 View Appointments
</Button>
)}
      </ListGroup>
    </Card>
  );

 
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1 style={{textAlign:'left'}} >Family Members of {username}</h1>
          <p style={{fontSize:'15px',color:'gray'}}>These are the family members that doesn't have an account and are listed under your name</p>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <>
            
              <Row>
                {familyMembers.length > 0 ? (
                  familyMembers.map(member => (
                    <Col sm={12} md={6} lg={4} xl={3} key={member._id}>
                      <FamilyMember member={member} />
                    </Col>
                  ))
                ) : (
                  <p>No normal family members found.</p>
                )}
              </Row>

              
            </>
          )}
          <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FamilyMembersList;
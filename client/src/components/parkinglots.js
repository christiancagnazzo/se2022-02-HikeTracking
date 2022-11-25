import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterForm from './filterformhikes';
  
function displayParkingLotsUtil(parkinglots, userPower){
  let parkinglotscards =  parkinglots.map((h) => 
      <Col className="pb-4 px-0">
        <ParkingLotCard userPower={userPower} hike={h}/>
      </Col>)
    let rows = []
    for(let i = 0; i < Math.ceil(parkinglots.length/3);i++){
      let cols = []
      let j
      for(j = 0; j < 3 && parkinglotscards.length; j++){
        cols.push(parkinglotscards.pop())
      }
      for(;j<3;j++){
        cols.push(<Col className="pb-4 px-0"></Col>)
      }
      rows.push(<Row className='px-0' key ={i}>{cols}</Row>)
    }
    return <>{rows}</>
}

function ParkingLots(props){
  if(props.parkinglots.length === 0) {
    return  <h1>No available parking lots</h1>
  }
  else {
    return displayParkingLotsUtil(props.parkinglots, props.userPower)
  }
}


function ParkingLotCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);

  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.parkinglot.title}>
      <Card.Body>
        <Card.Title>{props.parkinglot.title}</Card.Title>

      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Address: {props.parkinglot.address}km</ListGroup.Item>
        <ListGroup.Item>Latitude: {props.parkinglot.latitude}km</ListGroup.Item>
        <ListGroup.Item>Longitude: {props.parkinglot.longitude}km</ListGroup.Item>
        <ListGroup.Item>Fee: {props.parkinglot.fee}m</ListGroup.Item>
        <ListGroup.Item>Cars: {props.parkinglot.cars}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Text>
          <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
          {' '}
         
        </Card.Text>
      </Card.Body>

    </Card>
    <ParkinglotModalDescription
      show={modalDescriptionShow}
      onHide={() => setModalDescriptionShow(false)}
      title={props.parkinglot.title}
      description={props.parkinglot.description}
      
    />
    
  </>
  );
}
function ParkinglotModalDescription(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Description</h4>
        <p>
          {props.description}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}






export default ParkingLots;



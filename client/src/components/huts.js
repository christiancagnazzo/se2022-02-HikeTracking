import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterForm from './filterformhikes';

function displayHutsUtil(huts){
  let hutscard =  huts.map((h,idx) => 
      <Col className="pb-4 px-0" key={idx}>
        <HutCard hut={h}/>
      </Col>)
    let rows = []
    for(let i = 0; i < Math.ceil(huts.length/3);i++){
      let cols = []
      let j
      for(j = 0; j < 3 && hutscard.length; j++){
        cols.push(hutscard.pop())
      }
      for(;j<3;j++){
        cols.push(<Col className="pb-4 px-0" key={j}></Col>)
      }
      rows.push(<Row className='px-0' key ={i}>{cols}</Row>)
    }
    return <>{rows}</>
}

function Huts(props){
  if(props.huts.length === 0) {
    return  <h1>No available huts</h1>
  }
  else {
    return displayHutsUtil(props.huts)
  }
}


function HutCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
  console.log(props.hut)
  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.hut.name}>
      <Card.Body>
        <Card.Title>{props.hut.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Address: {props.hut.address}</ListGroup.Item>
        <ListGroup.Item>#Beds: {props.hut.beds}</ListGroup.Item>
        <ListGroup.Item>Services: {props.hut.services}</ListGroup.Item>
        <ListGroup.Item>Fee per night: {props.hut.fee}€</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Text>
          <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
          {' '}
          
        </Card.Text>
      </Card.Body>

    </Card>
    <HutModalDescription
      show={modalDescriptionShow}
      onHide={() => setModalDescriptionShow(false)}
      name={props.hut.name}
      desc={props.hut.desc}
    />
    
  </>
  );
}
function HutModalDescription(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Description</h4>
        <p>
          {props.desc}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



export default Huts;



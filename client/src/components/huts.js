import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterForm from './filterformhikes';

/*useEffect(() => {
  const getHuts = async function () {
    let req = await API.getAllHuts(token)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
      let all_huts = []
      req.msg.forEach((el) => all_huts.push({ "hutId": el.id, "hutName": el.name, "lat": el.lat, "lon": el.lon }))
      setHuts(all_huts)
    }
  }

  getHuts()
}, [])*/

function displayHutsUtil(huts, userPower){
  let hutscard =  huts.map((h) => 
      <Col className="pb-4 px-0">
        <HutCard userPower={userPower} hike={h}/>
      </Col>)
    let rows = []
    for(let i = 0; i < Math.ceil(huts.length/3);i++){
      let cols = []
      let j
      for(j = 0; j < 3 && hutscard.length; j++){
        cols.push(hutscard.pop())
      }
      for(;j<3;j++){
        cols.push(<Col className="pb-4 px-0"></Col>)
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
    return displayHutsUtil(props.huts, props.userPower)
  }
}


function HutCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);

  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.hut.title}>
      <Card.Body>
        <Card.Title>{props.hut.title}</Card.Title>

      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Length: {props.hut.length}km</ListGroup.Item>
        <ListGroup.Item>Estimated time: {props.hut.expected_time}min</ListGroup.Item>
        <ListGroup.Item>Ascent: {props.hut.ascent}m</ListGroup.Item>
        <ListGroup.Item>Difficulty: {props.hut.difficulty}</ListGroup.Item>
        <ListGroup.Item>Start point: {props.hut.start_point_address}</ListGroup.Item>
        <ListGroup.Item>End point: {props.hut.end_point_address}</ListGroup.Item>
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
      title={props.hut.title}
      description={props.hut.description}
      rpList={props.hut.rp}
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
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Description</h4>
        <p>
          {props.description}
        </p>
        <h5>Reference Points</h5>
        <ul>
          {props.rpList.map((rp) =>
            <li>Address: {rp.reference_point_address} - Lan: {rp.reference_point_lat} - Lon: {rp.reference_point_lng}</li>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



export default Huts;



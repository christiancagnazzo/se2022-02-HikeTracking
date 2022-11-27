import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ListGroup, Row, Col, Modal, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterForm from './filterformhikes';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';


function displayHikesUtil(hikes, userPower) {
  let hikescard = hikes.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <HikeCard userPower={userPower} hike={h} />
    </Col>)
  let rows = []
  for (let i = 0; i < Math.ceil(hikes.length / 3); i++) {
    let cols = []
    let j
    for (j = 0; j < 3 && hikescard.length; j++) {
      cols.push(hikescard.pop())
    }
    for (; j < 3; j++) {
      cols.push(<Col className="pb-4 px-0" key={j}></Col>)
    }
    rows.push(<Row className='px-0' key={i}>{cols}</Row>)
  }
  return <>{rows}</>
}


function Hikes(props) {
  if (props.hikes.length === 0) {
    return <h1>No available hikes</h1>
  }
  else {
    return displayHikesUtil(props.hikes, props.userPower)
  }

}



function HikeCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
  const [modalMapShow, setModalMapShow] = useState(false);
  const isHiker = props.userPower === 'hiker'

  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.hike.title}>
      <Card.Body>
        <Card.Title>{props.hike.title}</Card.Title>

      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Length: {props.hike.length}km</ListGroup.Item>
        <ListGroup.Item>Estimated time: {props.hike.expected_time}min</ListGroup.Item>
        <ListGroup.Item>Ascent: {props.hike.ascent}m</ListGroup.Item>
        <ListGroup.Item>Difficulty: {props.hike.difficulty}</ListGroup.Item>
        <ListGroup.Item>Start point: {props.hike.start_point_address}</ListGroup.Item>
        <ListGroup.Item>End point: {props.hike.end_point_address}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Text>
          <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
          {' '}
          { (isHiker && props.hike.file !== "NTF") ? <Button onClick={() => setModalMapShow(true)}>Display track</Button> : (isHiker)?<Badge bg="secondary">No Track Available</Badge>:''}
        </Card.Text>
      </Card.Body>

    </Card>
    <HikeModalDescription
      show={modalDescriptionShow}
      onHide={() => setModalDescriptionShow(false)}
      title={props.hike.title}
      description={props.hike.description}
      rpList={props.hike.rp}
    />
    {isHiker ? <HikeModalTrack
      show={modalMapShow}
      onHide={() => setModalMapShow(false)}
      title={props.hike.title}
      file={props.hike.file}
      sp={[props.hike.start_point_lat, props.hike.start_point_lng]}
      ep={[props.hike.end_point_lat, props.hike.end_point_lng]}
      rpList={props.hike.rp}
    /> : ''}
  </>
  );
}


function HikeModalDescription(props) {
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
        {props.rpList.length ? <h5>Reference Points</h5> : ''}
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




function HikeModalTrack(props) {



  return (
    props.file ?
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
          <h4>Track</h4>
          <Map rpList={props.rpList} sp={props.sp} ep={props.ep} gpxFile={props.file} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
      :

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
          <h4>No track available</h4>
         
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
  )
}




export default Hikes



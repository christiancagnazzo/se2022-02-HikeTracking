import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';


function VisitorPage(props) {
  let [hikes, setHikes] = useState([]);

  useEffect(() => {
    const getHikes = async () => {

      try {
        const hikes = await API.getAllHikes();
        setHikes(hikes.msg);
        console.log(hikes)
      } catch (err) {
        console.log(err)
      }
    }

    getHikes()
  }, []);


  return (
    <Container className="below-nav">
      <Row xs={1} sm={2} md={3}>
          { hikes.map( (h) => <Col><HikeCard hike={h}></HikeCard></Col> )}
      </Row>
    </Container>
  )
}


function HikeCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
  const [modalMapShow, setModalMapShow] = useState(false);
  const file = ''
  const isHiker = true
  
  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.hike.title}>
      <Card.Body>
        <Card.Title>{props.hike.title}</Card.Title>

      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Length: {props.hike.length}m</ListGroup.Item>
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
          {isHiker ? <Button onClick={() => setModalMapShow(true)}>Display track</Button> : ''}
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
      file={file}
      sp={[props.hike.start_point_lat,props.hike.start_point_lng]}
      ep={[props.hike.end_point_lat,props.hike.end_point_lng]}
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
        <h5>Reference Points</h5>
        <ul>
        { props.rpList.map ( (rp) => 
          <li>Address: {rp.reference_point_address} - Lan: {rp.reference_point_lan} - Lon: {rp.reference_point_lng}</li>
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



  return (<Modal
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

  )
}


export default VisitorPage



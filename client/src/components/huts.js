import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterForm from './filterform';

function Huts(props) {
  
  const [currSel, setCurrSel] = useState("huts")
  const [errorMessage, setErrorMessage] = useState('')
  const huts=props.huts;
  
  const updateCurrSel = (sel) =>{
    setCurrSel(sel)
  }
  return (
    <Container fluid className="flex-grow-1">
      {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : ''}
      <Row className="h-100">
        <Col  sm={2} className="px-0 border-right border-bottom border border-dark bg-dark">
          <Menu currSel={currSel} changeSel={updateCurrSel}></Menu>
        </Col>
      
        <Col sm={10} className="py-1">
          <Row xs={1} sm={2} md={3}>
            {currSel === "huts" && huts.length === 0 ? <h1>No available hikes</h1> : ''}
              {currSel === "hikes" ? huts.map((h) => <Col><HutsCard userPower={props.userPower} hut={h}></HutsCard></Col>) 
              :<FilterForm changeSel={updateCurrSel} huts={huts} applyFilter={props.applyFilter} setErrorMessage={setErrorMessage}></FilterForm>}
          </Row>
        </Col>
        
      </Row>
      
    </Container>
  )
}
function HutsCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
  const [modalMapShow, setModalMapShow] = useState(false);
  const isHiker = props.userPower === 'hiker'

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
          {isHiker ? <Button onClick={() => setModalMapShow(true)}>Display place</Button> : ''}
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
    {isHiker ? <HutModalTrack
      show={modalMapShow}
      onHide={() => setModalMapShow(false)}
      title={props.hut.title}
      file={props.hut.file}
      sp={[props.hut.start_point_lat, props.hut.start_point_lng]}
      ep={[props.hut.end_point_lat, props.hut.end_point_lng]}
      rpList={props.hut.rp}
    /> : ''}
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

function HutModalTrack(props) {
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

function Menu(props){

  const commonClass ="list-group-item list-group-item-action rounded-0 "

  return (
    <ListGroup>
      <Button className={commonClass + (props.currSel === "huts"?"active" :'' )} onClick={() => props.changeSel("huts")}>Available hikes</Button>
      <Button className={commonClass+ (props.currSel === "filters"?"active" :'' )} onClick={() => props.changeSel("filters")}>Apply filters</Button>
    </ListGroup>
  )
}


export default Huts;



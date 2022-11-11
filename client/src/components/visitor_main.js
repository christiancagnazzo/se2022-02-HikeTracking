import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Container, ListGroup, Row, Col, Modal} from 'react-bootstrap';
import { useState } from 'react';
import Map from './map'
import Sidebar from './sidebar';

function VisitorPage(props){
    return(
    <Container className="below-nav">
        <Row>
        <Col md={2}>
        <Sidebar logged={null} setCheckedState={props.setCheckedState} checkedState={props.checkedState} getH={props.getH} filter={props.filter}/>
        </Col>
        
        <Col md={10}>
        <Row xs={1} sm={2} md={3}>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
            <Col className="my-2 d-flex justify-content-center"><HikeCard/></Col>
        </Row>
        </Col>
        
        </Row>
    </Container>
    )
}



function HikeCard(props){
    const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
    const [modalMapShow, setModalMapShow] = useState(false);
    const file = ''
    const isHiker = true
    const title = "Hike Title"
    const description ="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    const length = 10
    const est_time = 50
    const ascent= 1500
    const difficulty = "Hiker"
    const sp = [45.06346595197588, 7.660135427305298]
    const sp_address = "Corso Castelfidardo, 39, 10129 Torino TO"
    const ep = [45.06250249516215, 7.662339411960652]
    const ep_address = "Corso Duca degli Abruzzi, 24, 10129 Torino TO"
    const rpList = []
    
    return(<>
        <Card style={{ width: '22rem'}} key={0} title={title}>
            <Card.Body>
            <Card.Title>{title}</Card.Title>
            
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Length: {length}m</ListGroup.Item>
                <ListGroup.Item>Estimated time: {est_time}min</ListGroup.Item>
                <ListGroup.Item>Ascent: {ascent}m</ListGroup.Item>
                <ListGroup.Item>Difficulty: {difficulty}</ListGroup.Item>
                <ListGroup.Item>Start point: {sp_address}</ListGroup.Item>
                <ListGroup.Item>End point: {ep_address}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
            <Card.Text>
                <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
                {' '}
                {isHiker? <Button onClick={() => setModalMapShow(true)}>Display track</Button> : ''}
            </Card.Text>
            </Card.Body>
              
        </Card>
          <HikeModalDescription
          show={modalDescriptionShow}
          onHide={() => setModalDescriptionShow(false)}
          title={title}
          description={description}
          rpList={rpList}
          />
          {isHiker?<HikeModalTrack
          show={modalMapShow}
          onHide={() => setModalMapShow(false)}
          title={title}
          file={file}
          sp={sp}
          ep={ep}
          rpList={rpList}
          />:''}
    </>
    );
  }





  function HikeModalDescription(props){
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
            <p>
              Questo reference point, quel reference point, quell'altro ancora
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
  }

  
  

  function HikeModalTrack(props){
    
    
    
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
         <Map rpList={props.rpList} sp={props.sp} ep={props.ep} gpxFile={props.file}  />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

    )
  }


  export default VisitorPage



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card,ListGroup, Button,Modal, Badge } from "react-bootstrap";
import Map from "./map";
import hike1 from '../img/hike1.jpg'
import TimeModal from "./timeModal";
import dayjs from "dayjs";
function HikeCard(props) {
    const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
    const [modalMapShow, setModalMapShow] = useState(false);
    const [modalTime, setModalTime] = useState(false)
    const [time, setTime] = useState(dayjs())
    const [errorMessageTime, setErrorMessageTime] = useState('')
    const isHiker = props.userPower === 'hiker'
    const isLocalGuide = props.userPower === 'localguide'
    const isHutWoker = props.userPower === 'hutworker'
    const canModify = props.userId && props.userId === props.hike.local_guide_id
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
      e.preventDefault()
    }
    return (<>
      <Card style={{ width: '21rem' }} key={0} title={props.hike.title}>
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
          {isHiker || isHutWoker ?<ListGroup.Item>Condition: {props.hike.condition? props.hike.condition: 'Open'}</ListGroup.Item>:''}
        </ListGroup>
        <Card.Body>
          <Card.Text>
            <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
            {' '}
            {(isHiker && props.hike.file !== "NTF") ? <Button onClick={() => setModalMapShow(true)}>Display track</Button> : (isHiker) ? <Badge bg="secondary">No Track Available</Badge> : ''}
            {isLocalGuide && canModify ? <Button variant='warning' onClick={() => navigate('/localguide/edithike/' + props.hike.title)}>Edit</Button> : ''}
            {isHutWoker? <Button variant='warning' onClick={() => navigate('/hutworker/condition/' + props.hike.title)}>Update condition</Button>: ''}
            {' '}
            {isHiker? <Button variant="success" onClick={() => setModalTime(true)}>Start</Button>: ''}
            
          </Card.Text>
        </Card.Body>
  
      </Card>
      <HikeModalDescription
        show={modalDescriptionShow}
        onHide={() => setModalDescriptionShow(false)}
        title={props.hike.title}
        description={props.hike.description}
        rpList={props.hike.rp}
        condition = {props.hike.condition}
        condition_description = {props.hike.condition_description}
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
      {isHiker ? <TimeModal
            type={"start"}
            show={modalTime}
            time={time}
            updateTime={setTime}
            onHide={() => setModalTime(false)}
            errorMessage={errorMessageTime}
            setErrorMessage={setErrorMessageTime}
            handleSubmit={handleSubmit}
            />:''}
      
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
        <img src={hike1} alt='' class=''/>

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
  
          {props.condition !== "Open" && props.condition?<>
          <h4>
            Condition description: </h4>
            <p>
            {props.condition_description}
              </p></>
          :''}
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
  
export default HikeCard
  
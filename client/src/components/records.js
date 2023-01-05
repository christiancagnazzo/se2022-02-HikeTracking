import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card,ListGroup, Button,Modal, Badge, Spinner, Col } from "react-bootstrap";
import TimeModal from "./timeModal";
import dayjs from "dayjs";
import API from "../API";
import TheSpinner from "./spinner";
import MapRecord from './MapRecord';
import UTILS from "../utils/utils";
/// tramite props passo il file
function Record(props) {

    const hike= props.records
    const [modalMapShow, setModalMapShow] = useState(false);
    const [modalTime, setModalTime] = useState(false)
    const [time, setTime] = useState(dayjs())
    const [errorMessageTime, setErrorMessageTime] = useState('')
    const isHiker = props.userPower === 'hiker'
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
      e.preventDefault()
    }
  
    useEffect(() => {
      async function hiker(){
    
      if(!isHiker){
        navigate("/")
      }
    }
    hiker()
  },[isHiker])

  if (hike.length == 0)
    return <h1>No completed hikes</h1> 
   else {
    return (
      hike.map( (hike, idx) => {
        return (
          <>
          <Col className="pb-4 px-0" key={idx}>
          <Card style={{ width: '21rem' }} key={0} title={hike.hike.title}>
          <Card.Body>
            <Card.Title>{hike.hike.title}</Card.Title>
            <h6>Starting Date: {hike.hike.start_point_datetime.format("DD/MM/YYYY")} </h6>
    
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Starting Time: {hike.hike.start_point_datetime.format("HH:mm:ss")} min</ListGroup.Item>
            <ListGroup.Item>Ending Time: {hike.hike.end_point_datetime.format("HH:mm:ss")} min</ListGroup.Item>
            <ListGroup.Item>Length: {hike.hike.length}km</ListGroup.Item>
            <ListGroup.Item>Ascent: {hike.hike.ascent}m</ListGroup.Item>
            <ListGroup.Item>Difficulty: {hike.hike.difficulty}</ListGroup.Item>
          </ListGroup>
          <Card.Body>
          
          <Button onClick={() => setModalMapShow(true)}>Display track</Button>
          
          </Card.Body>
        </Card>
        </Col>
        <HikeModalTrack
          id={hike.hike.id}
          show={modalMapShow}
          visible={modalMapShow}
          onHide={() => setModalMapShow(false)}
          title={hike.hike.title}
          sp={{
            lat: hike.hike.start_point_lat,
            lng: hike.hike.start_point_lng,
            datetime: hike.hike.start_point_datetime 
          }}
          ep={{
            lat: hike.hike.end_point_lat, 
            lng: hike.hike.end_point_lng,
            datetime: hike.hike.end_point_datetime
          }}
          rpList={hike.hike.rp}
          
        /> 
        <TimeModal
              type={"start"}
              show={modalTime}
              time={time}
              updateTime={setTime}
              onHide={() => setModalTime(false)}
              errorMessage={errorMessageTime}
              setErrorMessage={setErrorMessageTime}
              handleSubmit={handleSubmit}
              />
        </>
        )
      })

    );
    }
  } 
  
  
  
  function HikeModalTrack(props) {
    let [file, setFile] = useState('')
    const [error, setError] = useState(false)
    const token = localStorage.getItem("token")
    useEffect(() => {
      async function getFile(){
      try{
        const track = await API.getHikeFile(props.id, token)
        if(track.err){
          setError(true)
          return
        }
        setFile(track)
        } catch(e){
        setError(true)
        console.log(error)
        } 
      }
      if(!file){
        getFile()
      }
    },[file])
    
    return (
      !props.error ?
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
            {file ? <MapRecord rpList={props.rpList} sp={props.sp} ep={props.ep} gpxFile={file} /> : <TheSpinner/>}
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



export default Record
  
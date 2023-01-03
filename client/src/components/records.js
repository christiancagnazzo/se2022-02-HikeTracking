import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card,ListGroup, Button,Modal, Badge, Spinner } from "react-bootstrap";
import Map from "./map";

import TimeModal from "./timeModal";
import dayjs from "dayjs";
import API from "../API";
import TheSpinner from "./spinner";
/// tramite props passo il file
function Record(props) {
    const [hike,setHike]= useState({
        "hike": {
            "id": 154,
            "title": "Picciano Tappa 77",
            "length": 29704,
            "expected_time": 240,
            "ascent": 438,
            "difficulty": "Tourist",
            "description": "Prova questo sentiero da punto a punto di 29,8-km vicino a Matera, Basilicata. Un percorso generalmente considerato impegnativo che richiede una media di 7 o 26 min per essere completato",
            "track_file": "tracks/Via_Peuceta_Tappa_7__Picciano_-_Matera.gpx",
            "start_point_id": 174,
            "end_point_id": 175,
            "local_guide_id": 1,
            "picture": "./hikePictures/defultImage.jpg",
            "condition": "Open",
            "condition_description": "Open",
            "rp": [
                {
                    "reference_point_id": 176,
                    "reference_point_lat": 40.68417,
                    "reference_point_lng": 16.49451,
                    "reference_point_address": "primo",
                    "reached": false
                },
                {
                    "reference_point_id": 177,
                    "reference_point_lat": 40.67229,
                    "reference_point_lng": 16.5118,
                    "reference_point_address": "secondo",
                    "reached": false
                }
            ],
            "start_point_lat": 40.69908,
            "start_point_lng": 16.47273,
            "start_point_address": "Via Marco polo 12",
            "end_point_lat": 40.66681,
            "end_point_lng": 16.61095,
            "end_point_address": "Lombardo 13",
            "start_point_datetime": "2023-01-01T22:38:04.000Z",
            "end_point_datetime": "2023-01-01T22:42:01.000Z"
        },
        "rp": [
            {
                "reference_point_id": 176,
                "reference_point_lat": 40.68417,
                "reference_point_lng": 16.49451,
                "reference_point_address": "primo",
                "reached": false
            },
            {
                "reference_point_id": 177,
                "reference_point_lat": 40.67229,
                "reference_point_lng": 16.5118,
                "reference_point_address": "secondo",
                "reached": false
            }
        ]
    })
    const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
    const [modalMapShow, setModalMapShow] = useState(false);
    const [modalTime, setModalTime] = useState(false)
    const [time, setTime] = useState(dayjs())
    const [errorMessageTime, setErrorMessageTime] = useState('')
    const isHiker = props.userPower === 'hiker'
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
      e.preventDefault()
    }
    let dataInizio=hike.hike.start_point_datetime.split("T")[0]
    let oraInizio=hike.hike.start_point_datetime.split("T")[1].split(".000Z")
    let dataFine=hike.hike.end_point_datetime.split("T")[0]
    let oraFine=hike.hike.end_point_datetime.split("T")[1].split(".000Z")
    return (<>
      <Card style={{ width: '21rem' }} key={0} title={hike.hike.title}>
        <Card.Body>
          <Card.Title>{hike.hike.title}</Card.Title>
  
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Starting Date: {dataInizio} </ListGroup.Item>
          <ListGroup.Item>Starting Time: {oraInizio} min</ListGroup.Item>
          <ListGroup.Item>Ending Date: {dataFine} </ListGroup.Item>
          <ListGroup.Item>Ending Time: {oraFine} min</ListGroup.Item>
          <ListGroup.Item>Length: {hike.hike.length}km</ListGroup.Item>
          <ListGroup.Item>Ascent: {hike.hike.ascent}m</ListGroup.Item>
          <ListGroup.Item>Difficulty: {hike.hike.difficulty}</ListGroup.Item>  
        </ListGroup>
        <Card.Body>
          <Card.Text>
            <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
            {' '}
            {(hike.hike.file !== "NTF") ? <Button onClick={() => setModalMapShow(true)}>Display Your Track</Button> : ""}
          </Card.Text>
        </Card.Body>
      </Card>
      <HikeModalDescription
        id={hike.hike.id}
        show={modalDescriptionShow}
        visible={modalDescriptionShow}
        onHide={() => setModalDescriptionShow(false)}
        title={hike.hike.title}
        description={hike.hike.description}
        rpList={hike.hike.rp}
        condition = {hike.hike.condition}
        condition_description = {hike.hike.condition_description}
        picture={hike.hike.picture}
      />
      <HikeModalTrack
        id={hike.hike.id}
        show={modalMapShow}
        visible={modalMapShow}
        onHide={() => setModalMapShow(false)}
        title={hike.hike.title}
        sp={[hike.hike.start_point_lat, hike.hike.start_point_lng]}
        ep={[hike.hike.end_point_lat, hike.hike.end_point_lng]}
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
    );
  }
  
  
  
  function HikeModalDescription(props) {
    const [image, setImage] = useState('')
    const token = localStorage.getItem("token")

    useEffect(() => {
      async function getImage(){
        console.log(props.id)
        const img = await API.getHikePicture(props.id, token)
        setImage(img)
      }
      if(props.visible && !image)
      getImage()
    },[props.visible])
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
        
        { image !== "" ? <img src={"data:image/png;base64,"+image}></img>: <TheSpinner/>}

          <h4 className="mt-3">Description</h4>
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
    const [file, setFile] = useState('')
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
        } 
      }
      if(props.visible && !file){
        getFile()
      }
    },[props.visible])
  console.log(file)
  
    return (
      !error ?
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
            {file ? <Map rpList={props.rpList} sp={props.sp} ep={props.ep} gpxFile={file} /> : <TheSpinner/>}
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
  
import { useEffect,useState } from "react"
import { Card, Button, Form, Alert } from "react-bootstrap"
import { MapContainer, Polyline, TileLayer, useMapEvents,Marker, Popup } from "react-leaflet"
import { Icon } from 'leaflet'
import { DateTime } from 'react-datetime-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import API from "../API"
import { useNavigate } from "react-router-dom";
import GpxParser from 'gpxparser';
import { Flag } from "@mui/icons-material"
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import UTILS from "../utils/utils";
import { Last } from "react-bootstrap/esm/PageItem";
import TimeModal from "./timeModal";
import TheSpinner from "./spinner";
const myIconSp = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const myIconEp = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const myIconRp = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const myIconRpCurr = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const myIconTp = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function OnGoingHike(props){
    const [no, setNo] = useState("loading")
    const [hike, setHike] = useState({})
    const [fileMap, setFileMap] = useState('')
    const [title, setTitle] = useState('')
    const [rpList, setRpList] = useState([])
    const [sp, setSp] = useState({})
    const [ep, setEp] = useState({})
    const [curr, setCurr] = useState("-")
    const [time, setTime] =useState(dayjs())
    const [errorMessage, setErrorMessage] = useState('')
    const [errorMessageModal, setErrorMessageModal] = useState('')
    const [errorMessageEndModal, setErrorMessageEndModal] = useState('')
    const [successMessage, setSuccessMessage] =useState('')
    const [reachedPoints, setReacheadPoints] = useState([])
    const [last, setLast] = useState("")
    const [modal, setModalShow] = useState(false);
    const [modalEnd, setModalEndShow] = useState(false)
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const updateRpList = (orderedRpList) => {
      let reversed = orderedRpList.reverse()
      let reachFlag = false
      setRpList(reversed.map((h,idx) => {
        if(h.reached)
          reachFlag = true
        h.reached = reachFlag
        return h
      }).reverse())
    }

    const showModal = () => {
      if(curr==="-"){
        setErrorMessage("Please select a reference point")
        return
      }
      setModalShow(true)
    }
    const  handleSubmit = async (e) => {
      e.preventDefault()
      if(curr==="-"){
        setErrorMessageModal("Please select a reference point")
        return false
      }
      
      if(time.isBefore(last) || time.isSame(last)){
        setErrorMessageModal("The last point was reached at " + time.format("HH:mm:ss on DD/MM/YYYY") + ". Please insert a valid datetime")
        return false
      }
      const index = rpList.findIndex((rp) => rp.reference_point_address === curr)
      rpList[index].datetime = time
      const point = rpList[index]
      const body = {
        state: 'reference',
        point : point, 
        datetime: time.format('MM/DD/YYYY HH:mm:ss'),
        
      }
      
    
      try {
        const resp = await API.postReachedReferencePoint(body, token)
        if(resp.error)
          setErrorMessage(resp.msg)
        else{
          updateRpList(rpList.map((r,idx)=> {
            if(idx === index)
              r.reached = true
            return r
          }))
          setCurr("-")
          setSuccessMessage("Your position has been updated")
          return true
        }
    } catch(e){

      setErrorMessage("Something went wrong. Please try later")
      return false
    }
  }

  const handleTerminate = async (e) => {
    e.preventDefault()
    
    if(time.isBefore(last) || time.isSame(last)){
      setErrorMessageModal("The last point was reached at " + time.format("HH:mm:ss on DD/MM/YYYY") + ". Please insert a valid datetime")
      return false
    }
    try {
      const body = {
        state: 'end',
        datetime: time.format('MM/DD/YYYY HH:mm:ss'),
      }
      const resp = await API.postTerminatedHike(body, token)
      if(resp.error){
          setErrorMessage(resp.msg)
          return false
      }
        else{
          navigate("/hiker/hikes")
          return true
      }
    }
      catch(e){
        setErrorMessage("Something went wrong. Please try later")
        return true
      } 
  }
    useEffect(() => {
      async function getHike() {
<<<<<<< HEAD
        const t = "Sentiero per il ROCCIAMELONE"        
        let h = (await API.getHike(t, token)).hike
        console.log(h)
        setHike(h)
        setTitle(h.title)
        h.reached = [{}]
        const rp = []
        for(let i = 0; i < h.rp.length; i++){
          let flag = h.reached.includes((r) => 
          r.reference_point_lat===h.rp[i].reference_point_lat &&
          r.reference_point_lng===h.rp[i].reference_point_lng);
          h.rp[i].reached = flag
          rp.push(h.rp[i])
        }
        setSp({
          lat: h.start_point_lat,
          lng: h.start_point_lng,
          addr: h.start_point_address
        })
        setEp({
          lat: h.end_point_lat,
          lng: h.end_point_lng,
          addr: h.end_point_address
        })
=======
        try {
        const currentHike = await API.getCurrentHike(token)   
        if(!currentHike.error) {
          setNo("loaded")
          const res =  UTILS.adjustRecord(currentHike.msg)
          console.log(res)
          const h = res[0]
          const rp = res[1]
          const lastDt = res[2]
          console.log(h, rp, lastDt)

          setHike(h)
          setTitle(h.title)
          setLast(lastDt)
          setSp({
            lat: h.start_point_lat,
            lng: h.start_point_lng,
            addr: h.start_point_address,
            datetime: h.start_point_datetime
          })

>>>>>>> 5d8bee1f2ed7927265d9fd330effc9046c6418ba

          setEp({
            lat: h.end_point_lat,
            lng: h.end_point_lng,
            addr: h.end_point_address,
            datetime: h.end_point_datetime
          })

          setRpList(rp)
          setReacheadPoints(h.reached)
          let file = await API.getHikeFile(h.id, token)
          setFileMap(file)
        } 
      else {
          console.log("okk")
          setNo("")
      }
      }catch(e){
        setErrorMessage("Something went wrong ")
      }
        
      }
      getHike()
    },[])

    
    const updateTime = (curr) => {
      if(!curr instanceof String)
        setTime(curr)
      else{
        setTime(dayjs(curr,"MM/DD/YYYY hh:mm A"))
      }
      
    }
    return (
      <>
      {!no ? <h2>There isn't an ongoing hike</h2>
      :
      <><h1>Current Hike</h1>
      <Card>
      <Card.Body>
          <Card.Title><h4>{title}</h4></Card.Title>
          {fileMap? <Map  className="mb-4" gpxFile={fileMap} rpList={rpList} setRpList={updateRpList} sp={sp} ep={ep} curr={curr} setCurr={setCurr}/> : <TheSpinner/>}
          <Form className="my-4">
            <Form.Group className="mb-2" controlId="position">
            <Form.Label>Track your position</Form.Label>
            <Form.Select id="referencePoints" value={curr} onChange={e => setCurr(e.target.value)}>
              <option value ="-" key="-">-</option>
              {rpList.filter((r) => !r.reached)
              .map((r,idx) => <option value={r.reference_point_address} key={r.reference_point_address}>{r.reference_point_address}</option>)}
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" controlId="datetime">
            
            {errorMessage ? <Alert variant='danger' className="mt-2" onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : ''}
            {successMessage ? <Alert id="success" variant='success' className="mt-2" onClose={() => setSuccessMessage('')} dismissible >{successMessage}</Alert> : ''}
            </Form.Group>
            <Button id="updatePosition" onClick={() => showModal()}>Update Position</Button> {' '}
            <Button id="endHike" variant="danger" onClick={() => setModalEndShow(true)}>Terminate the hike</Button>
            <TimeModal
            type={"reference"}
            show={modal}
            time={time}
            updateTime={updateTime}
            onHide={() => setModalShow(false)}
            errorMessage={errorMessageModal}
            setErrorMessage={setErrorMessageModal}
            handleSubmit={handleSubmit}
            />
            <TimeModal
            type={"end"}
            show={modalEnd}
            time={time}
            updateTime={updateTime}
            onHide={() => setModalEndShow(false)}
            errorMessage={errorMessageModal}
            setErrorMessage={setErrorMessageEndModal}
            handleSubmit={handleTerminate}
            />

          </Form>
      </Card.Body>
    </Card></>}
    </>
    )
}


function Map(props){
  const [positions, setPositions] = useState([])
  const gpxFile = props.gpxFile
  const rpList = props.rpList.map((pos,idx) => {

    return (
    <Marker position={[pos['reference_point_lat'],pos['reference_point_lng']]} 
    icon={props.curr !== pos['reference_point_address'] ? 
      (!pos.reached? myIconRp: myIconTp): 
      myIconRpCurr} 
    key={idx}
    eventHandlers={{
      click: () =>  {
        if(!pos.reached)
        props.setCurr(pos['reference_point_address'])
      }}}>
        <Popup>
            Reference Point: <>{pos['reference_point_address']}{
            pos.datetime?<div>Reached at: {
            pos.datetime.format("HH:mm:ss DD/MM/YYYY")}</div>:''}</>
        </Popup>
    </Marker>)
  })
  
  let spMarker = null
  if(props.sp['lat'] && props.sp['lng']){
        spMarker =(
        <Marker position={[props.sp.lat,props.sp.lng]} icon={myIconSp} >
          <Popup>
              Start point: <>{props.sp.addr}{
            props.sp.datetime?<div>Reached at: {
            props.sp.datetime.format("HH:mm:ss DD/MM/YYYY")}</div>:''}</>
          </Popup>
        </Marker>)
  }
  let epMarker = null
  if(props.ep.lat && props.ep.lng)
        epMarker =(
        <Marker position={[props.ep.lat,props.ep.lng]} icon={myIconEp} >
          <Popup>
              End point: <>{props.ep.addr}{
            props.ep.datetime?<div>Reached at: {
            props.ep.datetime.format("HH:mm:ss DD/MM/YYYY")}</div>:''}</>
          </Popup>
        </Marker>)
  useEffect(() => {
    if(props.gpxFile !== ''){
        const gpx = new GpxParser()
        gpx.parse(props.gpxFile)
        let idx = 0
        let orderedRpList = []
        const pos = gpx.tracks[0].points.map(p => {
            if(idx < props.rpList.length && 
              p.lat === props.rpList[idx].reference_point_lat && 
              p.lon===props.rpList[idx].reference_point_lng){
              orderedRpList.push(props.rpList[idx])
              idx++
            }
            
            return [p.lat, p.lon]})
        props.setRpList(orderedRpList)
        setPositions(pos)
    }
    }
  ,[gpxFile])

  return (
    <MapContainer 
        center={[45.07104275068942, 7.677664908245942]} zoom={13} scrollWheelZoom={false} style={{height: '400px'}}>
        <Click sp={props.sp}/>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline
            pathOptions={{ fillColor: 'red', color: 'blue' }}
            positions={
            positions
        }
        />
        {rpList}
        {spMarker}
        {epMarker}
    </MapContainer>
)
}


function Click(props){
  const [sp, setSp] = useState([])
  const map = useMapEvents({
      
  })
  if(props.sp.lat && props.sp.lng && sp[0] !== props.sp.lat && sp[1] !== props.sp.lng){
    setSp([props.sp.lat, props.sp.lng])
    map.flyTo([props.sp.lat, props.sp.lng], undefined, {animate: false})
  }
  return null
}

export default OnGoingHike
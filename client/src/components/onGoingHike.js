import { useEffect,useState } from "react"
import { Card, Button, Form } from "react-bootstrap"
import { MapContainer, Polyline, TileLayer, useMapEvents,Marker, Popup } from "react-leaflet"
import { Icon } from 'leaflet'
import { DateTime } from 'react-datetime-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import API from "../API"
import GpxParser from 'gpxparser';
import { Flag } from "@mui/icons-material"
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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
    const [hike, setHike] = useState({})
    const [fileMap, setFileMap] = useState('')
    const [title, setTitle] = useState('')
    const [rpList, setRpList] = useState([])
    const [sp, setSp] = useState({})
    const [ep, setEp] = useState({})
    const [curr, setCurr] = useState("-")
    const [time, setTime] =useState(dayjs())
    const [reachedPoints, setReacheadPoints] = useState([])
    const token = localStorage.getItem("token")
    useEffect(() => {
      async function getHike() {
        const t = "Sentiero per il ROCCIAMELONE"
        const h = (await API.getHike(t, token)).hike
        setHike(h)
        setTitle(h.title)
        const rp = []
        for(let i = 0; i < h.rp.length; i++){
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
        setRpList(rp)
        let file = await API.getHikeFile(h.id, token)
        setFileMap(file)
      }
      getHike()
    },[])
    
    return (
      <>
      <h1>Current Hike</h1>
      <Card>
      <Card.Body>
          <Card.Title><h4>{title}</h4></Card.Title>
          <Map  className="mb-4" gpxFile={fileMap} rpList={rpList} sp={sp} ep={ep} curr={curr} setCurr={setCurr}/>
          <Form className="my-4">
            <Form.Group className="mb-2" controlId="position">
            <Form.Label>Track your position</Form.Label>
            <Form.Select value={curr} onChange={e => setCurr(e.target.value)}>
              <option value ="-">-</option>
              {rpList.map((r,idx) => <option value={r.reference_point_address}>{r.reference_point_address}</option>)}
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" controlId="datetime">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label=""
                value={time}
                onChange={(newValue) => {
                setTime(newValue);
            }}
            />
            </LocalizationProvider>
            </Form.Group>
            <Button>Update Position</Button> {' '}
            <Button variant="danger">Terminate the hike</Button>

          </Form>
      </Card.Body>
    </Card>
    </>
    )
}


function Map(props){
  const [positions, setPositions] = useState([])
  const gpxFile = props.gpxFile
  const rpList = props.rpList.map((pos,idx) => {

    return (
    <Marker position={[pos['reference_point_lat'],pos['reference_point_lng']]} 
    icon={props.curr !== pos['reference_point_address'] ? myIconRp : myIconRpCurr} 
    key={idx}
    eventHandlers={{
      click: () =>  {
        props.setCurr(pos['reference_point_address'])
      }}}>
        <Popup>
            Reference Point: {pos['reference_point_address']}
        </Popup>
    </Marker>)
  })
  
  let spMarker = null
  if(props.sp['lat'] && props.sp['lng']){
        spMarker =(
        <Marker position={[props.sp.lat,props.sp.lng]} icon={myIconSp} >
          <Popup>
              Start point: {props.sp.addr}
          </Popup>
        </Marker>)
  }
  let epMarker = null
  if(props.ep.lat && props.ep.lng)
        epMarker =(
        <Marker position={[props.ep.lat,props.ep.lng]} icon={myIconEp} >
          <Popup>
              End point: {props.ep.addr}
          </Popup>
        </Marker>)
  useEffect(() => {
    if(props.gpxFile !== ''){
        const gpx = new GpxParser()
        gpx.parse(props.gpxFile)
        const pos = gpx.tracks[0].points.map(p => [p.lat, p.lon])
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
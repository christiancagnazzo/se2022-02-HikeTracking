import {  Form, Row, Button, Card, InputGroup, Col } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents,Circle } from 'react-leaflet'
import GeographicalFilter from "./geographicalfilter";


  

function FilterForm(props) {
  const [minLength, setMinLength] = useState('')
  const [maxLength, setMaxLength] = useState('')

  const [minTime, setMinTime] = useState('')
  const [maxTime, setMaxTime] = useState('')

  const [minAscent, setMinAscent] = useState('')
  const [maxAscent, setMaxAscent] = useState('')

  const [difficulty, setDifficulty] = useState("All")

  const[province, setProvince] = useState('-')
  const[village, setVillage] = useState("")
  const[radius, setRadius] = useState(50)
  const [position, setPosition] = useState("")
  
  let token = localStorage.getItem("token");
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const filter = {
        minLength: minLength,
        maxLength: maxLength,
        minTime: minTime,
        maxTime: maxTime,
        minAscent: minAscent,
        maxAscent: maxAscent,
        difficulty: difficulty,
        province: province,
        village: village,
        position: position,
        radius: radius
    }
    props.applyFilter(filter)
    props.setFiltered(true)
    navigate("/hikes")
    
  }

  const checkNum = (num, callback) => {
    if (!isNaN(num)) {
      return callback(num);
    }
    return false
  }

  const clearState = () =>{
    setMinLength('')
    setMaxLength('')
    setMinTime('')
    setMaxTime('')
    setMinAscent('')
    setMaxAscent('')
    setDifficulty("All")
    setProvince('-')
    setVillage("")
    setRadius(50)
    setPosition("")
  }
  

  return (
    <Card body>
      <Form>
      <Row className="mb-2"> 
      <Form.Label htmlFor="basic-url">Length (in kms)</Form.Label>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minLength}
            onChange={(e) => checkNum(e.target.value, setMinLength)}
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxLength}
            onChange={(e) => checkNum(e.target.value, setMaxLength)}
          />
        </InputGroup>
      </Col>
    </Row>
        
    <Row className="mb-2">
      <Form.Label htmlFor="basic-url">Expected time (in min)</Form.Label>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minTime}
            onChange={(e) => checkNum(e.target.value, setMinTime)}
            
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxTime}
            onChange={(e) => checkNum(e.target.value, setMaxTime)}
          />
        </InputGroup>
      </Col>
    </Row>
    <Row className="mb-2">
      <Form.Label htmlFor="basic-url">Ascent (in meters)</Form.Label>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minAscent}
            onChange={(e) => checkNum(e.target.value, setMinAscent)}
            
          />
        </InputGroup>
      </Col>
      <Col >
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxAscent}
            onChange={(e) => checkNum(e.target.value, setMaxAscent)}
          />
        </InputGroup>
      </Col>
    </Row>
    
    <Form.Group className="mb-2" controlId="ascent">
        <Form.Label>Difficulty</Form.Label>
        <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="All" >All</option>
        <option value="Tourist" >Tourist</option>
        <option value="Hiker" >Hiker</option>
        <option value="Pro Hiker" >Pro Hiker</option>
        </Form.Select>
    </Form.Group>
    <GeographicalFilter 
    position={position} 
    setPosition={setPosition} 
    radius={radius} 
    setRadius={setRadius}
    province={province}
    setProvince={setProvince}
    village={village}
    setVillage={setVillage}
     />
  
    <Button variant="primary" type="submit" onClick={handleSubmit}>
        Apply
    </Button>
    &nbsp;
    <Button variant = "danger" onClick = {clearState}>
      Reset
    </Button>
    </Form>
    </Card>
  )

}


function MapFunction(props) {
  const map = useMapEvents({
    click: (e) => {
      props.setPosition(e.latlng)
    },
    locationfound: (e) => {
      props.setCenter(e.latlng)
      map.flyTo(e.latlng)
    }
  })
  useEffect(() => {
    map.locate()
    
  },[]) 
  return null
}

function FilterMap(props){
  const [center, setCenter] = useState([45.07104275068942, 7.677664908245942])
  
  return(
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{height: '400px'}} onClick={(e) => console.log(e) }>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.position !==""?<Circle center={props.position}  radius={props.radius}/>:''}  
            <MapFunction setCenter={setCenter} setPosition={props.setPosition}/>
            {/*position !==""?<Marker position={position} icon={myIconSp}>
            <Popup>
                Reference Point: {"ok"}
            </Popup>
  </Marker> : ''*/}
    </MapContainer>
  )
}

export default FilterForm
import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { json, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'
import Hike from "./hikes";
import Multiselect from 'multiselect-react-dropdown';


const services_list = ["Showers","Mobile phone reception","Seminar room", "Water supply", "Mattresses", "Heating (with fuel)"]

const services_list_mapped = services_list.map((s,idx) => {
  return {
    'name' : s,
    'id': idx
  }
})


function HikeForm(props) {
  const [name, setName] = useState('Rifugio La Riposa')
  const [position, setPosition] = useState([45.178562524475275, 7.081797367594325])
  const [address, setAddress] = useState('Frazione La Riposa 10059 Mompantero, Susa TO')
  const [desc, setDesc] = useState('First Hut to be uploaded')
  const [fee, setFee] = useState(10)
  const [services, setServices] = useState([])
  const [n_beds,setNBeds] = useState(10)
  let [errorMessage, setErrorMessage] = useState('')
  let navigate = useNavigate();
  let [huts, setHuts] = useState([])
  let [parkingLots, setParkingLots] = useState([])

  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hutDescription = {
      'name': name,
      'fee': fee,
      'services': services,
      'desc': desc,
      'address': address,
      'latitude': position[0],
      'longitude': position[1],
      'n_beds': n_beds
    }
    let req = await API.createHut(hutDescription, token)
    console.log(req)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
      navigate('/')
    }

  }


  const checkNum = (num) => {
    if (!isNaN(num)) {
      return true;
    }
    return false
  }
  const setPoint = (point) => {
    if (!isNaN(point[0]) && !isNaN(point[1])) {
    
        setPosition(point)

    }
  }

  

  

  


  useEffect(() => {
    const getHuts = async function () {
      let req = await API.getAllHuts(token)
      if (req.error) {
        setErrorMessage(req.msg)
      } else {
        let all_huts = []
        req.msg.forEach((el) => all_huts.push({ "hutId": el.id, "hutName": el.name, "lat": el.lat, "lon": el.lon }))
        setHuts(all_huts)
      }
    }

    getHuts()
  }, [])

  /*useEffect(() => {
    const getParkingLots = async function () {
      let req = await API.getAllParkingLots(token)
      if (req.error) {
        setErrorMessage(req.msg)
      } else {
        let all_plot = []
        req.msg.forEach((el) => all_plot.push({ "parkingLotId": el.id, "parkingLotName": el.name, "lat": el.lat, "lon": el.lon }))
        setParkingLots(all_plot)
      }
    }

    getParkingLots()
  }, [])*/


  return (
    <Card body>
      <Form>
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter title" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="fee">
          <Form.Label>Fee per night (in €)</Form.Label>
          <Form.Control type="text" placeholder="Expected time" value={fee} onChange={(e) => { if (checkNum(e.target.value)) { setFee(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="n_beds">
          <Form.Label>Number of beds</Form.Label>
          <Form.Control type="text" placeholder="Ascent" value={n_beds} onChange={(e) => { if (checkNum(e.target.value)) { setNBeds(e.target.value) } }} />
        </Form.Group>
        
        <Form.Label>Services</Form.Label>
        <Multiselect className="mb-2"
        options={services_list_mapped} // Options to display in the dropdown
        selectedValues={services} // Preselected value to persist in dropdown
        onSelect={(e) => {setServices(e)}} // Function will trigger on select event
        onRemove={(e) => {setServices(e)}} // Function will trigger on remove event
        displayValue="name" // Property name to display in the dropdown options
        />
        <PointInput point={position} setPoint = {setPosition} address={address} setAddress={setAddress} />
       
        {' '}
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : false}
    </Card>

  )

}



function PointInput(props) {
  
  return (
    <Row className="mb-3">
            <Form.Label htmlFor="basic-url">Position</Form.Label>

      <Col>
      <InputGroup size="sm" >
        <InputGroup.Text id="inputGroup-sizing-default" >
          Lat
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value={props.point[0]} onChange={(e) => props.setPoint([e.target.value, props.point[1]], props.which)}
        />
      </InputGroup>
    </Col>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default">
            Lng
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={props.point[1]} onChange={(e) => props.setPoint([props.point[0], e.target.value], props.which)}
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="">
          <InputGroup.Text id="inputGroup-sizing-default">
            Addr
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={props.address}
            onChange={(e) => props.setAddress(e.target.value)}
          />
        </InputGroup>
      </Col>
    </Row>

  )
}

export default HikeForm

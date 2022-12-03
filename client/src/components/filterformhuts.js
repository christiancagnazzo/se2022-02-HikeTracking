import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'
import { Icon } from 'leaflet'
import Multiselect from "multiselect-react-dropdown";
import GeographicalFilter from "./geographicalfilter";
const myIconSp = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



function FilterFormHuts(props) {
  const navigate = useNavigate()
  const [minBed, setMinBed] = useState('')
  const [maxFee, setMaxFee] = useState('')
  const [servicesList, setServicesList] = useState([])
  const [services, setServices] = useState([])
  /*const [province, setProvince] = useState([])
  const [village, setVillage] = useState("")
  const [radius, setRadius] = useState(50)
  const [position, setPosition] = useState("")*/
  let [errorMessage, setErrorMessage] = useState('')

  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filter = {
      nbeds: minBed,
      fee: maxFee,
      services: services
    }
    props.applyFilter(filter)
    navigate("/hiker/huts")
  }

  const checkNum = (num, callback) => {
    if (!isNaN(num)) {
      return callback(num);
    }
    return false
  }

  useEffect(() => {
    const getFacilities = async function () {
      let req = await API.getFacilities(token)
      if (req.error) {
        setErrorMessage(req.msg)
      } else {
        setServicesList(req.msg)
      }
    }

    getFacilities()
  }, [])

  return (
    <Card body>
      <Form>
        <Row className="mb-2">
          <Col>
            <Form.Label htmlFor="basic-url">Minimum #beds</Form.Label>
            <InputGroup size="sm" className="">
              <InputGroup.Text id="inputGroup-sizing-default" >
                Min
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                value={minBed}
                onChange={(e) => checkNum(e.target.value, setMinBed)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label htmlFor="basic-url">Maximum fee per night</Form.Label>
            <InputGroup size="sm" className="">
              <InputGroup.Text id="inputGroup-sizing-default">
                Max
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                value={maxFee}
                onChange={(e) => checkNum(e.target.value, setMaxFee)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Form.Label htmlFor="basic-url">Services</Form.Label>
        <Multiselect className="mb-2"
          options={servicesList} // Options to display in the dropdown
          selectedValues={services} // Preselected value to persist in dropdown
          onSelect={(e) => { setServices(e) }} // Function will trigger on select event
          onRemove={(e) => { setServices(e) }} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />

        {/*
    <GeographicalFilter 
    position={position} 
    setPosition={setPosition} 
    radius={radius} 
    setRadius={setRadius}
    province={province}
    setProvince={setProvince}
     />
     */}

        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Apply
        </Button>
      </Form>
    </Card>
  )

}




export default FilterFormHuts
import {  Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import {  useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Multiselect from 'multiselect-react-dropdown';


function HikeForm(props) {
  const [name, setName] = useState('Rifugio La Riposa')
  const [position, setPosition] = useState([45.078562524475275, 7.181797367594325])
  const [address, setAddress] = useState('Frazione La Riposa 10059 Mompantero, Susa TO')
  const [desc, setDesc] = useState('First Hut to be uploaded')
  const [fee, setFee] = useState(10)
  const [services, setServices] = useState([])
  const [n_beds, setNBeds] = useState(10)
  const [ascent, setAscent] = useState(200)
  const [phone, setPhone] = useState("3333333331")
  const [email, setEmail] = useState("hut@mail.com")
  const [webSite, setWebSite] = useState("www.hut.com")
  let [errorMessage, setErrorMessage] = useState('')
  let navigate = useNavigate();
  const [servicesList, setServicesList] = useState([])
  const [hikes, setHikes] = useState([])
  const [hikesChoosen, setHikesChoosen] = useState([])
  

  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hutDescription = {
      'name': name,
      'fee': fee,
      'services': services.map(s => s['name']),
      'desc': desc,
      'position': { 'latitude': position[0], 'longitude': position[1], 'address': address },
      'n_beds': n_beds,
      'relatedHike': hikesChoosen.map( (h) => h.id),
      'ascent': ascent,
      'phone': phone,
      'email': email,
      'web_site': webSite
    }
    let req = await API.createHut(hutDescription, token)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
      navigate('/localguide/huts')
      props.updateDirty()
    }
  }


  const checkNum = (num) => {
    return !isNaN(num)
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
  }, [token])

  useEffect(() => {
    const getHikes = async function () {
      let req = await API.getAllHikes(token)
      if (req.error) {
        setErrorMessage(req.msg)
      } else {
        setHikes(req.msg)
      }
    }

    getHikes()
  }, [token])

  const setPoint = (point) => {
    if (!isNaN(point[0]) && !isNaN(point[1])) {
      setPosition(point)

    }
  }


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
        <Form.Group className="mb-2" controlId="acent">
          <Form.Label>Ascent</Form.Label>
          <Form.Control type="text" placeholder="Enter ascent" value={ascent} onChange={(e) => setAscent(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="website">
          <Form.Label>Web Site</Form.Label>
          <Form.Control type="text" placeholder="Enter web site" value={webSite} onChange={(e) => setWebSite(e.target.value)} />
        </Form.Group>

        <Form.Label>Services</Form.Label>
        <Multiselect className="mb-2"
          options={servicesList} // Options to display in the dropdown
          selectedValues={services} // Preselected value to persist in dropdown
          onSelect={(e) => { setServices(e) }} // Function will trigger on select event
          onRemove={(e) => { setServices(e) }} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
        <PointInput point={position} setPoint={setPoint} address={address} setAddress={setAddress} />
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hikes</Form.Label>
          <Multiselect className="mb-2"
            options={hikes} // Options to display in the dropdown
            selectedValues={hikesChoosen} // Preselected value to persist in dropdown
            onSelect={(e) => { setHikesChoosen(e) }} // Function will trigger on select event
            onRemove={(e) => { setHikesChoosen(e) }} // Function will trigger on remove event
            displayValue="title" // Property name to display in the dropdown options
          />
        </Form.Group>
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

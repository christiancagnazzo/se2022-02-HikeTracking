import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { json, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'


function LocalGuide(props) {
  const [title, setTitle] = useState('Sentiero per il ROCCIAMELONE	')
  const [length, setLength] = useState(9)
  const [time, setTime] = useState(240)
  const [ascent, setAscent] = useState(3538)
  const [difficulty, setDifficulty] = useState("Tourist")
  const [sp, setSp] = useState([45.177786, 7.083372	])
  const [addressSp, setAddressSp] = useState('Dummy start	')
  const [ep, setEp] = useState([45.203531, 7.07734	])
  const [addressEp, setAddressEp] = useState('Dummy ending')
  const [rp, setRp] = useState(['', ''])
  const [addressRp, setAddressRp] = useState('')
  const [rpList, setRpList] = useState([])
  const [desc, setDesc] = useState('First hike to be uploaded	')
  const [file, setFile] = useState('')
  const [readFile, setReadFile] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  
  const handleSubmit = async (event) => {
    console.log("submit");
    event.preventDefault();
    const formData = new FormData()
    formData.append('File', file)
    const hikeDescription = {
      'title' : title,
      'length' : length,
      'expected_time': time,
      'ascent' : ascent,
      'difficulty': difficulty,
      'start_point_lat' : sp[0],
      'start_point_lng' : sp[1],
      'start_point_address' : addressSp,
      'end_point_lat' : ep[0],
      'end_point_lng' : ep[1],
      'end_point_address' : addressEp,
      'description' : desc,
      'rp_list': rpList
    }
    let req = await API.createHike(hikeDescription, formData, token)
    if (req.error){
      setErrorMessage(req.msg)
    } else {
      navigate('/')
    }
    
  }
  const handleInputFile = (e) =>{
            //gpx analyses and input
            let gpxParser = require('gpxparser');
            let gpx = new gpxParser(); //Create gpxParser Object
            //setErrorMessage('test node2')
        var objFile = e.target.files[0];
        //setErrorMessage(e.innerHTML);
        //var files = inp.prop('files');
        if(objFile.length == 0){
        }else{
            var reader = new FileReader();
            reader.readAsText(objFile, "UTF-8");
            reader.onload = function(evt){
                var fileString = evt.target.result; 
                console.log(fileString);
                gpx.parse(fileString);
                var totalDistance = gpx.tracks[0].distance.total;
                //setErrorMessage('44')
                let start_point_lat = totalDistance.lat;
                let start_point_lng = totalDistance.lng;
                let start_point_address = totalDistance.address;
                totalDistance = gpx.tracks[0].distance.total;
                //setErrorMessage('44')
                let end_point_lat = totalDistance.lat;
                let end_point_lng = totalDistance.lng;
                let end_point_address = totalDistance.address;
        }     
          } 
  }
  

  const checkNum = (num) => {
    if (!isNaN(num)) {
      return true;
    }
    return false
  }
  const setPoint = (point, which) => {
    if (!isNaN(point[0]) && !isNaN(point[1])) {
      if (!which)
        setSp(point)
      else
        setEp(point)
    }
  }

  const setRPoint = (point) => {
    if (!isNaN(point[0]) && !isNaN(point[1])) {
      setRp(point)

    }
  }

  const addRPoint = () => {
    if (rp[0] === '' || rp[1] === '') return
    const point = {
      reference_point_lat: rp[0],
      reference_point_lng: rp[1],
      reference_point_address: addressRp
    }
    setRPoint(['', ''])
    setAddressRp('')
    setRpList([...rpList, point])
  }

  const cleanRPoint = () => {
    setRpList([])
  }

  useEffect(() => {
    if(file!==''){
      const fr = new FileReader()
      fr.readAsText(file)
      fr.onload = () => {
        setReadFile(fr.result)
      }
    }
  },[file])
  return (
    <Card body>
      <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="length">
          <Form.Label>Length (kms)</Form.Label>
          <Form.Control type="text" placeholder="Length" value={length}
            onChange={(e) => { if (checkNum(e.target.value)) { setLength(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="time">
          <Form.Label>Expected time</Form.Label>
          <Form.Control type="text" placeholder="Expected time" value={time} onChange={(e) => { if (checkNum(e.target.value)) { setTime(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="ascent">
          <Form.Label>Ascent (meters)</Form.Label>
          <Form.Control type="text" placeholder="Ascent" value={ascent} onChange={(e) => { if (checkNum(e.target.value)) { setAscent(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="ascent">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="Tourist">Tourist</option>
            <option value="Hiker">Hiker</option>
            <option value="Pro Hiker">Pro Hiker</option>
          </Form.Select>
        </Form.Group>
        <PointInput label="Start Point" point={sp} setPoint={setPoint} which={0} address={addressSp} setAddress={setAddressSp} />
        <PointInput label="End Point" point={ep} setPoint={setPoint} which={1} address={addressEp} setAddress={setAddressEp} />
        <RefPoint point={rp} setPoint={setRPoint} address={addressRp} setAddress={setAddressRp} addPoint={addRPoint} removeAll={cleanRPoint} />
        <Card>
          <Map sp={sp} ep={ep} spAddress={addressSp} epAddress={addressEp} rpList={rpList} gpxFile={readFile}></Map>
        </Card>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="end-point">
          <label htmlFor="formFile" className="form-label">Track file</label>
          <input className="form-control" type="file" id="formFile" accept=".gpx" onChange={handleInputFile}></input>

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

function RefPoint(props) {
  return (<>
    <Row>
      <Form.Label htmlFor="basic-url">Reference Point</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Lat
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={props.point[0]}
            onChange={(e) => props.setPoint([e.target.value, props.point[1]])}
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Lng
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={props.point[1]}
            onChange={(e) => props.setPoint([props.point[0], e.target.value])}
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="mb-3">
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
    <Row>
      <Col>
        <Button onClick={() => props.addPoint()}>Add</Button>
      </Col>
      <Col>
        <Button variant="danger" onClick={() => props.removeAll()}>Remove All</Button>
      </Col>
    </Row>
    <br />
  </>

  )
}

function PointInput(props) {
  const label = props.label

  return (<Row>
    <Form.Label htmlFor="basic-url">{label}</Form.Label>
    <Col>
      <InputGroup size="sm" className="mb-3">
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
      <InputGroup size="sm" className="mb-3">
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
      <InputGroup size="sm" className="mb-3">
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
export default LocalGuide

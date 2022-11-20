import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { json, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'


function LocalGuide(props) {
  let [title, setTitle] = useState('Sentiero per il ROCCIAMELONE	')
  let [length, setLength] = useState(9)
  let [time, setTime] = useState(240)
  let [ascent, setAscent] = useState(3538)
  let [difficulty, setDifficulty] = useState("Tourist")
  let [sp, setSp] = useState([45.177786, 7.083372])
  let [addressSp, setAddressSp] = useState('Dummy start	')
  let [ep, setEp] = useState([45.203531, 7.07734])
  let [addressEp, setAddressEp] = useState('Dummy ending')
  let [rp, setRp] = useState(['', ''])
  let [addressRp, setAddressRp] = useState('')
  let [rpList, setRpList] = useState([])
  let [desc, setDesc] = useState('First hike to be uploaded	')
  let [file, setFile] = useState('')
  let [readFile, setReadFile] = useState('')
  let [errorMessage, setErrorMessage] = useState('')
  let navigate = useNavigate();

  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    console.log("submit");
    event.preventDefault();
    let formData = new FormData()
    formData.append('File', file)
    let hikeDescription = {
      'title': title,
      'length': length,
      'expected_time': time,
      'ascent': ascent,
      'difficulty': difficulty,
      'start_point_lat': sp[0],
      'start_point_lng': sp[1],
      'start_point_address': addressSp,
      'end_point_lat': ep[0],
      'end_point_lng': ep[1],
      'end_point_address': addressEp,
      'description': desc,
      'rp_list': rpList
    }
    let req = await API.createHike(hikeDescription, formData, token)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
      navigate('/')
    }

  }

  const handleInputFile = async (e) => {
    //gpx analyses and input
    let gpxParser = require('gpxparser');
    let gpx = new gpxParser(); //Create gpxParser Object
    //setErrorMessage('test node2')
    
    console.log(e.target.className);
    var objFile = document.getElementById("formFile").files[0];

    setErrorMessage(objFile);
    //var files = inp.prop('files');
    if (objFile.length == 0) {
    } else {
      var reader = new FileReader();  
      reader.onload = function (evt) {
        var fileString = this.result;
        setErrorMessage(fileString)
        gpx.parse(fileString);
        let track1 = gpx.tracks[0];
        let point1 = track1.points[0];
        setSp([point1.lat,point1.lon]);
        setEp([44,44]);
    }
    reader.readAsText(objFile, "UTF-8");
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
    if (file !== '') {
      const fr = new FileReader()
      fr.readAsText(file)
      fr.onload = () => {
        setReadFile(fr.result)
      }
    }
  }, [file])
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
        <PointInput id="startPoint" label="Start Point" point={sp} setPoint={setPoint} which={0} address={addressSp} setAddress={setAddressSp} />
        <PointInput id="endPoint" label="End Point" point={ep} setPoint={setPoint} which={1} address={addressEp} setAddress={setAddressEp} />
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

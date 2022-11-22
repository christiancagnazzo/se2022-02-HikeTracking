import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { json, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'
import Hike from "./hikes";
import GpxParser from 'gpxparser';

function HikeForm(props) {
  let [title, setTitle] = useState('Sentiero per il ROCCIAMELONE	')
  let [length, setLength] = useState(9)
  let [time, setTime] = useState(240)
  let [ascent, setAscent] = useState(3538)
  let [difficulty, setDifficulty] = useState("Tourist")
  let [sp, setSp] = useState(["", ""])
  let [addressSp, setAddressSp] = useState('Dummy start	')
  let [ep, setEp] = useState(["", ""])
  let [addressEp, setAddressEp] = useState('Dummy ending')
  let [rp, setRp] = useState(['', ''])
  let [addressRp, setAddressRp] = useState('')
  let [rpList, setRpList] = useState([])
  let [desc, setDesc] = useState('First hike to be uploaded')
  let [file, setFile] = useState('')
  let [readFile, setReadFile] = useState('')
  let [errorMessage, setErrorMessage] = useState('')
  let navigate = useNavigate();
  let [huts, setHuts] = useState([])
  let [parkingLots, setParkingLots] = useState([])

  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
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
    
    let gpx = new GpxParser(); //Create gpxParser Object
    //setErrorMessage('test node2')

    var objFile = document.getElementById("formFile").files[0];
    if (objFile.length == 0) {
    } else {
      var reader = new FileReader();
      reader.onload = function (evt) {
        var fileString = this.result;
        //setErrorMessage(fileString)
        gpx.parse(fileString);
        let track1 = gpx.tracks[0];
        let point1 = track1.points[0];
        setSp([point1.lat, point1.lon]);
        for (var i = 1; i < track1.points.length - 1; i++) {
          let rp = [];
          rp[i - 1] = [track1.points[i].lat, track1.points[i].lon];
        }
        let endPoint = track1.points[track1.points.length - 1];

        setEp([endPoint.lat, endPoint.lon]);

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

  useEffect(() => {
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
  }, [])


  return (
    <Card body>
      <Form>
        <Form.Group className="mb-2" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="length">
          <Form.Label>Length (kms)</Form.Label>
          <Form.Control type="text" placeholder="Length" value={length}
            onChange={(e) => { if (checkNum(e.target.value)) { setLength(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="time">
          <Form.Label>Expected time</Form.Label>
          <Form.Control type="text" placeholder="Expected time" value={time} onChange={(e) => { if (checkNum(e.target.value)) { setTime(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="ascent">
          <Form.Label>Ascent (meters)</Form.Label>
          <Form.Control type="text" placeholder="Ascent" value={ascent} onChange={(e) => { if (checkNum(e.target.value)) { setAscent(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="ascent">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="Tourist">Tourist</option>
            <option value="Hiker">Hiker</option>
            <option value="Pro Hiker">Pro Hiker</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="end-point">
          <label htmlFor="formFile" className="form-label">Track file</label>
          <input className="form-control" type="file" id="formFile" accept=".gpx" onChange={(e)=> {
            setFile(e.target.files[0]);
            handleInputFile()
          }}></input>

        </Form.Group>
        <PointInput parkingLots={parkingLots} huts={huts} setFormP={setSp} id="startPoint" label="Start Point" point={sp} setPoint={setPoint} which={0} address={addressSp} setAddress={setAddressSp} />
        <PointInput parkingLots={parkingLots} huts={huts} setFormP={setEp} id="endPoint" label="End Point" point={ep} setPoint={setPoint} which={1} address={addressEp} setAddress={setAddressEp} />
        <RefPoint point={rp} setPoint={setRPoint} address={addressRp} setAddress={setAddressRp} addPoint={addRPoint} removeAll={cleanRPoint} />
        <Card>
          <Map sp={sp} ep={ep} spAddress={addressSp} epAddress={addressEp} rpList={rpList} gpxFile={readFile}></Map>
        </Card>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
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
    <Row className="mb-3">
      <Form.Label htmlFor="basic-url">Reference Point</Form.Label>

      <Col>
        <InputGroup size="sm" >
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
        <InputGroup size="sm" className="">
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
    <Row>
      <div align="center">
        <Button onClick={() => props.addPoint()}>Add</Button>
        &nbsp; &nbsp;
        <Button variant="danger" onClick={() => props.removeAll()}>Remove All</Button>
      </div>
    </Row>
    <br />
  </>

  )
}

function PointInput(props) {
  const label = props.label
  const [selected, setSelected] = useState('GPS')

  let form = ""
  let variant1 = "dark"
  let variant2 = "outline-dark"
  let variant3 = "outline-dark"
  if (selected === "GPS") {
    variant1 = "dark"
    variant2 = "outline-dark"
    variant3 = "outline-dark"
    form = <><Col>
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
      </Col></>
  }

  if (selected === 'Hut') {
    variant1 = "outline-dark"
    variant2 = "dark"
    variant3 = "outline-dark"
    form = <Col>
      <Form.Select size="sm" onChange={(ev) => {
        let values = ev.target.value.split("-")
        props.setAddress(values[0])
        props.setFormP([values[1], values[2]])
        props.setPoint([values[1], values[2]], props.which)
      }}>
        <option key={"-1"} value={"-"}>
          -
        </option>
        {props.huts.map((option, index) => (
          <option key={index} value={option.hutName + "-" + option.lat + "-" + option.lon}>
            {option.hutName}
          </option>
        ))}
      </Form.Select>
    </Col>
  }

  if (selected === 'Parking Lot') {
    variant1 = "outline-dark"
    variant2 = "outline-dark"
    variant3 = "dark"
    form = <Col>
      <Form.Select size="sm" onChange={(ev) => {
        let values = ev.target.value.split("-")
        props.setAddress(values[0])
        props.setFormP([values[1], values[2]])
        props.setPoint([values[1], values[2]], props.which)
      }}>
        <option key={"-1"} value={"-"}>
          -
        </option>
        {props.parkingLots.map((option, index) => (
          <option key={index} value={option.parkingLotName + "-" + option.lat + "-" + option.lon}>
            {option.parkingLotName}
          </option>
        ))}
      </Form.Select>
    </Col>

  }
  return (
    <Row className="mb-3">
      <Row className="mb-3">

        <Form.Label htmlFor="basic-url">{label}</Form.Label>



        <InputGroup size="sm">
          <Button variant={variant1} className="border-right-0" onClick={() => setSelected('GPS')}>GPS</Button>
          <Button variant={variant2} onClick={() => setSelected('Hut')}>Hut</Button>
          <Button variant={variant3} onClick={() => setSelected('Parking Lot')}>P. Lot</Button>
        </InputGroup>


      </Row>




      {form}
    </Row>

  )
}

export default HikeForm

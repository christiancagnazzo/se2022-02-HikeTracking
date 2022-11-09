import { Container, Form, Row, Button, Card, InputGroup, Col } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { useState } from "react";
import API from '../API';
import Map from './map'
function LocalGuide(props){
    const [title, setTitle] = useState('')
    const [length, setLength] = useState('')
    const [time, setTime] = useState('')
    const [ascent, setAscent] = useState('')
    const [difficulty, setDifficulty] = useState(2)
    const [sp, setSp] = useState(['',''])
    const [addressSp, setAddressSp] = useState('')
    const [ep, setEp] = useState(['',''])
    const [addressEp, setAddressEp] = useState('')
    const [rp, setRp] = useState(['',''])
    const [addressRp, setAddressRp] = useState('')
    const [rpList, setRpList] = useState([])
    const [desc, setDesc] = useState('')
    const [file, setFile] = useState()
    

    const handleSubmit = (event) => {
        event.preventDefault();
    }
    const checkNum = (num) => {
        if (!isNaN(num)) {
            return true;
        } 
        return false
    }
    const setPoint = (point, which) => {
      if(!isNaN(point[0]) && !isNaN(point[1])){
        if(!which)
          setSp(point)
        else
          setEp(point)
      }
    }

    const setRPoint = (point) => {
      if(!isNaN(point[0]) && !isNaN(point[1])){
        setRp(point)
        
      }
    }

    const addRPoint = () => {
      if(rp[0] === '' || rp[1] === '') return
      const point = {
        lat: rp[0],
        lng: rp[1],
        address: addressRp
      }
      setRPoint(['',''])
      setAddressRp('')
      setRpList([...rpList,point])
    }

    const cleanRPoint = () => {
      setRpList([])
    }
    return (<Container className="below-nav">
        
      {' '}  
        <Card body>
        <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter title" value={title} onChange = {(e) => setTitle(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="length">
        <Form.Label>Length (kms)</Form.Label>
        <Form.Control type="text" placeholder="Length" value={length} 
        onChange={(e) => {if (checkNum(e.target.value)) {setLength(e.target.value)}} }/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="time">
        <Form.Label>Expected time</Form.Label>
        <Form.Control type="text" placeholder="Expected time" value={time} onChange={(e) => {if (checkNum(e.target.value)) {setTime(e.target.value)}}} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="ascent">
        <Form.Label>Ascent (meters)</Form.Label>
        <Form.Control type="text" placeholder="Ascent" value={ascent} onChange={(e) =>{if (checkNum(e.target.value)) { setAscent(e.target.value)}}}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="ascent">
        <Form.Label>Difficulty</Form.Label>
        <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="1">Tourist</option>
            <option value="2">Hiker</option>
            <option value="3">Pro Hiker</option>
        </Form.Select>
      </Form.Group>
      <PointInput label="Start Point" point={sp} setPoint={setPoint} which={0} address={addressSp} setAddress={setAddressSp}/>
      <PointInput label="End Point" point={ep} setPoint={setPoint} which={1} address={addressEp} setAddress={setAddressEp}/>
      <RefPoint point={rp} setPoint={setRPoint} address={addressRp} setAddress={setAddressRp} addPoint={addRPoint} removeAll={cleanRPoint}/>
      <Card>
          <Map sp={sp} ep={ep} spAddress={addressSp} epAddress={addressEp} rpList={rpList}></Map>
        </Card>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="end-point">
        <label htmlFor="formFile" className="form-label">Track file</label>
        <input className="form-control" type="file" id="formFile"  accept=".gpx" onChange={e => setFile(e.target.files[0])}/>
      </Form.Group>
      {' '}
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
      
    </Form>
    </Card>
    </Container>)
    
}

function RefPoint(props){
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
      <InputGroup  size="sm" className="mb-3">
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
    <br/>
    </>

  )
}

function PointInput(props){
  const label = props.label
  
  return (<Row>
    <Form.Label htmlFor="basic-url">{label}</Form.Label>
      <Col>
      <InputGroup  size="sm"className="mb-3">
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
      <InputGroup  size="sm" className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Lng
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value={props.point[1]} onChange={(e) => props.setPoint([props.point[0],e.target.value], props.which)}
        />
      </InputGroup>
      </Col>
      <Col>
      <InputGroup  size="sm" className="mb-3">
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
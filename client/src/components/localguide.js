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
    const [desc, setDesc] = useState('')
    const [file, setFile] = useState()
    const formData = new FormData()
    
    formData.append('File', file)

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
      <PointInput label="Start Point" point={sp} setPoint={setPoint} which={0} address={addressSp}/>
      <PointInput label="End Point" point={ep} setPoint={setPoint} which={1} address={addressEp}/>
      <RefPoint></RefPoint>
      <Card>
          <Map sp={sp} ep={ep}></Map>
        </Card>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="end-point">
        <label htmlFor="formFile" className="form-label">Track file</label>
        <input className="form-control" type="file" id="formFile"  accept=".gpx" onChange={e => {if (e.target.file){setFile(e.target.file[0])}}}/>
      </Form.Group>
      {' '}
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
      <Button onClick={() => API.pushFile(file)}>OKk</Button>
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
        />
      </InputGroup>
      </Col>
      
    </Row>
    <Row>
      <Col>
        <Button>Add</Button>
      </Col>
      <Col>
        <Button variant="danger">Remove All</Button>
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
        />
      </InputGroup>
      </Col>
    </Row>

  )
}
export default LocalGuide
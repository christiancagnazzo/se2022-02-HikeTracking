import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'


function FilterForm(props) {
  const [minLength, setMinLength] = useState('')
  const [maxLength, setMaxLength] = useState('')

  const [minTime, setMinTime] = useState('')
  const [maxTime, setMaxTime] = useState('')

  const [minAscent, setMinAscent] = useState('')
  const [maxAscent, setMaxAscent] = useState('')

  const [difficulty, setDifficulty] = useState(2)

  const[province, setProvince] = useState('')
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
  }

  const checkNum = (num, callback) => {
    if (!isNaN(num)) {
      return callback(num);
    }
    return false
  }
  

  

  
  return (<Container className="below-nav">
    {' '}
    <Card body>
      <Form>
      <Row>
      <Form.Label htmlFor="basic-url">Length (in kms)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
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
        <InputGroup size="sm" className="mb-3">
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
        
    <Row>
      <Form.Label htmlFor="basic-url">Expected time (in min)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
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
        <InputGroup size="sm" className="mb-3">
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
    <Row>
      <Form.Label htmlFor="basic-url">Ascent (in meters)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
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
      <Col>
        <InputGroup size="sm" className="mb-3">
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
    <Form.Group className="mb-3" controlId="ascent">
        <Form.Label>Difficulty</Form.Label>
        <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="All">All</option>
        <option value="Tourist">Tourist</option>
        <option value="Hiker">Hiker</option>
        <option value="Pro Hiker">Pro Hiker</option>
        </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3" controlId="title">
          <Form.Label>Province</Form.Label>
          <Form.Control type="text" placeholder="Enter a province" 
          value={province} 
          onChange={(e) => {setProvince(e.target.value)}} />
    </Form.Group>
       

        
        {' '}
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Apply
        </Button>
      </Form>
    </Card>
  </Container>)

}



export default FilterForm
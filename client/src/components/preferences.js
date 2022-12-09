import { Form, Row, Button, Card, InputGroup, Col } from "react-bootstrap"
import {  useState } from "react";
import API from '../API';
import { useNavigate } from 'react-router-dom';

function Preferences(props) {
  const [minLength, setMinLength] = useState()
  const [maxLength, setMaxLength] = useState()
  const [minTime, setMinTime] = useState()
  const [maxTime, setMaxTime] = useState()
  const [minAscent, setMinAscent] = useState()
  const [maxAscent, setMaxAscent] = useState()
  const [difficulty, setDifficulty] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  let token = localStorage.getItem("token");
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();    
    let preferences = {
      'minLength': minLength,
      'maxLength': maxLength,
      'minTime': minTime,
      'maxTime': maxTime,
      'minAscent': minAscent,
      'maxAscent': maxAscent,
      'difficulty': difficulty 
    }
    let req = await API.createPreferences(preferences, token)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
        props.setPreferences(preferences)
      navigate('/')
    }

  }

  const checkNum = (num) => {
    if (!isNaN(num)) {
      return true;
    }
    return false
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
    <Button variant="primary" type="submit" onClick={handleSubmit}>
        Apply
    </Button>
    </Form>
    </Card>
  )

}



export default Preferences;

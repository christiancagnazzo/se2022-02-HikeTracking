import { Form, Button, Card, Alert } from "react-bootstrap"
import { useEffect, useState } from "react";
import API from '../API';
import { useNavigate } from 'react-router-dom';

function Preferences(props) {
  const [lengthMin, setLengthMin] = useState()
  const [lengthMax, setLengthMax] = useState()
  const [timeMin, setTimeMin] = useState()
  const [timeMax, setTimeMax] = useState()
  const [ascentMin, setAscentMin] = useState()
  const [ascentMax, setAscentMax] = useState()
  const [difficulty, setDifficulty] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  let token = localStorage.getItem("token");
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();    
    let preferences = {
      'lengthMin': lengthMin,
      'lengthMax': lengthMax,
      'timeMin': timeMin,
      'timeMax': timeMax,
      'ascentMin': ascentMin,
      'ascentMax': ascentMax,
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
        <Form.Group className="mb-2" controlId="lengthMin">
          <Form.Label>Length Min (kms)</Form.Label>
          <Form.Control type="text" placeholder="LengthMin" value={lengthMin}
            onChange={(e) => { if (checkNum(e.target.value)) { setLengthMin(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="lengthMax">
          <Form.Label>Length Max (kms)</Form.Label>
          <Form.Control type="text" placeholder="LengthMax" value={lengthMax}
            onChange={(e) => { if (checkNum(e.target.value)) { setLengthMax(e.target.value) } }} />
        </Form.Group>

        <Form.Group className="mb-2" controlId="timeMin">
          <Form.Label>Time Min</Form.Label>
          <Form.Control type="text" placeholder="Minimum time" value={timeMin} onChange={(e) => { if (checkNum(e.target.value)) { setTimeMin(e.target.value) } }} />
        </Form.Group>

        <Form.Group className="mb-2" controlId="timeMax">
          <Form.Label>Time Max</Form.Label>
          <Form.Control type="text" placeholder="Maximum time" value={timeMax} onChange={(e) => { if (checkNum(e.target.value)) { setTimeMax(e.target.value) } }} />
        </Form.Group>


        <Form.Group className="mb-2" controlId="ascentMin">
          <Form.Label>Ascent Min (meters)</Form.Label>
          <Form.Control type="text" placeholder="Minimum Ascent" value={ascentMin} onChange={(e) => { if (checkNum(e.target.value)) { setAscentMin(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="ascentMax">
          <Form.Label>Ascent Max (meters)</Form.Label>
          <Form.Control type="text" placeholder="Maximum Ascent" value={ascentMax} onChange={(e) => { if (checkNum(e.target.value)) { setAscentMax(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="diffuculty">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="Tourist">Tourist</option>
            <option value="Hiker">Hiker</option>
            <option value="Pro Hiker">Pro Hiker</option>
          </Form.Select>
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



export default Preferences;

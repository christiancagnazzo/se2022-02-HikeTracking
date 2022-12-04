import { Container, Form, Row, Button, Card, Alert } from "react-bootstrap"
import { useEffect, useState } from "react";
import API from '../API';

function FormProfile(props) {
  let [length, setLength] = useState(9)
  let [time, setTime] = useState(240)
  let [ascent, setAscent] = useState(3538)
  let [difficulty, setDifficulty] = useState("Tourist")
  let token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let x=props.profile;
    
    let formData = new FormData()
    formData.append('File', file)
    let record = {
      'length': length,
      'expected_time': time,
      'ascent': ascent,
      'difficulty': difficulty,
          }
    let req = await API.createRecord(record, formData, token)
    if (req.error) {
      setErrorMessage(req.msg)
    } else {
        x.push(record)
        props.setProfile(x)
      navigate('/profile')
    }

  }

  const checkNum = (num) => {
    if (!isNaN(num)) {
      return true;
    }
    return false
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
        <Form.Group className="mb-2" controlId="length">
          <Form.Label>Length (kms)</Form.Label>
          <Form.Control type="text" placeholder="Length" value={length}
            onChange={(e) => { if (checkNum(e.target.value)) { setLength(e.target.value) } }} />
        </Form.Group>
        <Form.Group className="mb-2" controlId="time">
          <Form.Label>Time</Form.Label>
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
        {' '}
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : false}
    </Card>

  )

}



export default FormProfile

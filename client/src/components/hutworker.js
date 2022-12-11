import Sidebar from './sidebar';
import { Routes, Route } from 'react-router-dom';
import HikeForm from './hikeform';
import { Col, Row } from 'react-bootstrap';
import HutForm from './hutform';
import ParkingLotForm from './parkinglotform';
import API from '../API';
import { useState, useEffect } from 'react';
import Hikes from './hikes';
import HikeCondition from './hikecondition';


function HutWorker(props) {
  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  let token = localStorage.getItem("token");

  const updateDirty = () => {
    const flag = dirty
    setDirty(!flag)
  }

  useEffect(() => {
    const getHikes = async () => {
      try {
        const hikes = await API.getHutWorkerHikes(token);
        console.log(hikes)
        if (hikes.err)
          setErrorMessage(hikes.msg)
        else
          setHikes(hikes.msg);
      } catch (err) {
        console.log(err)
      }
    }
    getHikes()
  }, [dirty]);


  return (
    <>
      <Sidebar userPower={"hutworker"} />
      <Col sm={10} className="py-1">
        <Row className="p-4">
          <Routes>
            <Route path="condition/:hiketitle" element={<HikeCondition />} />

            <Route path="*" element={<Hikes userPower={props.userPower} hikes={hikes} />} />
          </Routes>
        </Row>
      </Col>
    </>
  )
}

export default HutWorker
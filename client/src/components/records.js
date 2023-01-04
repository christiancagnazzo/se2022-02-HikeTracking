import Button from 'react-bootstrap/Button';

import {  Row, Col,  Container } from 'react-bootstrap';
import HikeCard from './hikecard';
import UTILS from '../utils/utils';
import RecordCard from './recordsCard';

function displayHikesUtil(hikes) {
  let recordsCard = hikes.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <RecordCard hike={h} />
    </Col>)
  let rows = UTILS.createRows(hikes, recordsCard)
  return (
    <>
      <div>
        {rows}
      </div>
    </>
  )
}


function Hikes(props) {
   console.log(props.length)
  if (props.records.length === 0) {
    return (
      <Container>
      <Row>
        <Col xs={10}>
          <h1>No available Records</h1>
        </Col>
      </Row>
    </Container>
    )
  }
  else {
    return displayHikesUtil(props.hikes)
  }
}


export default Hikes



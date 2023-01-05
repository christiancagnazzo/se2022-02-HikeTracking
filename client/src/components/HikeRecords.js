
import {  Row, Col, Container } from 'react-bootstrap';

import UTILS from '../utils/utils';
import HikeCard from './hikecard';
import Record from './records';


function displayRecommendedHikesUtil(records, userPower) {
  let recordCard = records.map((r, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <Record userPower={userPower} record={r} />
    </Col>)
  let rows = UTILS.createRows(records, recordCard)
  return (
    <Container>
    <Row>
      <Col xs={10}>
        <h1>Records</h1>
      </Col>
      <Col>
        {rows}
      </Col>
    </Row>
  </Container>
  )
}


function HikeRecords(props) {
  if (props.records.length === 0) {
    return <h1>No available records</h1>
  }
  else {
    return displayRecommendedHikesUtil(props.records, props.userPower)
  }

}





export default HikeRecords



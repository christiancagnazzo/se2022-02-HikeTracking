import Button from 'react-bootstrap/Button';

import {  Row, Col,  Container } from 'react-bootstrap';
import HikeCard from './hikecard';
import UTILS from '../utils/utils';

function displayHikesUtil(hikes, userPower, filtered, setFiltered, userId) {
  let hikescard = hikes.map((h, idx) =>
    <Col className="pb-4 px-0" key={h.id}>
      <HikeCard userId={userId} userPower={userPower} hike={h} />
    </Col>)
  let rows = UTILS.createRows(hikes, hikescard)
  return (
    <>
      <Container>
        <Row>
          <Col xs={10}>
            { filtered ? <h1>Filtered Hikes</h1> : <h1>All Hikes</h1> }
          </Col>
          <Col xs={2}>
            { filtered ? <Button variant='secondary' onClick={()=> {
              setFiltered(false)
              window.location.reload(false);
            }}>Reset Filters</Button> : ''}
          </Col>
        </Row>
      </Container>
      <div>
        {rows}
      </div>
    </>
  )
}


function Hikes(props) {
  if (props.hikes.length === 0) {
    return (
      <Container>
      <Row>
        <Col xs={10}>
          <h1>No available hikes</h1>
        </Col>
        <Col xs={2}>
          { props.filtered ? <Button variant='secondary' onClick={()=> {
            props.setFiltered(false)
            window.location.reload(false);
          }}>Reset Filters</Button> : ''}
        </Col>
      </Row>
    </Container>
    )
  }
  else {
    return displayHikesUtil(props.hikes, props.userPower, props.filtered, props.setFiltered, props.userId)
  }

}






export default Hikes



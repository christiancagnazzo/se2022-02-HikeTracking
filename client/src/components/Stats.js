import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, Toast} from 'react-bootstrap';
import UTILS from '../utils/utils';

function Stats(props){
    return (
        showStats(props.stat)
    );
}

function showStats(Stats){
    if (Stats.length === 0) {
        return<h1>No available Stats</h1>
      }
      else {
    return displayStats(Stats)
}

}

function displayObj(obj){
  if (obj.time)
    return obj.title + ", " + obj.time
  else if (obj.length)
    return obj.title + ", " + obj.length
  else 
    return obj.title + ", " + obj.altitude
}


function displayStats(stats){
  return (
    Object.entries(stats).map( (entry, idx) => {
      return (
        <Col className="pb-4 px-0" key={idx}>
        <Toast style={{ width: '22rem' }}>
            <Toast.Header  closeButton={false}> {entry[0]} </Toast.Header>
            <Toast.Body>
              { typeof entry[1] !== 'object' ? entry[1] : displayObj(entry[1]) }
            </Toast.Body>
        </Toast>
        </Col>
      )
    })
  )
}







export default Stats;
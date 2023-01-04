import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal} from 'react-bootstrap';
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


function displayStats(stats){let StatsCard = stats.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <StatCard stat={h} />
    </Col>)
  let rows = []
  for (let i = 0; i < Math.ceil(stats.length / 3); i++) {
    let cols = []
    let j
    for (j = 0; j < 3 && StatsCard.length; j++) {
      cols.push(StatsCard.pop())
    }
    for (; j < 3; j++) {
      cols.push(<Col className="pb-4 px-0" key={j}></Col>)
    }
    rows.push(<Row className='px-0' key={i}>{cols}</Row>)
  }
  return <>
  {rows}
  </>
}
// to-do modify the card
function StatCard(props) {
    return (
    <>
      <Card style={{ width: '22rem' }} key={0}>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Statistics: {props.stat}</ListGroup.Item>
        </ListGroup>  
      </Card>
    </>
    );
  }







export default Stats;
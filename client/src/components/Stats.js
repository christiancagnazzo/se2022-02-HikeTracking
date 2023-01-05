import Card from "react-bootstrap/Card";
import { Container, ListGroup, Row, Col, Modal } from "react-bootstrap";
import UTILS from "../utils/utils";
import "../custom.css";

function Stats(props) {
  console.log(props);
  return showStats(props.stat);
}

function showStats(stat) {
  if (stat.length === 0) {
    return <h1>No available Stats</h1>;
  } else {
    return displayStats(stat);
  }
}

function displayStats(stats) {
  console.log(stats);
  //let st = Object.entries(stats)
  //console.log(st)
  // let Statscard = st.map((a, idx) =>
  // <Col className="pb-4 px-0" key={idx}>
  // <StatCard stats={a} />
  // </Col>)
  //let Statscard = () =>{
  //<Col className="pb-4 px-0" >
  //<StatCard stats={stats} />
  //</Col>
  //}
  // let rows = UTILS.createRows(stats, Statscard)
  return (
    <>
      <Container>
        <Row>
          <Col xs={10}>
            <h1>Performance Stats</h1>
            <StatCard stats={stats} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

// to-do modify the card
function StatCard(props) {
  console.log(props);
  let st = Object.values(props.stats);
  let a = Object.values(st[2]);
  let b = Object.values(st[5]);
  let c = Object.values(st[6]);
  let d = Object.values(st[7]);
  let e = Object.values(st[8]);
  let f = Object.values(st[9]);
  console.log(st);
  console.log(a);
  return (
    <>
      <Row>
        <Col>
          <Card className="stat-class" style={{ width: "22rem" }}>
            <Card.Body>
              <Card.Title className = "text-card">General Statistics</Card.Title>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  Total Number of Hikes Finished
                </span>
                : {st[0]}
              </Card.Text>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  Total Number of Kilometers Walk
                </span>
                : {st[1]}
              </Card.Text>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>Average Pace</span>:{" "}
                {st[3]}
              </Card.Text>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  Average Vertical Ascent
                </span>
                : {st[4]}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stat-classs" style={{ width: "22rem" }}>
            <Card.Title className = "text-card">Fastest Pace Hike</Card.Title>
            <Card.Body>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>Fastest Paced Hike </span>:{" "}
                {a[0]}
              </Card.Text>
              <Card.Text>
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  Fastest Paced Hike's Time
                </span>
                : {a[1]}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
        <Card className="stat-class" style={{ width: "22rem" }}>
        <Card.Title className = "text-card">Most Protracted Hike</Card.Title>
          <Card.Body>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Most Protracted Hike</span>:{" "}
              {b[0]}
            </Card.Text>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Longest time taken(hr)</span>
              : {b[1]}
            </Card.Text>
            </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card className="stat-class" style={{ width: "22rem" }}>
        <Card.Title className = "text-card">Longest Hike</Card.Title>
          <Card.Body>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Longest Hike (length)</span>:{" "}
              {d[0]}
            </Card.Text>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Length of Longest Hike</span>
              : {d[1]}
            </Card.Text>
            </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="stat-class" style={{ width: "22rem" }}>
            <Card.Title className = "text-card">Quickest Hike</Card.Title>
            <Card.Body>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Quickest hike</span>: {c[0]}
            </Card.Text>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Quickest hike time</span>:{" "}
              {c[1]}
            </Card.Text>
            </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="stat-class" style={{ width: "22rem" }}>
            <Card.Title className = "text-card">Shortest Hike</Card.Title>
            <Card.Body>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Shortest hike (length)</span>
              : {e[0]}
            </Card.Text>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Shortest hike length</span>:{" "}
              {e[1]}
            </Card.Text>
            </Card.Body>
            </Card>
            </Col>
            <Col>
            <Card className="stat-class" style={{ width: "22rem" }}>
            <Card.Title className = "text-card">Max Altitude Stats</Card.Title>
            <Card.Body>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Max Altitude Hike</span>:{" "}
              {f[0]}
            </Card.Text>
            <Card.Text>
              {" "}
              <span style={{ fontWeight: "bold" }}>Max altitude reached</span>:{" "}
              {f[1]}
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>
      </Row>
    </>
  );
}

export default Stats;

/*<ListGroup className="list-group-flush">
          <ListGroup.Item>Total Number of Hikes finished: {st[0]}</ListGroup.Item>
          <ListGroup.Item>{st[1]}</ListGroup.Item>
          <ListGroup.Item>{a}</ListGroup.Item>
        </ListGroup>
 
            <Card className = "stat-class" style={{ width: '22rem' }} >
        <Card.Body>
           
            <Card.Text>
            {' '}
            <span style={{ fontWeight: 'bold' }}>Most Protracted Hike</span>
            : {b[0]}
            </Card.Text>
            <Card.Text>
            {' '}
            <span style={{ fontWeight: 'bold' }}>Longest time taken(hr)</span>
            : {b[1]}
            </Card.Text>
           
        </Card.Body>   
        
      </Card>
        */

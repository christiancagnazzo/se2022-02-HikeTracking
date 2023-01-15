import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, ListGroup, Row, Col, Modal, NavLink } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { useState, useEffect } from 'react';
import UTILS from '../utils/utils';
import hike1 from '../img/hike.jpg'
import API from '../API';
import TheSpinner from './spinner';
function displayHutsUtil(huts) {
  let hutscard = huts.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <HutCard hut={h} />
    </Col>)
  let rows = UTILS.createRows(huts, hutscard)
  return (
    <>
      <Container>
        <Row>
          <Col xs={10}>
            <h1>All Huts</h1>
          </Col>
        </Row>
      </Container>
      <div>
        {rows}
      </div>
    </>
  )
}

function Huts(props) {
  if (props.huts.length === 0) {
    return <h1>No available huts</h1>
  }
  else {
    return displayHutsUtil(props.huts)
  }
}


function HutCard(props) {
  const [modalDescriptionShow, setModalDescriptionShow] = useState(false);
  const services = props.hut.services.join(', ')
  const hikes = props.hut.hikes.join(', ')
  const [modalHikesShow, setModalHikesShow] = useState(false)
  const [allHikes, setAllHikes] = useState([])
  const [hikesChoosen, setHikesChoosen] = useState([])
  let token = localStorage.getItem("token");

  useEffect(() => {
    const getHikes = async function () {
      let req = await API.getAllHikes(token)
      if (req.error) {
        console.log(req.msg)
      } else {
        setAllHikes(req.msg)
      }
    }

    getHikes()
  }, [token])

  return (<>
    <Card style={{ width: '22rem' }} key={0} title={props.hut.name}>
      <Card.Body>
        <Card.Title>{props.hut.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Address: {props.hut.address}</ListGroup.Item>
        <ListGroup.Item>Ascent: {props.hut.ascent}€</ListGroup.Item>
        <ListGroup.Item>#Beds: {props.hut.n_beds}</ListGroup.Item>
        <ListGroup.Item>Services: {services}</ListGroup.Item>
        <ListGroup.Item>Fee per night: {props.hut.fee}€</ListGroup.Item>
        <ListGroup.Item>Phone number: {props.hut.phone}</ListGroup.Item>
        <ListGroup.Item>Email: {props.hut.email}</ListGroup.Item>
        <ListGroup.Item>Web Site: {props.hut.web_site}</ListGroup.Item>
        <ListGroup.Item>Hikes: {hikes === "" ? "No hikes linked" : hikes}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Text>
          <Button onClick={() => setModalDescriptionShow(true)}>Description</Button>
          {' '}

          <button type="button" onClick={() => setModalHikesShow(true)} class="btn btn-link">Link Hikes</button>
          <Modal show={modalHikesShow} onHide={() => setModalHikesShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Linked Hikes to {props.hut.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Col>
                {hikes === "" ? "No linked hikes" : <><span style={{"fontWeight": "bold"}}>LINKED HIKES: </span><span>{hikes}</span></> }
                <Row style={{"marginTop": "15px"}}>
                  <Multiselect
                    options={allHikes} // Options to display in the dropdown
                    selectedValues={hikesChoosen} // Preselected value to persist in dropdown
                    onSelect={(e) => { setHikesChoosen(e) }} // Function will trigger on select event
                    onRemove={(e) => { setHikesChoosen(e) }} // Function will trigger on remove event
                    displayValue="title" // Property name to display in the dropdown options
                  />
                </Row>
                </Col>
              </Container>

            </Modal.Body>
            <Modal.Footer>
              <Button id="closeAlerts" variant="success" onClick={() => {
                setModalHikesShow(false)
                API.linkHiketoHut(token, props.hut.id, hikesChoosen)
                window.location.reload(false);
              }}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>

        </Card.Text>
      </Card.Body>

    </Card>
    <HutModalDescription
      show={modalDescriptionShow}
      onHide={() => setModalDescriptionShow(false)}
      id={props.hut.id}
      visible={modalDescriptionShow}
      name={props.hut.name}
      desc={props.hut.desc}
      picture={props.hut.picture}
    />

  </>
  );
}
function HutModalDescription(props) {
  const [image, setImage] = useState('')
  const token = localStorage.getItem("token")

  useEffect(() => {
    async function getImage() {
      const img = await API.getHutPicture(props.id, token)
      setImage(img)
    }
    if (props.visible && !image)
      getImage()
  }, [props.visible])
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {image !== "" ? <img src={"data:image/png;base64," + image}></img> : <TheSpinner />}
        <h4>Description</h4>
        <p>
          {props.desc}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



export default Huts;



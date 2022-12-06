import { Col,Row,Card,ListGroup} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import { useState, useEffect } from 'react';


function ConfirmAccount(props){
  const navigate = useNavigate();
  const [req,setReq] = useState([]);
  const [dirty,setDirty]=useState(false)
  let token = localStorage.getItem("token");
  

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await API.getRequests(token);
        if (requests.error)
          setErrorMessage(requests.msg)
        else
          setReq(requests.msg);
      } catch (err) {
        console.log(err)
      }
    }
    getRequests()
  },[]);
    
    return (
      showAccounts(setDirty)
    );
  }


function showAccounts(profiles){
    if (profiles.length === 0) {
        return<h1>No available record</h1>
      }
      else {
    return displayAccounts(profiles)
}

}


function displayAccounts(profiles){let profilesCard = profiles.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <ProfileCard profile={h} />
    </Col>)
  let rows = []
  for (let i = 0; i < Math.ceil(profiles.length / 3); i++) {
    let cols = []
    let j
    for (j = 0; j < 3 && profilesCard.length; j++) {
      cols.push(profilesCard.pop())
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

function ProfileCard(props) {
    return (
    <>
      <Card style={{ width: '22rem' }} key={0}>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Length: {props.profile.length}km</ListGroup.Item>
          <ListGroup.Item>Estimated time: {props.profile.time}min</ListGroup.Item>
          <ListGroup.Item>Ascent: {props.profile.ascent}m</ListGroup.Item>
          <ListGroup.Item>Difficulty: {props.profile.difficulty}</ListGroup.Item>
        </ListGroup>  
      </Card>
    </>
    );
  }







export default ConfirmAccount;
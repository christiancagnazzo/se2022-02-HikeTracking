import { Col,Row,Card,ListGroup, Button} from 'react-bootstrap';
import { useState } from 'react';
import API from '../API';





function ConfirmAccount(props){
  const [mail, setMail]=useState("")
  const [final, setFinal]=useState("")
  const [role,setRole]=useState("")
  const [errorMessage,setErrorMessage]=useState("")
  let token = localStorage.getItem("token");
  
  
  const postRequest = async () => {
    
    try {
      const desc={mail:mail, final:final, role:role}
      const request = await API.postRequest(desc,token);
      if (request.error){
        setErrorMessage(request.msg)
        props.setDirty(true)
      }
      else
        props.setDirty(true)
    } catch (err) {
      console.log(err)
    }
  }
    return (
      showAccounts(props.req,postRequest,setMail,setFinal,setRole)
    );
  }


function showAccounts(profiles,postRequest,setMail,setFinal,setRole){
    if (profiles.length === 0) {
        return<h1>No available requests</h1>
      }
      else {
    return displayAccounts(profiles,postRequest,setMail,setFinal,setRole)
}

}


function displayAccounts(profiles,postRequest,setMail,setFinal,setRole){
  let profilesCard = profiles.map((h, idx) =>
    <Col className="pb-4 px-0" key={idx}>
      <UserCard profile={h} postRequest={postRequest} setMail={setMail} setFinal={setFinal} setRole={setRole}/>
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

function UserCard(props) {
  const mail=props.profile.mail
  const role= props.profile.role
    return (
    <>
      <Card style={{ width: '22rem' }} key={0}>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Mail: {mail}</ListGroup.Item>
          <ListGroup.Item>Role Request: {role}</ListGroup.Item>
        </ListGroup>  
        <Button variant="success" onClick={() =>result(true,props.postRequest,props.setMail, props.setFinal, mail,role,props.setRole)}>Approve</Button>
        <Button variant="danger" onClick={() =>result(false,props.postRequest,props.setMail, props.setFinal, mail,role,props.setRole)}>Do not approve</Button>
      </Card>
    </>
    );
  }

  function result(approve,postRequest,setMail,setFinal,mail,role,setRole){
        setMail(mail);
        setFinal(approve);
        setRole(role);
        return postRequest();
}










export default ConfirmAccount;
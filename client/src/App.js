import './custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';
import Visitor from './components/visitor';
import { Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/login';
import MyNavbar2 from './components/navbarlogin';
import Hike from './components/hike';
import LocalGuide from './components/localguide'

function App(){
  return (
    <Router>
      <App2/>
    </Router>
  )
}
function App2() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [user, setUser] = useState({});
  const [flagSelectedHike,setFlagSelectedHike]=useState(false)
  const [selectedHike,setSelectHike]=useState({})
  const [message, setMessage] = useState('');
  //const [services,setServices]=useState([1]);
  //const [dirty,setDirty]=useState(true);
  //const [ticket,setTicket]=useState('');
  const [userPower,setUserPower]=useState("Visitor")

  function handleError(err){
    console.log(err);
  }
  const navigate = useNavigate();
  
  
    const doLogout = async () => {
      await API.logout();
      setLoggedIn(false);
      setUser({});
      setUserPower("Visitor")
      navigate('/Visitor');
    }
  
    // inserisco come nome l'email della persona e lo userPower sono i privilegi disponibili
    const login = ()=>{navigate("/login")}
    const doLogin = (credentials) => {
      API.login(credentials)
        .then( user => {
          setLoggedIn(true);
          setUser(user.mail);
          setUserPower(user.power)
          //setDirty(true);
          setMessage('');
          navigate('/'+user.power);
        })
        .catch(err => {
          setMessage(err);
        }
          )
    }


  return (
    <>
    <MyNavbar2 loggedIn={loggedIn} logout={doLogout} login={login} userPower={userPower}/>
    <Container fluid>
       <Row className="vheight-100">
            <Routes> 
              <Route path='/' element={(loggedIn ? <Navigate to='/'userPower /> : <Visitor ></Visitor>)}></Route>
              <Route path='/login'  element={loggedIn ? <Navigate to='/'userPower /> : <LoginForm login={doLogin} loginError={message} setLoginError={setMessage} /> }/>
              <Route path='/Hike' element={flagSelectedHike ? <Hike></Hike> : <Navigate to='/'userPower />}></Route>
              <Route path='/guide' element={<LocalGuide></LocalGuide>}></Route>
            </Routes>
       </Row>
    </Container>
    </>
    );
}

export default App;

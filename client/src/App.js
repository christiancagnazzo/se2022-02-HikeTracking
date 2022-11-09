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
  const [selectedHike,setSelectedHike]=useState(null)
  const [message, setMessage] = useState('');
  //const [services,setServices]=useState([1]);
  const [dirty,setDirty]=useState(true);
  //const [ticket,setTicket]=useState('');
  const [userPower,setUserPower]=useState("")
  const [filter,setFilter]=useState("all")
  const [hikes,setHikes]=useState([])

  useEffect(()=> {
    const checkAuth = async() => {
      if (dirty && loggedIn)  
        try {
          const user = await API.getUserInfo();
          setUser(user);
          setDirty(false)
        } catch(err) {
          handleError(err);
        }
    };
      checkAuth();
}, [dirty,loggedIn,user]);

useEffect(()=> {
  const checkFilters = async() => {
      try {
        const hikes = await API.getHikes(filter,userPower);
        setHikes(hikes)
      } catch(err) {
        handleError(err);
      }
  };
    checkFilters();
}, [filter,userPower]);

useEffect(()=> {
  const selectedHikefunc = async() => {
    if (flagSelectedHike!==false)  
      navigate("/Hike")
    else navigate("/"+userPower)
  };
    selectedHikefunc();
}, [flagSelectedHike]);


  function handleError(err){
    console.log(err);
  }
  const navigate = useNavigate();
  
  
    const doLogout = async () => {
      await API.logout();
      setLoggedIn(false);
      setUser({});
      setUserPower("")
      navigate('/');
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
               <Route path='/' element={(loggedIn ? <Navigate to='/'userPower /> : <Visitor filter={filter} setFilter={setFilter} setFlagSelectedHike={setFlagSelectedHike} setSelectedHike={setSelectedHike}></Visitor>)}></Route>
               <Route path='/login'  element={loggedIn ? <Navigate to='/'userPower /> : <LoginForm login={doLogin} loginError={message} setLoginError={setMessage} /> }/>
              <Route path='/Hike' element={flagSelectedHike ? <Hike setFlagSelectedHike={setFlagSelectedHike}></Hike> : <Navigate to='/'userPower />}></Route>
            </Routes>
       </Row>
    </Container>
    </>
    );
}

export default App;

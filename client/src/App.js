import './custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';
import VisitorPage from './components/visitor_main'
import { Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/login';
import MyNavbar2 from './components/navbarlogin';
import Hike from './components/hike';
import LocalGuide from './components/localguide'
import {Helmet} from "react-helmet";
import RegistrationForm from './components/registration';
function App(){
  return (
    <Router>
      <Helmet>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
     integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
     crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
     integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
     crossorigin=""></script>
    
      </Helmet>
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
  const [dirty,setDirty]=useState(true);
  const [userPower,setUserPower]=useState("")
  const [filter,setFilter]=useState("all")
  const [hikes,setHikes]=useState([])
  const [checkedState, setCheckedState] = useState(new Array(14).fill(true));
  const [first,setFirst]=useState(true)

  useEffect(()=>{
    const firstTimeFilter= async()=>{
      let y=new Array(14).fill(true)
      if (first && !loggedIn){
          y[13]=false
          setCheckedState(y)
          setFirst(false)
      }
    }
    firstTimeFilter()
  },[first])


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

const getH= async (filter)=>{
  try {
    const hikes = await API.getHikes(filter,userPower);
    setHikes(hikes)
  } catch(err) {
    handleError(err);
  }

}

useEffect(()=> {
  const selectedHikefunc = async() => {
    if (flagSelectedHike!==false)  
      navigate("/Hike")
    //else navigate("/"+userPower)
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

          setFirst(true);
          setMessage('');
          navigate('/'+user.power);
        })
        .catch(err => {
          setMessage(err);
        }
          )
    }
    const signIn = () => {navigate("/registration")}

  return (
    <>
    <MyNavbar2 loggedIn={loggedIn} logout={doLogout} login={login} signIn={signIn} userPower={userPower}/>
    <Container fluid>

       <Row className="vheight-100">
            <Routes> 
              <Route path='/' element={(loggedIn ? <Navigate to='/'userPower /> : <VisitorPage filter={filter} setFilter={setFilter} setFlagSelectedHike={setFlagSelectedHike} setSelectedHike={setSelectedHike} setCheckedState={setCheckedState} checkedState={checkedState} getH={getH}></VisitorPage>)}></Route>
              <Route path='/login'  element={loggedIn ? <Navigate to='/'userPower /> : <LoginForm login={doLogin} loginError={message} setLoginError={setMessage} /> }/>
              <Route path='/Hike' element={flagSelectedHike ? <Hike setFlagSelectedHike={setFlagSelectedHike}></Hike> : <Navigate to='/'userPower />}></Route>
              <Route path='/guide' element={<LocalGuide></LocalGuide>}></Route>
              <Route path='/registration' element={<RegistrationForm/>}></Route>
              <Route path='/visitor' element={<VisitorPage/>}></Route>
            </Routes>
       </Row>
    </Container>
    </>
    );
}

export default App;

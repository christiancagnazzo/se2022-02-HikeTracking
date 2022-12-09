import './custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';
import VisitorPage from './components/visitor'
import { Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/login';
import MyNavbar from './components/navbarlogin';
import Hike from './components/hikes';
import LocalGuide from './components/localguide'
import { Helmet } from "react-helmet";
import RegistrationForm from './components/registration';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';


function App() {
  return (
    <Router>
      <Helmet>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
          integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
          crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
          integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
          crossorigin=""></script>
      </Helmet>
      <App2 />
    </Router>
  )
}
function App2() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);
  const [userPower, setUserPower] = useState("")
  const [filter, setFilter] = useState("all")

  function handleError(err) {
    console.log(err);
  }
  const navigate = useNavigate();

  useEffect(() => {
  const checkAuth = async () => {
    let token = localStorage.getItem("token");
    if(token === null) return;
    try {
      let result = await API.checkAuth(token)
      if (result.error) {
        //setMessage(result.msg)
      } else {
        setLoggedIn(true);
        setUser(result.msg.user);
        setUserPower(result.msg.role)
        //setDirty(true);
        setMessage('');
        navigate('/'+result.msg.role);
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  checkAuth()
  },[])

  const doLogout = async () => {
    let token = localStorage.getItem("token");
    await API.logout(token);
    setLoggedIn(false);
    setUser('');
    setUserPower("")
    navigate('/');
  }

  // inserisco come nome l'email della persona e lo userPower sono i privilegi disponibili
  const login = () => { navigate("/login") }
  const doLogin = async (credentials) => {
    try {
      let result = await API.login(credentials)
      if (result.error) {
        setMessage(result.msg)
      } else {
        setLoggedIn(true);
        setUser(result.msg.user);
        setUserPower(result.msg.role)
        //setDirty(true);
        localStorage.setItem('token', JSON.stringify(result.msg.token));
        setMessage('');
        navigate('/'+result.msg.role);
      }
    }
    catch (e) {
      setMessage(e)
    }
  }
  const signIn = () => { navigate("/registration") }

  return (
    <>
     <Container fluid className ="d-flex flex-column h-100"
      style={{ paddingLeft: 0, paddingRight: 0 }}>
      <MyNavbar loggedIn={loggedIn} logout={doLogout} login={login} signIn={signIn} userPower={userPower} />
      <Container fluid className="flex-grow-1">
        <Row className = "h-100">
          <Routes>
            <Route path='/*' element={(<VisitorPage userPower={userPower} filter={filter} setFilter={setFilter} ></VisitorPage>)}/>
            <Route path='/hiker/*' element={(<VisitorPage userPower={userPower} filter={filter} setFilter={setFilter} ></VisitorPage>)}/>
            <Route path='/login' element={<LoginForm login={doLogin} loginError={message} setLoginError={setMessage} />} />
            <Route path='/localguide/*' element={ userPower === 'localguide' ? <LocalGuide></LocalGuide> : <Navigate replace to={'/login'}></Navigate>}></Route>
            <Route path='/registration' element={<RegistrationForm />}></Route>
            
          </Routes>
        </Row>
      </Container>
      </Container>
      
    </>
  );
}

export default App;

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
import VisitorPage from './components/visitor_main';

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
  const [selectedHike,setSelectedHike]=useState(null) // dont know if we need anymore
  const [message, setMessage] = useState('');
  const [dirty,setDirty]=useState(true);
  const [userPower,setUserPower]=useState("")
  const [hikes,setHikes]=useState([])
  const [checkedState, setCheckedState] = useState(new Array(14).fill(true));
  const [first,setFirst]=useState(true) // used for first get from
  const filters=["0-1km","1-3km","3-10km","easy","med","hard","nord","center","sud","60min","90min","more","yes","no"]
  useEffect(()=>{
    const firstTimeFilter= async()=>{
      let y=new Array(14).fill(true)
      if (first && !loggedIn){
          y[13]=false
          setCheckedState(y)
          setFirst(false)
      }
      getH(checkedState,filters)
    }
    firstTimeFilter()
  },[first]) // use effect for filters


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
}, [dirty,loggedIn,user]); // useeffect for session

const getH= async (filterarray,filters)=>{
  try {
    const hikes = await API.getHikes(filterarray,filters);
    setHikes(hikes)
  } catch(err) {
    handleError(err);
  }

}// functione to retrieve infos about Hikes filtered

useEffect(()=> {
  const selectedHikefunc = async() => {
    if (flagSelectedHike!==false)  
      navigate("/Hike")
    //else navigate("/"+userPower)
  };
    selectedHikefunc();
}, [flagSelectedHike]); //it was a function to select an hikes, don't know if we need


  function handleError(err){
    console.log(err);
  } // 
  const navigate = useNavigate();
  
  
    const doLogout = async () => {
      await API.logout();
      setLoggedIn(false);
      setUser({});
      setUserPower("")
      navigate('/');
    }//function used for logout
  
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
    }//function for login


  return (
    <>
    <MyNavbar2 loggedIn={loggedIn} logout={doLogout} login={login} userPower={userPower}/>
    
    <Container fluid>

       <Row className="vheight-100">
            <Routes> 
              <Route path='/' element={(loggedIn ? <Navigate to='/'userPower /> : <Visitor filter={filters}  setFlagSelectedHike={setFlagSelectedHike} setSelectedHike={setSelectedHike} setCheckedState={setCheckedState} checkedState={checkedState} getH={getH}></Visitor>)}></Route>
              <Route path='/login'  element={loggedIn ? <Navigate to='/'userPower /> : <LoginForm login={doLogin} loginError={message} setLoginError={setMessage} /> }/>
              <Route path='/Hike' element={flagSelectedHike ? <Hike setFlagSelectedHike={setFlagSelectedHike}></Hike> : <Navigate to='/'userPower />}></Route>
              <Route path='/guide' element={<LocalGuide></LocalGuide>}></Route>
              <Route path='/visitor' element={<VisitorPage filter={filters}  setFlagSelectedHike={setFlagSelectedHike} setSelectedHike={setSelectedHike} setCheckedState={setCheckedState} checkedState={checkedState} getH={getH}/>}></Route>
            </Routes>
       </Row>
    </Container>
    </>
    );
}

export default App;
import Sidebar from './sidebar';
import { Routes, Route } from 'react-router-dom';
import HikeForm from './hikeform';
import { Col, Row } from 'react-bootstrap';
import HutForm from './hutform';
import ParkingLotForm from './parkinglotform';
import API from '../API';
import { useState, useEffect } from 'react';
import Hikes from './hikes';
import Huts from './huts';
import ParkingLots from './parkinglots';

function LocalGuide(props){
    const [hikes, setHikes] = useState([]);
    const [huts, setHuts] = useState([]);
    const [parkinglots, setParkingLots] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [dirty, setDirty] = useState(false)
    let token = localStorage.getItem("token");
  
  const updateDirty = () => {
    const flag = dirty
    setDirty(!flag)
  }

  useEffect(() => {
    const getHikes = async () => {
      try {
        const hikes = await API.getAllHikes(token);
        if (hikes.error)
          setErrorMessage(hikes.msg)
        else
          setHikes(hikes.msg);
      } catch (err) {
        console.log(err)
      }
    }
    getHikes()
  }, [dirty]);

  
  const applyFilterHikes = (filter) => {
    async function  getFilteredHikes(){
      try{
        const filteredHikes = await API.getAllHikes(token, filter)
        if (hikes.error)
            setErrorMessage(filteredHikes.msg)
          else
            setHikes(filteredHikes.msg);
        } catch (err) {
          console.log(err)
        }
      }
      getFilteredHikes()
    }

    useEffect(() => {
      const getHuts = async () => {
        try {
          const huts = await API.getAllHuts(token);
          if (huts.error)
            setErrorMessage(huts.msg)
          else{
            setHuts(huts.msg);
          }
        } catch (err) {
          console.log(err)
        }
      }
      getHuts()
    }, [dirty]);
  
    
    const applyFilterHuts = (filter) => {
      async function  getFilteredHuts(){
        try{
          const filteredHuts = await API.getAllHuts(token, filter)
          if (filteredHuts.error)
              setErrorMessage(filteredHuts.msg)
            else
              setHikes(filteredHuts.msg);
          } catch (err) {
            console.log(err)
          }
        }
        getFilteredHuts()
      }
    
      useEffect(() => {
        const getParkingLots = async () => {
          
          try {
            const plots = await API.getAllParkingLots(token);
            if (plots.error)
              setErrorMessage(plots.msg)
            else
              setHikes(plots.msg);
          } catch (err) {
            console.log(err)
          }
        }
        getParkingLots()
      }, []);


    return(
    <>
    <Sidebar userPower={"localguide"}/>
    <Col sm={10} className="py-1">
    <Row className="p-4">
    <Routes>
        <Route path="*" element={<HikeForm/>}/>
        <Route path="addhut" element={<HutForm updateDirty={updateDirty}/>}/>
        <Route path="addparkinglot" element={<ParkingLotForm updateDirty={updateDirty}/>}/>
        <Route path="hikes" element={<Hikes userPower={props.userPower} hikes={hikes} />}/>
        <Route path="huts" element={<Huts huts={huts}/>}/>
        <Route path="parkinglots" element={<ParkingLots parkinglots={parkinglots} applyFilter={() => {}}/>}/>
    </Routes>
    </Row>
    </Col>
    </>
    )
}

export default LocalGuide
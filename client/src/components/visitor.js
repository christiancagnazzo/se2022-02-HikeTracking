import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {  ListGroup, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Map from './map'
import API from '../API';
import FilterFormHikes from './filterformhikes';
import Sidebar from './sidebar';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Hikes from './hikes';
import FilterFormHuts from './filterformhuts';
import Huts from './huts';
import ParkingLots from './parkinglots';
import Preferences from './preferences';

function VisitorPage(props) {
  const [hikes, setHikes] = useState([]);
  const [huts, setHuts] = useState([]);
  const [profile, setProfile] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [parkinglots, setParkingLots] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  let token = localStorage.getItem("token");
  

  useEffect(() => {
    const getHikes = async () => {
      try {
        const hikes = await API.getAllHikes(token, null, props.userPower);
        if (hikes.error)
          setErrorMessage(hikes.msg)
        else
          setHikes(hikes.msg);
      } catch (err) {
        console.log(err)
      }
    }
    getHikes()
  }, [props.userPower]);

  
  const applyFilterHikes = (filter) => {
    async function  getFilteredHikes(){
      try{
        const filteredHikes = await API.getAllHikes(token, filter, props.userPower)
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
          else
            setHuts(huts.msg);
        } catch (err) {
          console.log(err)
        }
        
      }
      getHuts()
    }, [props.userPower]);

    useEffect(() => {
      const getParkingLots = async function () {
        let req = await API.getAllParkingLots(token)
        if (req.error) {
          setErrorMessage(req.msg)
        } else {
          setParkingLots(req.msg)
        }
      }

      getParkingLots()
    }, [props.userPower])
  
    
    const applyFilterHuts = (filter) => {
      async function  getFilteredHuts(){
        try{
          const filteredHuts = await API.getAllHuts(token, filter)
          if (filteredHuts.error)
              setErrorMessage(filteredHuts.msg)
            else
              setHuts(filteredHuts.msg);
          } catch (err) {
            console.log(err)
          }
        }
        getFilteredHuts()
      }

  return (
    <>
      <Sidebar userPower={props.userPower} />
      <Col sm={10} className="py-1">
        <Row className="p-4">
          <Routes>
            <Route path="*" element={<Hikes userPower={props.userPower} hikes={hikes} />}/>
            <Route path="filterhikes" element={<FilterFormHikes   applyFilter={applyFilterHikes} setErrorMessage={setErrorMessage}/>}/>
            <Route path="huts" element={<Huts huts={huts}/>}/>
            <Route path="filterhuts" element={<FilterFormHuts applyFilter={applyFilterHuts} setErrorMessage={setErrorMessage}/>}/> 
            <Route path="parkinglots" element={<ParkingLots parkinglots={parkinglots}/>}/>
            {/*<Route path="profile" element={<Preferences profile={profile} setProfile={setProfile}/>}/>*/}
            <Route path="preferences" element={<Preferences setPreferences={setPreferences}/>}/>
          </Routes>
        </Row>
      </Col>
    </>  
  )
}







export default VisitorPage



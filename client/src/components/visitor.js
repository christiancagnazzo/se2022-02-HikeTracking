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

function VisitorPage(props) {
  const [hikes, setHikes] = useState([]);
  //const [huts, setHuts] = useState([]);
  //const [parkinglots, setParkingLots] = useState([])
  const huts=[{name:"colomba", position:{address:"via delle campanelle 12, torino to"}, beds:"12",services:"protections", desc:"nice play", fee:"114"},
  {name:"colomba", position:{address:"via delle campanelle 12, torino to"}, beds:"12",services:"protections", desc:"nice play", fee:"114"},
  {name:"colomba", position:{address:"via delle campanelle 12, torino to"}, beds:"12",services:"protections", desc:"nice play", fee:"114"},
  {name:"lattosio", position:{address:"via delle campanelle 12, torino to"},beds:"12",services:"protections", desc:"nice play", fee:"114"},
  {name:"fru", position:{address:"via delle campanelle 12, torino to"}, beds:"12",services:"protections", desc:"nice play", fee:"114"},
  {name:"chicco", position:{address:"via delle campanelle 12, torino to"},beds:"12",services:"protections", desc:"nice play", fee:"114"}]
  
  const parkinglots=[{title:"checcè", position:{latitude:"111",longitude:"222",address:"via delle campanelle 12, torino to"}, n_cars:"12",fee:"12", desc:"nice play" }]
  
  const [errorMessage, setErrorMessage] = useState('')
  let token = localStorage.getItem("token");
  

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
  }, []);

  
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

    /*useEffect(() => {
      const getHuts = async () => {
        try {
          const huts = await API.getAllHuts(token);
          console.log(huts)
          if (huts.error)
            setErrorMessage(huts.msg)
          else
            setHuts(huts.msg);
        } catch (err) {
          console.log(err)
        }
        
      }
      getHuts()
    }, []);*/

    /*useEffect(() => {
      const getParkingLots = async function () {
        let req = await API.getAllParkingLots(token)
        if (req.error) {
          setErrorMessage(req.msg)
        } else {
          let all_plot = []
          req.msg.forEach((el) => all_plot.push({ "parkingLotId": el.id, "parkingLotName": el.name, "lat": el.lat, "lon": el.lon }))
          setParkingLots(all_plot)
        }
      }
  
      getParkingLots()
    }, [])*/
  
    
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
  
  return (
    <>
      <Sidebar  />
      <Col sm={10} className="py-1">
        <Row className="p-4">
          <Routes>
            <Route path="*" element={<Hikes userPower={props.userPower} hikes={hikes} />}/>
            <Route path="filterhikes" element={<FilterFormHikes   applyFilter={applyFilterHikes} setErrorMessage={setErrorMessage}/>}/>
            <Route path="huts" element={<Huts huts={huts}/>}/>
            <Route path="filterhuts" element={<FilterFormHuts applyFilter={applyFilterHuts} setErrorMessage={setErrorMessage}/>}/> 
            <Route path="parkinglots" element={<ParkingLots parkinglots={parkinglots}/>}/>
          </Routes>
        </Row>
      </Col>
    </>  
  )
}







export default VisitorPage



import React from 'react';
import '../custom.css'
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

import { Button,Form } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';

//passare da props il checked state a livello app che permette di modificare tutta la schermata
function Sidebar(props){
  const [checkedState, setCheckedState] = useState(props.checkedState);
  const [first,setFirst]=useState(true)
  let x=(props.logged===null);
  let array=checkedState;

    useEffect(()=> {
      const getInfosRequested = async() => {
        if (first){
          if (x){ 
            array[13]=false
          }
          setFirst(false)
          setCheckedState(array)
          props.setCheckedState(array)
          props.getH(array)
        }  
      };
        getInfosRequested();
    }, [first]);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Filters
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
              <CDBSidebarMenuItem icon="table" id='Lenght'>Lenght</CDBSidebarMenuItem>
              <Form.Check  id={'0'} defaultChecked={checkedState[0]} onClick={()=>{check(0,checkedState,setCheckedState)}} label='0-1km'></Form.Check>
              <Form.Check  id={'1'} defaultChecked={checkedState[1]} onClick={()=>{check(1,checkedState,setCheckedState)}} label='1-3km'></Form.Check>
              <Form.Check  id={'2'} defaultChecked={checkedState[2]} onClick={()=>{check(2,checkedState,setCheckedState)}} label='3-10km'></Form.Check>
              <CDBSidebarMenuItem icon="exclamation-circle" >Difficulties</CDBSidebarMenuItem>
              <Form.Check  id={'3'} defaultChecked={checkedState[3]} onClick={()=>{check(3,checkedState,setCheckedState)}} label='easy'></Form.Check>
              <Form.Check  id={'4'} defaultChecked={checkedState[4]} onClick={()=>{check(4,checkedState,setCheckedState)}} label='med'></Form.Check>
              <Form.Check  id={'5'} defaultChecked={checkedState[5]} onClick={()=>{check(5,checkedState,setCheckedState)}} label='hard'></Form.Check>
              <CDBSidebarMenuItem icon="chart-line" >Place</CDBSidebarMenuItem>
              <Form.Check  id={'6'} defaultChecked={checkedState[6]} onClick={()=>{check(6,checkedState,setCheckedState)}} label='nord'></Form.Check>
              <Form.Check  id={'7'} defaultChecked={checkedState[7]} onClick={()=>{check(7,checkedState,setCheckedState)}} label='center'></Form.Check>
              <Form.Check  id={'8'} defaultChecked={checkedState[8]} onClick={()=>{check(8,checkedState,setCheckedState)}} label='sud'></Form.Check>
              <CDBSidebarMenuItem icon="chart-line" >time</CDBSidebarMenuItem>
              <Form.Check  id={'9'} defaultChecked={checkedState[9]} onClick={()=>{check(9,checkedState,setCheckedState)}} label='60min'></Form.Check>
              <Form.Check  id={'10'}defaultChecked={checkedState[10]}onClick={()=>{check(10,checkedState,setCheckedState)}} label='90min'></Form.Check>
              <Form.Check  id={'11'}defaultChecked={checkedState[11]}onClick={()=>{check(11,checkedState,setCheckedState)}} label='more'></Form.Check>
              <CDBSidebarMenuItem icon="chart-line" >avaible</CDBSidebarMenuItem>
              <Form.Check  id={'12'} defaultChecked={checkedState[12]}disabled={x} onClick={()=>{check(12,checkedState,setCheckedState)}}label='yes' ></Form.Check>
              <Form.Check  id={'13'} defaultChecked={checkedState[13]}disabled={x} onClick={()=>{check(13,checkedState,setCheckedState)}}label='no' ></Form.Check>
              <Button variant='info' onClick={()=>{save(checkedState,props.setCheckedState,props.getH)}}>Save</Button>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        
      </CDBSidebar>
    </div>
  );
};


const check = (position,checkedState,setCheckedState) => {
  let array=checkedState;
  array[position]=!array[position]
  setCheckedState(array)  
}
const save = (checkedState,setAppChecked,getH) => {
  setAppChecked(checkedState);
  getH(checkedState)
  
}

export default Sidebar;
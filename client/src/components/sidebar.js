import { ProSidebarProvider } from 'react-pro-sidebar';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Hiking, HolidayVillage, LocalParking } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const colorBackgroundMenu = "#566400"

function MySidebar(props){
    let menu;    

    console.log(props.userPower)
    if(props.userPower === "hiker" || !props.userPower) {
        menu = <HikerMenu hiker={props.userPower === "hiker"}/>
    }
    else if (props.userPower === "localguide"){
        menu = <LocalGuideMenu />
    }
    return (
        <Col  sm={2} className="px-0  bg-success">
            <ProSidebarProvider >
                {menu}
            </ProSidebarProvider>
        </Col>
    );
}


function initFlagArray(length){
  let arr = []
  for(let i = 0; i < length; i++){
    arr.push(false)
  }
  return arr
}

function HikerMenu(props){
    const [active, setActive] = useState(initFlagArray(5))
    const navigate = useNavigate()
    const hikingIcon = <Hiking></Hiking>
    const parkingLot = <LocalParking></LocalParking>
    const hutIcon = <HolidayVillage></HolidayVillage>

    const updateActive = (idx, relocation) => {
      let active = []
      for(let i = 0; i < 5; i++){
        if(i === idx){
          active.push(true)
        }
        else {
          active.push(false)
        }
      }
      setActive(active)
      navigate(relocation)
    }
    return (
    <Sidebar width='auto' className='border-0' backgroundColor={colorBackgroundMenu} >
      <Menu>
        <SubMenu label="Hikes" icon={hikingIcon}>
          <MenuItem onClick={() => updateActive(0,"hikes")} active={active[0]}>Browse</MenuItem>
          <MenuItem onClick={() => updateActive(1,"filterhikes")} active={active[1]}>Filter</MenuItem>
        </SubMenu>
        <SubMenu icon ={hutIcon} label='Hut'>
          <MenuItem onClick={() => updateActive(2,"huts")}active={active[2]}>Browse</MenuItem>
          {props.hiker ? <MenuItem onClick={() => updateActive(3,"filterhuts")}active={active[3]}>Filter</MenuItem> : ''}
        </SubMenu>
  
        <SubMenu icon={parkingLot} label='Parking Lot'>
          <MenuItem onClick={() => updateActive(4,"parkinglots")}active={active[4]}>Browse</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
    )
}




function LocalGuideMenu(props){
    const lengthOption = 6
    const [active, setActive] = useState(initFlagArray(lengthOption))
    const hikingIcon = <Hiking></Hiking>
    const parkingLot = <LocalParking></LocalParking>
    const hutIcon = <HolidayVillage></HolidayVillage>
    const navigate = useNavigate()
    const updateActive = (idx, relocation) => {
      let active = []
      for(let i = 0; i < lengthOption; i++){
        if(i === idx){
          active.push(true)
        }
        else {
          active.push(false)
        }
      }
      setActive(active)
      navigate(relocation)
    }
    return (
        <Sidebar width='auto' className='border-0' backgroundColor={colorBackgroundMenu} >
          <Menu>
            <SubMenu label="Hikes" icon={hikingIcon}>
              <MenuItem onClick={() => {updateActive(0,'/localguide/addhike')}} active={active[0]}>
                Add</MenuItem>
                <MenuItem onClick={() => updateActive(1,"hikes")} active={active[1]}>Browse</MenuItem>
            </SubMenu>
            <SubMenu icon ={hutIcon} label='Hut'>
              <MenuItem onClick={() => updateActive(2,"/localguide/addhut")} active={active[2]}>Add</MenuItem>
              <MenuItem onClick={() => updateActive(3,"huts")}active={active[3]}>Browse</MenuItem>
            </SubMenu>
      
            <SubMenu icon={parkingLot} label='Parking Lot'>
              <MenuItem onClick={() => updateActive(4,"/localguide/addparkinglot")} active={active[4]}>Add</MenuItem>
              <MenuItem onClick={() => updateActive(5,"parkinglots")}active={active[5]}>Browse</MenuItem>
            </SubMenu>
          </Menu>
        </Sidebar>
        )
}
export default MySidebar;
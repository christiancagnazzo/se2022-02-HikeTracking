import { ProSidebarProvider } from 'react-pro-sidebar';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Hiking, HolidayVillage, LocalParking } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';




function MySidebar(props){
    let menu;    
    if(!props.usertype) {
        menu = <HikerMenu currSel={props.currSel} changeSel={props.updateCurrSel}/>
    }
    else if (props.usertype === "localguide"){
        menu = <LocalGuideMenu currSel={props.currSel} changeSel={props.updateCurrSel}/>
    }
    return (
        <Col  sm={2} className="px-0  bg-success">
            <ProSidebarProvider >
                {menu}
            </ProSidebarProvider>
        </Col>
    );
}


function HikerMenu(props){

    const hikingIcon = <Hiking></Hiking>
    const parkingLot = <LocalParking></LocalParking>
    const hutIcon = <HolidayVillage></HolidayVillage>
    return (
    <Sidebar width='auto' className='border-0'>
      <Menu>
        <SubMenu label="Hikes" icon={hikingIcon}>
          <MenuItem onClick={() => props.changeSel("hikes")}>Browse</MenuItem>
          <MenuItem onClick={() => props.changeSel("filter")}>Filter</MenuItem>
        </SubMenu>
        <SubMenu icon ={hutIcon} label='Hut'>
          <MenuItem /*onClick={() => props.changeSel("hikes")}*/>Browse</MenuItem>
          <MenuItem /*onClick={/*() => props.changeSel("filter")}*/>Filter</MenuItem>
        </SubMenu>
  
        <SubMenu icon={parkingLot} label='Parking Lot'>
          <MenuItem /*onClick={() => props.changeSel("hikes")}*/>Browse</MenuItem>
          <MenuItem /*onClick={/*() => props.changeSel("filter")}*/>Filter</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
    )
}

function LocalGuideMenu(props){
    const navigate = useNavigate()
    const hikingIcon = <Hiking></Hiking>
    const parkingLot = <LocalParking></LocalParking>
    const hutIcon = <HolidayVillage></HolidayVillage>

    return (
        <Sidebar width='auto' className='border-0'>
          <Menu>
            <SubMenu label="Hikes" icon={hikingIcon}>
              <MenuItem onClick={() => {navigate('/localguide/addhike')}}>
                Add</MenuItem>
            </SubMenu>
            <SubMenu icon ={hutIcon} label='Hut'>
              <MenuItem /*onClick={() => props.changeSel("/localguide/addhut")}*/>Add</MenuItem>
              
            </SubMenu>
      
            <SubMenu icon={parkingLot} label='Parking Lot'>
              <MenuItem /*onClick={() => props.changeSel("/localguide/addparkinglot")}*/>Add</MenuItem>
              
            </SubMenu>
          </Menu>
        </Sidebar>
        )
}
export default MySidebar;
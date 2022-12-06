import Sidebar from './sidebar';
import { Routes, Route } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
//platform manager dont need to show hikes so i just develop the page to confirm accounts



import ConfirmAccount from './confirmAccount';

function platformManager(props){
    // if (props.userPower!== "PlatformManager") navigate("/")
    return(
    <>
    <Sidebar userPower={"PlatformManager"}/>
    <Col sm={10} className="py-1">
    <Row className="p-4">
    <Routes>
        
        <Route path="confirmAccount" element={<ConfirmAccount setDirty={setDirty}/>}/>
    </Routes>
    </Row>
    </Col>
    </>
    )
}

export default platformManager
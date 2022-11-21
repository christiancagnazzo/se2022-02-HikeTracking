import Sidebar from './sidebar';
import { Routes, Route } from 'react-router-dom';
import HikeForm from './hikeform';
import { Col, Row } from 'react-bootstrap';
function LocalGuide(props){
    return(
    <>
    <Sidebar usertype={"localguide"}/>
    <Col sm={10} className="py-1">
    <Row className="p-4">
    <Routes>
        <Route path="addhike" element={<HikeForm/>}></Route>
    </Routes>
    </Row>
    </Col>
    </>
    )
}

export default LocalGuide
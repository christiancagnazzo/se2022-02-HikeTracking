import { ListGroup} from 'react-bootstrap';
function Sidebar(props){
let x=props.filter;
        return (
        
            <ListGroup variant="horizontal" >
                <ListGroup.Item active={x==="all"} variant="primary" action onClick={()=>props.setFilter("all")}>All</ListGroup.Item>
                <ListGroup.Item active={x==="r1"} variant="secondary" action onClick={()=>props.setFilter("r1")}>Favorites</ListGroup.Item>
                <ListGroup.Item active={x==="r2"} variant="warning" action onClick={()=>props.setFilter("r2")}>Best Rated</ListGroup.Item>
                <ListGroup.Item active={x==="r3"} variant="danger" action onClick={()=>props.setFilter("r3")}>Seen</ListGroup.Item>
                <ListGroup.Item active={x==="r4"} variant="info" action  onClick={()=>props.setFilter("r4")}>Unseen</ListGroup.Item>
            </ListGroup>
        
    );
}
export default Sidebar;
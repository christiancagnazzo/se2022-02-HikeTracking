import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Container, ListGroup,Col,Row} from 'react-bootstrap';
import Sidebar from './sidebar';



function Visitor(props) {
//<h1 className="col-12 below-nav">Hey! non riceviamo alcuna risposta dal server! Prova a riaggiornare la pagina!</h1>

    return (   
        <>
        
        <Container className="below-nav">
        <Row >
        <Col xs={1} md={2} lg={2}>
        <Sidebar logged={null} setCheckedState={props.setCheckedState} checkedState={props.checkedState} getH={props.getH}/>
        </Col>
            <Col xs={4} md={8} lg={10}>
            <NewCards filter={props.filter} setFilter={props.setFilter} setFlagSelectedHike={props.setFlagSelectedHike} setSelectedHike={props.setSelectedHike}></NewCards>
            </Col>
          </Row>
        </Container>
        </>
    );
}




function NewCards(props) {
  let x =[{title:"ciao",description:"i'm beatiful"},{title:"ciao1",description:"i'm beatiful"},{title:"ciao2",description:"i'm beatiful"},{title:"ciao3",description:"i'm beatiful"},{title:"ciao4",description:"i'm beatiful"},{title:"ciao5",description:"i'm beatiful"},{title:"ciao6",description:"i'm beatiful"},{title:"ciao7",description:"i'm beatiful"}]
  let e=[];
  let q=x.length/4;

  let i=0;
  let y;
  for (i=0;i<q;i++){
      e[i]=[];
      for (y=0;y<4;y++)
        if (x[i*4+y]!=null)
          e[i].push(x[i*4+y])
    }
  return (
      <>
        <h1 className='mb-2'>Hikes: </h1>
        
        <Container >
          <ListGroup >
            {
              e.map((c) =>  <MultiCards x={c} setFlagSelectedHike={props.setFlagSelectedHike} setSelectedHike={props.setSelectedHike}/>)
            } 
          </ListGroup>
          </Container>
       </>
  )}  
    

  function MultiCards(props){ 
    return(
          <ListGroup horizontal>
                {
                    props.x.map((c) => <SingleCard description={c.description} title={c.title} setFlagSelectedHike={props.setFlagSelectedHike} setSelectedHike={props.setSelectedHike}/>)
                }      
          </ListGroup> 
)  
}

function SingleCard(props){
  let x=props.title
    x+=" Button"
    
  return(
<Card style={{ width: '18rem'} } key={props.title} title={props.title}>
      <Card.Img variant="top" src="./logo192.png" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description} 
        </Card.Text>
        <Button id={x} key={x} variant="primary" onClick={()=>hikeSelected(props.setFlagSelectedHike, props.setSelectedHike, props.title)}>{x}</Button>
      </Card.Body>
    </Card>
    
  );
}

function hikeSelected(setflag,sethike,hike){
  setflag(true);
  sethike(hike);

}

export default Visitor;
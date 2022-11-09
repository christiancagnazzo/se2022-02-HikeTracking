import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Row, ListGroup} from 'react-bootstrap';



function Visitor(props) {
//<h1 className="col-12 below-nav">Hey! non riceviamo alcuna risposta dal server! Prova a riaggiornare la pagina!</h1>

    return (   
        <>
        <Container className="below-nav">
          <div className='col-sm'>
        <NewCards></NewCards>
        </div>
        
    </Container>
    </>
    );
}




function NewCards(props) {
  let x =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  let e=[];
  let q=0;
  for (q=0;q<x.length%7;q++)
    e.push(q)  
    
  

  
  for (let w=0; w<q;w++)
    e.push(w)

   
  return (
    <>
        <h1 className='mb-2'>Hikes: </h1>
        
        
        <ListGroup>
          <div className='col-sm'>
        {
                    x.map((c) =>  <SingleCard x={c} />)
                }
          </div>   
        </ListGroup>
        
        
        </>
  )}  
    

  /*function MultiCards(props){
    return(
      <div>
          <ListGroup horizontal >
                {
                    props.map((c) => <SingleCard x={c}/>)
                }      
          </ListGroup>
      </div>
)  
}*/

function SingleCard(props){
  return(
<Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="./logo192.png" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content. {props.x}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
    
  );
}


export default Visitor;
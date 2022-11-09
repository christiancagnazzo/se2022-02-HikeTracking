import { Button } from "react-bootstrap";
function Hike(props) {

    return (       
        <>
        <h1 className="col-12 below-nav">Hey! non riceviamo alcuna risposta dal server! Prova a riaggiornare la pagina!</h1>
        <Button onClick={()=>props.setFlagSelectedHike(false)}>go back</Button>
        </>
    );
}
export default Hike;
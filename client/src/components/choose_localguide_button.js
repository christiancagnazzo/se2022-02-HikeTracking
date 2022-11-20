import { useState } from "react";
import { Button} from "react-bootstrap";
import LocalGuide from "./localguide";
import Localguide_hut_insert from "./localguide_hut_insert"


function Choose_localguide_button(){
    const [value,setValue]=useState(true)

return (
    value ? 
    <>
    <LocalGuide></LocalGuide>
    <Button variant="Danger" onClick={()=>{setValue(!value)}}>Do u want to insert an hut? click here</Button>
    </>
    :
    <>
    <Localguide_hut_insert></Localguide_hut_insert>
    <Button variant="Danger" onClick={()=>{setValue(!value)}}>Do u want to insert an hike? click here</Button>
    </>
)

}
export default Choose_localguide_button
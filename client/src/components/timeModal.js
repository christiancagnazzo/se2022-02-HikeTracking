import { Modal, Button,Alert, Row } from "react-bootstrap"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function TimeModal(props){
    let button = ""
    if(props.type === "reference"){
        button = <Button onClick={(e) => {
            props.onHide();
            props.handleSubmit(e);
        }}>Update Position</Button>
    }
    else if(props.type === "end"){
        button = <Button variant = "danger" onClick={(e) => {
            props.onHide();
            props.handleSubmit(e);
        }}>Terminate Hike</Button>
    }
    else {
        button = <Button  variant="success" onClick={(e) => {
            props.onHide();
            props.handleSubmit(e);
        }}>Start Hike</Button>
    }
    return (
         
            <Modal
              {...props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Do you want to adjust the time?
                </Modal.Title>
                
              </Modal.Header>
              <Modal.Body className="">
              {props.errorMessage ? <Alert variant='danger' className="mt-2" onClose={() => props.setErrorMessage('')} dismissible >{props.errorMessage}</Alert> : ''}
              <Row>
                <div align="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                
                renderInput={(props) => <TextField {...props} />}
                label=""
                value={props.time}
                onChange={(newValue) => {
                props.updateTime(newValue);
            }}
            />
           
            </LocalizationProvider>
            </div>
            </Row>
              </Modal.Body>
              <Modal.Footer>
                {button}
              </Modal.Footer>
            </Modal>
    )
}

export default TimeModal
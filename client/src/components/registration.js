import { Card, Form, Container, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function RegistrationForm(props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [errorMessage, setErrorMessage] = useState('') ;
    const navigate = useNavigate();


    function validateEmail(input){      
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(input); 
      } 
     
    
      const handleSubmit = (event) => {
          event.preventDefault();
          setErrorMessage('');
          const credentials = { username, password };
              
          if(username.trim().length === 0 || password.trim().length === 0)
              setErrorMessage('Compilare tutti i campi correttamente. ')
          else if(!validateEmail(username))
          {
            setErrorMessage('Formato email non valido')
          }
          else {
            props.login(credentials);
          }
      };

    return(
    <Container className="below-nav">
        <Card body>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="ascent">
                    <Form.Label>Role</Form.Label>
                    <Form.Select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="Hiker">Hiker</option>
                        <option value="Local guide">Local guide</option>
                    </Form.Select>
                </Form.Group>
                <div align ="center"> <Button className="mt-3" type="submit" variant="dark" onClick={handleSubmit}>Login</Button></div>
                <div align ="center"><Button className="mt-3" variant="dark" onClick={() => navigate(`/`)}>Go back</Button></div>
            </Form>
        </Card>
    </Container>
    )
}

export default RegistrationForm
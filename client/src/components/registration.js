import { Card, Form, Container, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import API from "../API";
import "../custom.css"

function RegistrationForm(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('Hiker')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function validateEmail(input) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(input);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { email: username, password: password, role: role };

        if (username.trim().length === 0 || password.trim().length === 0) {
            setErrorMessage('Invalid input, please write in the correct format. ')
        }
        else if (!validateEmail(username)) {
            setErrorMessage('invalid e-mail, Please put in correct e-mail ')
        }
        else {
            try {
                let result = await API.signin(credentials)
                if (result.error) {

                    setErrorMessage(result.msg)
                } else {
                    setUsername('')
                    setPassword('')

                    //This meesage does not mean error,just used this function to transfer message
                     setErrorMessage("User registered successfully")
                }
            }
            catch (e) {
                setErrorMessage(e)

            }

        }
    };

    return (
        <Container >
            <Card body className = "body-interface">
                <div className = "card-border-primary-mb-3">
                <h2 className='text-center'>Register Yourself: Let's Get Started!</h2>
                <Form className="form-alignment">
                    {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : false}

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Your Email Here (name@example.com)" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Choose Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="ascent">
                        <Form.Label>Choose Your Role</Form.Label>
                        <Form.Select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Hiker">Hiker</option>
                            <option value="Local Guide">Local Guide</option>
                        </Form.Select>
                    </Form.Group>
                    <div align = "center"> 
                        <Button id="btnReg" type="submit" variant="success" onClick={handleSubmit}>Register</Button>
                        &nbsp; &nbsp;
                        <Button id="btnBack" variant="danger" onClick={() => navigate(`/`)}>Go back</Button>
                    </div>
                </Form>
                </div>
            </Card>

        </Container>
    )
}

export default RegistrationForm

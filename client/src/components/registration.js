import { Card, Form, Container, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import API from "../API";

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
            setErrorMessage('Wrong format, please write in the correct format')
        }
        else if (!validateEmail(username)) {
            setErrorMessage('Invalid email format')
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
        <Container className="below-nav">
            <Card body>
                <h2 className='text-center'>Registration</h2>
                <Form>
                    {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible >{errorMessage}</Alert> : false}

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="ascent">
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Hiker">Hiker</option>
                            <option value="Local Guide">Local Guide</option>
                        </Form.Select>
                    </Form.Group>
                    <div align="center"> <Button className="mt-3" type="submit" variant="dark" onClick={handleSubmit}>Signin</Button></div>
                    <div align="center"><Button className="mt-3" variant="dark" onClick={() => navigate(`/`)}>Go back</Button></div>
                </Form>
            </Card>

        </Container>
    )
}

export default RegistrationForm

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

const Login = () => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
  };
    return (
        <div>
            <h1>Welcome to CHA Chatty</h1>
            <h2>Login</h2>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    
                    <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                    
                    <InputGroup hasValidation>
                        
                        <Form.Control
                        type="text"
                        placeholder="Username"
                        aria-describedby="inputGroupPrepend"
                        required
                        />
                        <Form.Control.Feedback type="invalid">
                        Please choose a username.
                        </Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                </Row>
                
               
                <Button type="submit">Submit form</Button>
            </Form>
  

        </div>
    )
}

export default Login


import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Login.css'; // import your custom CSS file

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    fetch("http://localhost:3000/login", {
      method: 'POST',
      mode: "cors",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({ ...formData })
    }).then(response => response.json()).then(data => { localStorage.setItem('name', data.username); window.location.href = '/protected' })
  }


  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="form-label">Email address</Form.Label>
          <Form.Control className="form-input" type="email" name="username" placeholder="Enter email" onChange={handleInputChange} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control className="form-input" type="password" name="password" placeholder="Password" onChange={handleInputChange} />
        </Form.Group>

        <Button className="submit-button" variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;


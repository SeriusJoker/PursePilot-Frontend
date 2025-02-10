import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to backend Google OAuth login route (Updated for production)
    window.location.href = 'https://pursepilot-backend.onrender.com/api/auth/google';
  };

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to PursePilot</h1>
      <p>Track your income and expenses easily.</p>
      <Button variant="primary" onClick={handleLogin}>
        Log in with Google
      </Button>
    </Container>
  );
}

export default LoginPage;

import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// ✅ Use environment variable for backend URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ✅ Redirect to backend Google OAuth login route
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  useEffect(() => {
    // ✅ Extract token from URL when redirected after login
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token); // ✅ Save token
      navigate('/dashboard'); // ✅ Redirect to dashboard
    }
  }, [navigate]);

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

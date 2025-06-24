import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { AuthContext } from './AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      localStorage.clear();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);
      setUser(data.user);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      alert(data.error || 'Login failed');
    }
  };

  // Shared style for input fields
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#ffffff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#999',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#666',
    },
    '& .MuiInputLabel-root': {
      color: '#333',
    },
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Card sx={{ width: 400, p: 2, borderRadius: 4, backgroundColor: '#f5f5f5', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {success && <Typography align="center" sx={{ color: 'green', my: 1 }}>✅ Logged in successfully!</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={inputStyles}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={inputStyles}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;

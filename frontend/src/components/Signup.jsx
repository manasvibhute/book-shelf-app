import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      alert(data.error || 'Signup failed');
    }
  };

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
          <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
          {success && (
            <Typography align="center" sx={{ color: 'green', my: 1 }}>
              ✅ Account created! Redirecting to login...
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={inputStyles}
            />
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
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Create Account
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Log In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Signup;

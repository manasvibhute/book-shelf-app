import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields({
      name: true,
      email: true,
      password: true
    });

    // Check if any field is empty
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark the field as touched
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const getInputStyles = (fieldName) => {
    const isTouched = touchedFields[fieldName];
    const hasValue = formData[fieldName].trim() !== '';
    
    return {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        '& fieldset': {
          borderColor: hasValue ? '#4caf50' : (isTouched ? '#f44336' : '#999'),
        },
        '&:hover fieldset': {
          borderColor: hasValue ? '#2e7d32' : (isTouched ? '#d32f2f' : '#666'),
        },
        '&.Mui-focused fieldset': {
          borderColor: hasValue ? '#2e7d32' : (isTouched ? '#d32f2f' : '#3f51b5'),
        },
      },
      '& .MuiInputLabel-root': {
        color: hasValue ? '#4caf50' : (isTouched ? '#f44336' : '#333'),
      },
      '& .MuiFormHelperText-root': {
        color: isTouched && !hasValue ? '#f44336' : 'inherit',
      },
    };
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
              name="name"
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.name && !formData.name.trim()}
              helperText={touchedFields.name && !formData.name.trim() ? 'Name is required' : ''}
              sx={getInputStyles('name')}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.email && !formData.email.trim()}
              helperText={touchedFields.email && !formData.email.trim() ? 'Email is required' : ''}
              sx={getInputStyles('email')}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.password && !formData.password.trim()}
              helperText={touchedFields.password && !formData.password.trim() ? 'Password is required' : ''}
              sx={getInputStyles('password')}
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
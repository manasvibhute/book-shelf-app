import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { AuthContext } from './AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' }); //It stores what the user types in the email and password boxes and update it using setFormData(...)
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  }); //This remembers if the user clicked or typed in the email/password boxes. If they didn’t, and click Login — it shows red borders (error messages)
  const [success, setSuccess] = useState(false);
  const { setUser } = useContext(AuthContext); //You get access to a global memory called AuthContext. You use setUser(...) to save the logged-in user everywhere in the app. So the app knows: "This person is logged in!"
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouchedFields({
      email: true,
      password: true
    });

    // Check if any field is empty
    if (!formData.email || !formData.password) {
      return;
    }

    console.log("Sending login:", formData);
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.clear();
      localStorage.setItem('token', data.token); //It's like a tiny drawer in the browser where you can save stuff (like tokens). Used to remember who's logged in
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);
      setUser(data.user);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handleChange = (e) => { //e = It’s the event object that React sends when something happens (like typing). e.target is the input box where the event happened
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
//#fef3e3
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Card sx={{ width: 400, p: 2, borderRadius: 4, backgroundColor: '#f5f5f5', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {success && <Typography align="center" sx={{ color: 'green', my: 1 }}>✅ Logged in successfully!</Typography>}

          <form onSubmit={handleSubmit}>
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
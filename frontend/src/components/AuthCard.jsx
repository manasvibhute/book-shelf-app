// components/AuthCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import LoginForm from './Login';
import SignupForm from './Signup';

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card sx={{ backgroundColor:'#fef3e3',maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center">
          {isLogin ? 'Login to BookShelf' : 'Create an Account'}
        </Typography>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <Typography align="center" sx={{ mt: 2 }}>
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <Button variant="text" onClick={() => setIsLogin(false)}>Sign Up</Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="text" onClick={() => setIsLogin(true)}>Login</Button>
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AuthCard;

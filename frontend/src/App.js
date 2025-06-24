import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookShelfApp from './components/home';
import { AuthProvider } from './components/AuthContext';
import AddBookMain from './components/AddBookMain';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BookShelfApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-book" element={<AddBookMain />} />
          
          {/* 🔐 PROTECTED DASHBOARD ROUTE */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

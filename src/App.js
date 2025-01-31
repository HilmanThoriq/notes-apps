import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { NotesProvider } from './NotesContext';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotesDashboard from './components/Notes/NotesDashboard';
import CreateEditNote from './components/Notes/CreateEditNote';
import Collaboration from './components/Notes/Collaboration';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <Main />
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<NotesDashboard />} />
        <Route path="/create" element={<CreateEditNote />} />
        <Route path="/edit/:id" element={<CreateEditNote />} />
        <Route path="/collaboration" element={<Collaboration />} />
      </Routes>
    </>
  );
}

export default App;

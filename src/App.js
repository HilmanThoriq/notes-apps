import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { NotesProvider } from './NotesContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotesDashboard from './components/Notes/NotesDashboard';
import CreateEditNote from './components/Notes/CreateEditNote';
import Collaboration from './components/Notes/Collaboration';
import NoteDetail from './components/Notes/NoteDetail';

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

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<NotesDashboard />} />
        <Route path="/create" element={<CreateEditNote />} />
        <Route path="/edit/:id" element={<CreateEditNote />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/collaboration" element={<Collaboration />} />
      </Routes>
    </>
  );
}

export default App;

import React from 'react';
import { AuthProvider } from './AuthContext';
import { NotesProvider } from './NotesContext';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import CreateNote from './components/CreateNote';

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <div className="App">
          <h1>Aplikasi Catatan</h1>
          <Login />
          <Register />
          <NotesList />
          <CreateNote />
        </div>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;

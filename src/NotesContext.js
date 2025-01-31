import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from './apiServices';

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const response = await getNotes();
    setNotes(response.data.notes);
  };

  const addNote = async (noteData) => {
    await createNote(noteData);
    fetchNotes();
  };

  const updateNoteById = async (noteId, noteData) => {
    await updateNote(noteId, noteData);
    fetchNotes();
  };

  const deleteNoteById = async (noteId) => {
    await deleteNote(noteId);
    fetchNotes();
  };

  return (
    <NotesContext.Provider value={{ notes, fetchNotes, addNote, updateNote: updateNoteById, deleteNote: deleteNoteById }}>
      {children}
    </NotesContext.Provider>
  );
};
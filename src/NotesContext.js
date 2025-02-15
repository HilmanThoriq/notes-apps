import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getNotes,
  createNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  getNoteById as apiGetNoteById
} from './apiServices';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Fetch notes from API
  const fetchNotes = async () => {
    const response = await getNotes();
    setNotes(response.data.notes);
  };

  const getNoteById = async (noteId) => {
    const response = await apiGetNoteById(noteId);
    console.log('Response from getNoteById:', response); 

    return response.data.notes.find(note => note.note_id === noteId); 
  };

  // Get all unique tags function
  const getAllTags = () => {
    const allTags = notes.reduce((tags, note) => {
      if (note.tags) {
        const noteTags = note.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        return [...tags, ...noteTags];
      }
      return tags;
    }, []);
    return [...new Set(allTags)].sort();
  };

  // Get all unique folders function
  const getAllFolders = () => {
    const allFolders = notes.reduce((folders, note) => {
      if (note.folder && note.folder.trim()) {
        return [...folders, note.folder.trim()];
      }
      return folders;
    }, []);
    return [...new Set(allFolders)].sort();
  };

  // Add note
  const addNote = async (noteData) => {
    try {
      await createNote(noteData);
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  // Update note
  const updateNoteById = async (noteId, noteData) => {
    try {
      await apiUpdateNote(noteId, noteData);
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  // Delete note
  const deleteNoteById = async (noteId) => {
    try {
      await apiDeleteNote(noteId);
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const value = {
    notes,
    fetchNotes,
    addNote,
    updateNote: updateNoteById,
    deleteNote: deleteNoteById,
    getAllTags,
    getAllFolders,
    getNoteById
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
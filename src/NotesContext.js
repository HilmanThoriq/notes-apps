import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNotes,
  revokeShare,
} from './apiServices';

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.data.notes);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSharedNotes = async () => {
      try {
        const response = await getSharedNotes();
        setSharedNotes(response.data.shared_notes);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
    fetchSharedNotes();
  }, []);

  const addNote = async (noteData) => {
    try {
      const response = await createNote(noteData);
      setNotes([...notes, response.data.note]);
    } catch (error) {
      setError(error);
    }
  };

  const fetchNoteById = async (noteId) => {
    try {
      const response = await getNoteById(noteId);
      return response.data.note;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const updateNoteById = async (noteId, noteData) => {
    try {
      const response = await updateNote(noteId, noteData);
      setNotes(notes.map((note) => (note.note_id === noteId ? response.data.note : note)));
    } catch (error) {
      setError(error);
    }
  };

  const deleteNoteById = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note.note_id !== noteId));
    } catch (error) {
      setError(error);
    }
  };

  const shareNoteById = async (noteId, shareData) => {
    try {
      await shareNote(noteId, shareData);
      // Pilihan: refetch catatan berbagi atau perbarui state
    } catch (error) {
      setError(error);
    }
  };

  const revokeShareById = async (noteId, shareId) => {
    try {
      await revokeShare(noteId, shareId);
      // Pilihan: refetch catatan berbagi atau perbarui state
    } catch (error) {
      setError(error);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        sharedNotes,
        loading,
        error,
        addNote,
        fetchNoteById,
        updateNoteById,
        deleteNoteById,
        shareNoteById,
        revokeShareById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
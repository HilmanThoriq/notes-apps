import React, { useContext } from 'react';
import { useNotes } from '../NotesContext';

function NotesList() {
  const { notes, loading, error } = useNotes();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Catatan</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.note_id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;

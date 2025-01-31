import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../NotesContext';
import gdgLogo from '../../images/gdg_logo.jpg';

const CreateEditNote = ({ note }) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const { addNote, updateNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Notes Apps | Create Note"; 
    const link = document.querySelector("link[rel~='icon']"); 
    if (link) {
      link.href = gdgLogo;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note) {
      await updateNote(note.note_id, { title, content });
    } else {
      await addNote({ title, content });
    }
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{note ? 'Edit Catatan' : 'Buat Catatan Baru'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
        />
        <textarea
          placeholder="Isi Catatan"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Simpan</button>
      </form>
    </div>
  );
};

export default CreateEditNote;
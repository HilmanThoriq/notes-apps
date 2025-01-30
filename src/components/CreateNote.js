import React, { useState, useContext } from 'react';
import { useNotes } from '../NotesContext';

function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addNote } = useNotes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNote({ title, content });
      setTitle('');
      setContent('');
      alert('Catatan berhasil dibuat!');
    } catch (error) {
      alert('Gagal membuat catatan. Silakan coba lagi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Buat Catatan</h2>
      <input
        type="text"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Isi"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Buat Catatan</button>
    </form>
  );
}

export default CreateNote;

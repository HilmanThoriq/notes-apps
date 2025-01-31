import React, { useEffect } from 'react';
import { useNotes } from '../../NotesContext';
import { Link } from 'react-router-dom';
import gdgLogo from '../../images/gdg_logo.jpg';
import '../Poppins.css';

const NotesDashboard = () => {
  const { notes, getNotes } = useNotes();

  useEffect(() => {
    document.title = "Notes Apps | Dashboard"; 
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    };
    getNotes();
  }, [getNotes]);


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notes Dashboard</h2>
      <Link to="/create" className="bg-blue-500 text-white p-2 rounded mb-4 inline-block">Buat Catatan Baru</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.note_id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.content.substring(0, 50)}...</p>
            <p className="text-gray-500">{note.updated_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesDashboard;
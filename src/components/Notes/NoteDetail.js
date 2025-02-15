import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNoteById } from '../../apiServices';
import { useAuth } from '../../AuthContext';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import gdgLogo from '../../images/gdg_logo.jpg';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Notes Apps | Detail Note";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    }

    const fetchNoteDetails = async () => {
      try {
        const response = await getNoteById(id);
        console.log('Respons API:', response); // Tambahkan ini
        console.log('Data Note:', response.data); // Tambahkan ini
        setNote(response.data.note);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching note details:', err);
        setError('Failed to fetch note details');
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading note details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No note found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-poppins">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
          </div>
          <Link 
            to={`/edit/${id}`} 
            className="flex items-center text-white bg-blue-500 hover:bg-blue-600 p-3 rounded-lg transition-colors"
          >
            <FaEdit className="mr-0 sm:mr-2" /> <span className="hidden sm:block font-semibold">Edit Note</span>
          </Link>
        </div>

        <div className="mb-6">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tags</h3>
            {note.tags && note.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tags</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Folder</h3>
            <p className="text-gray-600">{note.folder || 'Uncategorized'}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Created at</h3>
              <p className="text-gray-600">{formatDate(note.created_at)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Updated at</h3>
              <p className="text-gray-600">{formatDate(note.updated_at || note.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
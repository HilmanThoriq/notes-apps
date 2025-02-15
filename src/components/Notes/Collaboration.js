import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gdgLogo from '../../images/gdg_logo.jpg';
import { Share2, Clock, Users, Eye, Edit2, XCircle, CircleArrowLeft } from 'lucide-react';
import { getNotes, shareNote, getSharedNotes, revokeShare } from '../../apiServices';
import Select from 'react-select';

const Collaboration = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [notes, setNotes] = useState([]);
  const [sharingHistory, setSharingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes and sharing history on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesResponse = await getNotes();
        const sharedNotesResponse = await getSharedNotes();

        // Extract notes from the response
        if (notesResponse && notesResponse.data && Array.isArray(notesResponse.data.notes)) {
          setNotes(notesResponse.data.notes); // Access the notes array
        } else {
          console.error("getNotes() did not return an array:", notesResponse);
          setError('Failed to fetch notes. Please try again later.');
        }

        // Extract shared notes from the response
        if (sharedNotesResponse && sharedNotesResponse.data) {
          // Assuming shared notes are in sharedNotesResponse.data.sharedNotes or similar
          const sharedNotesData = Array.isArray(sharedNotesResponse.data.sharedNotes)
            ? sharedNotesResponse.data.sharedNotes
            : Array.isArray(sharedNotesResponse.data.data)
              ? sharedNotesResponse.data.data
              : [];
          setSharingHistory(sharedNotesData);
        } else {
          console.error("getSharedNotes() did not return an array:", sharedNotesResponse);
          setError('Failed to fetch shared notes. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Notes Apps | Collaboration";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    }
  }, []);

  const handleShare = async () => {
    if (email && selectedNote) {
      try {
        await shareNote(selectedNote.value, {
          email,
          permission
        });

        // Refresh sharing history after successful share
        const sharedNotesResponse = await getSharedNotes();
        const sharedNotesData = Array.isArray(sharedNotesResponse.data.data)
          ? sharedNotesResponse.data.data
          : Array.isArray(sharedNotesResponse.data)
            ? sharedNotesResponse.data
            : [];
        setSharingHistory(sharedNotesData);

        // Reset form
        setEmail('');
        setSelectedNote(null);
        setPermission('view');
      } catch (err) {
        setError('Failed to share note. Please try again.');
        console.error('Error sharing note:', err);
      }
    }
  };

  const handleRevokeAccess = async (noteId, shareId) => {
    try {
      await revokeShare(noteId, shareId);

      // Refresh sharing history after successful revoke
      const sharedNotesResponse = await getSharedNotes();
      const sharedNotesData = Array.isArray(sharedNotesResponse.data.data)
        ? sharedNotesResponse.data.data
        : Array.isArray(sharedNotesResponse.data)
          ? sharedNotesResponse.data
          : [];
      setSharingHistory(sharedNotesData);
    } catch (err) {
      setError('Failed to revoke access. Please try again.');
      console.error('Error revoking access:', err);
    }
  };

  const noteOptions = notes.map(note => ({
    value: note.note_id,
    label: note.title
  }));

  const permissionOptions = [
    { value: 'view', label: 'Viewer' },
    { value: 'edit', label: 'Editor' }
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      transition: 'all 0.2s ease',
      boxShadow: state.isFocused ? '0 0 0 1px #6574cd' : 'none',
      borderColor: state.isFocused ? '#6574cd' : '#e2e8f0',
      '&:hover': {
        borderColor: '#a0aec0',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#4a5568',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a0aec0',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6574cd' : state.isFocused ? '#e0e7ff' : 'white',
      color: state.isSelected ? 'white' : state.isFocused ? '#4a5568' : '#4a5568',
      '&:hover': {
        backgroundColor: '#e0e7ff',
      },
    }),
  };

  return (
    <div className="container mx-auto p-6 lg:p-12">
      <div className="flex justify-between items-center gap-3 mb-8">
        <div className='flex items-center'>
          <Share2 className="w-8 h-8 text-blue-700" />
          <h2 className="text-3xl font-bold text-gray-800 pl-3">Collaboration</h2>
        </div>
        <Link to="/dashboard" className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
          <CircleArrowLeft />
          <span className="font-bold px-2 items-center hidden sm:block">Back to Dashboard</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Share Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6 pl-1">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-800">Share Specific Note</h3>
        </div>

        <div className="space-y-6">
          {/* Note Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Note
            </label>
            <Select
              value={selectedNote}
              onChange={setSelectedNote}
              options={noteOptions}
              placeholder="Choose a note to share"
              styles={customStyles}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-4  custom-mt">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <Select
              value={permission}
              onChange={setPermission}
              options={permissionOptions}
              styles={customStyles}
              className="w-full sm:w-auto"
              placeholder="Select Permission"
              classNamePrefix="select"
            />
            <button
              onClick={handleShare}
              disabled={!selectedNote || !email}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 text-white text-center justify-center font-semibold rounded-lg hover:bg-blue-700 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6 pl-1">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-800">Sharing History</h3>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : sharingHistory && sharingHistory.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-4 text-gray-600 font-medium">Note Title</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-medium">Shared With</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-medium">Access Level</th>
                  <th className="text-left py-4 px-4 text-gray-600 font-medium">Shared At</th>
                  <th className="text-center py-4 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sharingHistory.map((share) => (
                  <tr key={share.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4">{share.note_title || share.noteTitle}</td>
                    <td className="py-4 px-4">{share.shared_with_email || share.email}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${share.permission === 'edit'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-50 text-blue-700'
                        }`}>
                        {share.permission === 'edit' ? <Edit2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {share.permission === 'edit' ? 'Editor' : 'Viewer'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(share.shared_at || share.sharedAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleRevokeAccess(share.note_id || share.noteId, share.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors duration-150"
                      >
                        <XCircle className="w-4 h-4" />
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No notes have been shared with other users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collaboration;

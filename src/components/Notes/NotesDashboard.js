import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotes } from '../../apiServices';
import { useAuth } from '../../AuthContext';
import Sidebar from '../Sidebar';
import gdgLogo from '../../images/gdg_logo.jpg';
import { FaSearch } from 'react-icons/fa';
import { BsFillPinAngleFill } from "react-icons/bs";
import '../Poppins.css';
import '../NoteCard.css';

const NoteCard = ({ note }) => {
  const truncateContent = (content, maxLength = 230) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderFormattedContent = (content) => {
    return { __html: content };
  };

  return (
    <Link 
      to={`/notes/${note.note_id}`} 
      className="block hover:scale-105 transition-transform duration-300"
    >
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold">{note.title}</h3>
          {note.is_pinned == true && (
            <BsFillPinAngleFill className="text-blue-500 ml-2" />
          )}
        </div>
        <div 
          className="text-gray-600 mb-6"
          dangerouslySetInnerHTML={renderFormattedContent(truncateContent(note.content))}
        />

        <div className="flex justify-between items-start mt-auto">
          <div className="flex-1 overflow-x-auto mr-4 no-scrollbar">
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 font-semibold whitespace-nowrap">
            {formatDate(note.updatedAt || note.created_at)}
          </div>
        </div>
      </div>
    </Link>
  );
};

const GroupDivider = ({ title }) => (
  <div className="w-full flex items-center gap-4 my-6">
    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{title}</span>
    <div className="h-px bg-gray-300 flex-grow"></div>
  </div>
);

const NotesDashboard = () => {
  const [sortBy, setSortBy] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Notes Apps | Dashboard";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    }

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await getNotes();
        const fetchedNotes = Array.isArray(response.data)
          ? response.data
          : (response.data.notes || []);
        setNotes(fetchedNotes);
        setFilteredNotes(fetchedNotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes');
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      (note.tags && note.tags.some(tag =>
        tag.toLowerCase().includes(term)
      ))
    );

    setFilteredNotes(filtered);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const groupAndSortNotes = (notes, sortOption) => {
    // First separate pinned and unpinned notes
    const pinnedNotes = notes.filter(note => note.is_pinned == true);
    const unpinnedNotes = notes.filter(note => note.is_pinned == false);

    switch (sortOption) {
      case 'All':
        return [
          ...(pinnedNotes.length > 0 ? [{
            title: 'Pinned Notes',
            notes: pinnedNotes
          }] : []),
          ...(unpinnedNotes.length > 0 ? [{
            title: 'Other Notes',
            notes: unpinnedNotes
          }] : [])
        ];

      case 'Tag':
        const tagGroups = {};
        
        // Process pinned notes first
        pinnedNotes.forEach(note => {
          const tags = note.tags?.length ? note.tags : ['Untagged'];
          tags.forEach(tag => {
            if (!tagGroups[tag]) tagGroups[tag] = { pinned: [], unpinned: [] };
            tagGroups[tag].pinned.push(note);
          });
        });

        // Then process unpinned notes
        unpinnedNotes.forEach(note => {
          const tags = note.tags?.length ? note.tags : ['Untagged'];
          tags.forEach(tag => {
            if (!tagGroups[tag]) tagGroups[tag] = { pinned: [], unpinned: [] };
            tagGroups[tag].unpinned.push(note);
          });
        });

        // Sort groups alphabetically by tag name
        return Object.entries(tagGroups)
          .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
          .map(([tag, { pinned, unpinned }]) => ({
            title: tag,
            notes: [...pinned, ...unpinned]
          }));

      case 'Date':
        const dateGroups = {};
        
        // Combine and sort all notes by date
        [...pinnedNotes, ...unpinnedNotes].forEach(note => {
          const date = new Date(note.updatedAt || note.created_at)
            .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          if (!dateGroups[date]) dateGroups[date] = { pinned: [], unpinned: [] };
          note.isPinned ? dateGroups[date].pinned.push(note) : dateGroups[date].unpinned.push(note);
        });

        // Sort by date descending
        return Object.entries(dateGroups)
          .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
          .map(([date, { pinned, unpinned }]) => ({
            title: date,
            notes: [...pinned, ...unpinned]
          }));

      case 'Alphabet':
        const alphabetGroups = {};
        
        // Group notes by first letter
        [...pinnedNotes, ...unpinnedNotes].forEach(note => {
          const firstLetter = note.title.charAt(0).toUpperCase();
          if (!alphabetGroups[firstLetter]) alphabetGroups[firstLetter] = { pinned: [], unpinned: [] };
          note.isPinned ? alphabetGroups[firstLetter].pinned.push(note) : alphabetGroups[firstLetter].unpinned.push(note);
        });

        // Sort alphabetically
        return Object.entries(alphabetGroups)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, { pinned, unpinned }]) => ({
            title: `${letter}`,
            notes: [...pinned, ...unpinned]
          }));

      default:
        return [{ title: '', notes }];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading notes...
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-red-500">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <div className="flex items-center justify-center flex-1">
            <div className="relative w-full sm:w-3/4 lg:w-3/5">
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={handleSearch}
                className="border rounded pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
          <span className="text-gray-800 font-semibold ml-4 hidden sm:block sm:mr-8 lg:mr-12">Hello, {user?.name || 'User'} !</span>
        </div>
      </header>

      <div className="flex pt-16">
        <div className={`fixed left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`} 
             style={{ top: '4rem', width: '16rem' }}>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            tags={[]}
            folders={[]}
          />
        </div>

        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 sm:ml-64' : 'ml-0'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-0 sm:mb-2 px-4 sm:px-8 lg:px-12 pt-6 lg:pt-10">
            <div className="flex flex-col md:flex-row items-start md:items-center w-full lg:w-auto">
              <span className="mr-4 font-medium">Sort By :</span>
              <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                <button onClick={() => setSortBy('All')} 
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">All</button>
                <button onClick={() => setSortBy('Tag')} 
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Tag</button>
                <button onClick={() => setSortBy('Date')} 
                        className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Date</button>
                <button onClick={() => setSortBy('Alphabet')} 
                        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Alphabet</button>
              </div>
            </div>

            <div className="flex flex-row w-full lg:w-auto justify-center gap-2 mt-6 sm:mt-8 lg:mt-0">
              <Link to="/create" 
                    className="flex justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-auto">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create Note
              </Link>

              <Link to="/collaboration" 
                    className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-auto">
                Collaboration
              </Link>
            </div>
          </div>

          <main className="px-4 pb-4 pt-4 sm:px-8 sm:pb-8 lg:px-12 lg:pb-12">
            {filteredNotes.length === 0 ? (
              <div className="text-center text-gray-500">
                No notes found. Create your first note!
              </div>
            ) : (
              <div className="space-y-8">
                {groupAndSortNotes(filteredNotes, sortBy).map((group, index) => (
                  <div key={index}>
                    {group.title && <GroupDivider title={group.title} />}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.notes.map(note => (
                        <NoteCard key={note.id || note._id} note={note} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesDashboard;

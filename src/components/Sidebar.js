import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotes } from '../apiServices';
import { FaBars, FaTimes, FaFolder, FaTags, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        const response = await getNotes();
        // console.log('Fetched notes:', response.data);
        
        // Ekstrak tag unik dari seluruh notes
        const uniqueTags = [...new Set(
          response.data.notes.flatMap(note => 
            note.tags ? note.tags.map(tag => tag.toLowerCase()) : []
          )
        )].map(tag => ({ 
          id: tag, 
          name: tag 
        }));
    

        // Ekstrak folder unik dari seluruh notes
        const uniqueFolders = [...new Set(
          response.data.notes
            .map(note => note.folder.toLowerCase())
            .filter(folder => folder)
        )].map(folder => ({ 
          id: folder, 
          name: folder 
        }));

        setTags(uniqueTags);
        setFolders(uniqueFolders);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotesData();
  }, []);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out w-64 z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b mt-4">
          <h2 className="text-xl font-semibold text-gray-800">Notes App</h2>
        </div>

        <div className="flex flex-col h-[calc(100%-64px)]">
          <div className="flex-1">
            {/* Tags Section */}
            <div className="mt-2 px-4 py-3">
              <button
                onClick={() => setIsTagsOpen(!isTagsOpen)}
                className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 mb-3"
              >
                <div className="flex items-center gap-2">
                  <FaTags />
                  <span className="font-bold">Tags ({tags.length})</span>
                </div>
                {isTagsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {isTagsOpen && (
                <div className="mt-2 ml-6 space-y-2">
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/tags/${tag.id}`}
                      className="block text-gray-600 hover:text-gray-900"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Folders Section */}
            <div className="px-4 py-3 ">
              <button
                onClick={() => setIsFoldersOpen(!isFoldersOpen)}
                className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 mb-3"
              >
                <div className="flex items-center gap-2 bg">
                  <FaFolder />
                  <span className="font-bold">Folders ({folders.length})</span>
                </div>
                {isFoldersOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {isFoldersOpen && (
                <div className="mt-2 ml-6 space-y-2">
                  {folders.map((folder, index) => (
                    <Link
                      key={index}
                      to={`/folders/${folder.id}`}
                      className="block text-gray-600 hover:text-gray-900"
                    >
                      {folder.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Divider and Buttons right after folders */}
            <div className="border-t border-gray-200 mt-4"></div>
            <div className="p-4 space-y-3">
              <Link
                to="/collaboration"
                className="flex justify-center items-center text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
              >
                Collaboration
              </Link>

              <Link
                to="/create"
                className="flex justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create Note
              </Link>
            </div>
          </div>

          {/* Logout button at the bottom */}
          <div className="mt-auto p-4 mb-2">
            <Link
                to="/login"
              className="flex justify-center items-center w-full text-white bg-gradient-to-r from-red-400 to-red-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
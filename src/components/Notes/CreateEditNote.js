import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadDocument, getNoteById } from '../../apiServices';
import { useNotes } from '../../NotesContext';
import gdgLogo from '../../images/gdg_logo.jpg';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import Swal from 'sweetalert2';
import {
  Bold,
  Italic,
  List,
  Heading,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  ListOrdered,
  Trash2,
  Pin,
  X,
  FileText,
  Hash,
  Folder,
  Heading2Icon,
  Heading1Icon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon
} from 'lucide-react';

const CreateEditNote = () => {
  const { id } = useParams();
  const noteId = Number(id);
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [folder, setFolder] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showFoldersDropdown, setShowFoldersDropdown] = useState(false);

  console.log("Extracted noteId from URL:", noteId);
  console.log("getNoteById is called with noteId:", noteId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg p-4',
        },
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Document,
      Placeholder.configure({
        placeholder: 'Mulai menulis catatan Anda di sini...',
      }),
    ],
    content: '',
  });

  const { addNote, updateNote, deleteNote, getAllTags, getAllFolders } = useNotes();
  const navigate = useNavigate();

  // Fetch available tags and folders on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userTags = await getAllTags();
      const userFolders = await getAllFolders();
      setAvailableTags(userTags);
      setAvailableFolders(userFolders);
    };
    fetchData();
  }, []);

  // Fetch note data if noteId exists
  useEffect(() => {
    if (noteId && editor && !editor.isDestroyed) {
      const fetchNote = async () => {
        try {
          const fetchedNote = await getNoteById(noteId);
          console.log('Fetched Note:', fetchedNote);

          const noteData = fetchedNote.data.note;
  
          if (noteData) {
            setTitle(noteData.title || '');
            setTags(noteData.tags || []);
            setFolder(noteData.folder || '');
            setIsPinned(noteData.is_pinned === 1);

            console.log('Note Content:', noteData.content); 
            
            console.log("Editor status:", editor.isDestroyed);
            if (!editor.isDestroyed) {
              editor.commands.setContent(noteData.content || '');
            } else {
              console.warn("Editor belum siap, menunggu...");
            }
          }
        } catch (error) {
          console.error('Error fetching note:', error);
          Swal.fire('Error', 'Gagal mengambil catatan.', 'error');
        }
      };
      fetchNote();
    }
  }, [noteId, editor]);
  

  useEffect(() => {
    document.title = noteId ? "Notes Apps | Edit Note" : "Notes Apps | Create Note";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    }
  }, [noteId]);

  const handleTagAdd = (newTag) => {
    if (tags.length >= 3) {
      Swal.fire({
        title: 'Batas Tag',
        text: 'Anda hanya dapat menambahkan maksimal 3 tag per catatan!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please select an image file', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        editor?.chain().focus().setImage({ src: reader.result }).run();
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('Error', 'Failed to upload image', 'error');
      setIsUploading(false);
    }
  }, [editor]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please use the image upload button for images', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const documentUrl = await uploadDocument(file);
      editor?.chain().focus().insertContent(`
        <div class="document-attachment p-3 bg-gray-50 rounded-lg my-2 flex items-center gap-2">
          <FileText size={20} />
          <span>${file.name}</span>
          <a href="${documentUrl}" target="_blank" class="text-blue-600 hover:underline">View</a>
        </div>
      `).run();
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire('Error', 'Failed to upload file', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const MenuButton = ({ onClick, icon: Icon, active, title }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded-lg transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      title={title}
      type="button"
    >
      <Icon size={18} />
    </button>
  );

  if (!noteId) {
    console.error("Error: noteId is undefined or null");
    return;
  }

  // Editor toolbar actions
  const toggleHeading1 = () => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  };

  const toggleHeading2 = () => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  };

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = {
      title,
      content: editor?.getHTML() || '',
      tags: tags,
      folder,
      is_pinned: isPinned
    };

    try {
      // Tambahkan log untuk debugging
      console.log('Submitting note data:', noteData);
      console.log('Current token:', localStorage.getItem('auth_token'));

      if (noteId) {
        await updateNote(noteId, noteData);
      } else {
        await addNote(noteData);
      }
      navigate('/dashboard');
    } catch (error) {
      // Log detail error
      console.error('Error full object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);

      Swal.fire('Error', `Gagal menyimpan catatan: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Hapus Catatan?',
      text: "Catatan yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed && noteId) {
      try {
        await deleteNote(noteId);
        Swal.fire('Terhapus!', 'Catatan berhasil dihapus.', 'success');
        navigate('/dashboard');
      } catch (error) {
        Swal.fire('Error!', 'Gagal menghapus catatan.', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Title Note ...."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent outline-none flex-grow"
              required
            />
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg transition-colors ${isPinned ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'
                }`}
              title={isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin size={18} />
            </button>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-1 justify-center sm:justify-normal">
          <MenuButton
            onClick={toggleHeading1}
            icon={Heading1Icon}
            active={editor?.isActive('heading', { level: 1 })}
            title="Heading 1"
          />
          <MenuButton
            onClick={toggleHeading2}
            icon={Heading2Icon}
            active={editor?.isActive('heading', { level: 2 })}
            title="Heading 2"
          />
          <MenuButton
            onClick={toggleBold}
            icon={BoldIcon}
            active={editor?.isActive('bold')}
            title="Bold"
          />
          <MenuButton
            onClick={toggleItalic}
            icon={ItalicIcon}
            active={editor?.isActive('italic')}
            title="Italic"
          />
          <MenuButton
            onClick={toggleBulletList}
            icon={ListIcon}
            active={editor?.isActive('bulletList')}
            title="Bullet List"
          />
          <MenuButton
            onClick={toggleOrderedList}
            icon={ListOrderedIcon}
            active={editor?.isActive('orderedList')}
            title="Numbered List"
          />
          <label className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <ImageIcon size={18} className={isUploading ? 'opacity-50' : ''} />
          </label>
          <label className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <FileText size={18} className={isUploading ? 'opacity-50' : ''} />
          </label>
        </div>

        {/* Editor Content */}
        <div className="p-4">
          <EditorContent
            editor={editor}
            className="min-h-[300px] prose max-w-none focus:outline-none border rounded-lg p-3"
          />
        </div>

        {/* Tags and Folder */}
        <div className="p-4 border-t space-y-3">
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Tambah atau pilih tag (maksimal 3)"
                    className="w-full p-2 rounded-lg bg-gray-50 text-sm"
                    onFocus={() => setShowTagsDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleTagAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  {showTagsDropdown && availableTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                      {availableTags.map((tag, index) => (
                        <button
                          key={index}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => {
                            handleTagAdd(tag);
                            setShowTagsDropdown(false);
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <div className="flex items-center gap-2 mb-4 mt-3 sm:mt-0">
                  <Folder size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">Folder</span>
                </div>
                <div className="relative ">
                  <input
                    type="text"
                    placeholder="Tambah atau pilih folder"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-50 text-sm"
                    onFocus={() => setShowFoldersDropdown(true)}
                  />
                  {showFoldersDropdown && availableFolders.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                      {availableFolders.map((folderName, index) => (
                        <button
                          key={index}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => {
                            setFolder(folderName);
                            setShowFoldersDropdown(false);
                          }}
                        >
                          {folderName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {noteId ? 'Simpan Perubahan' : 'Buat Catatan'}
            </button>
            {noteId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Hapus
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditNote;

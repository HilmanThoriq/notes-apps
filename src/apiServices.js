import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Accept': 'application/json', // memastikan backend mengembalikan respon JSON 
  },
});

// Tambahkan interceptor request untuk menyertakan token di header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fungsi autentikasi
export const registerUser = (userData) => {
  return apiClient.post('/register', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/login', credentials);
};

export const logoutUser = () => {
  return apiClient.post('/logout');
};

// Fungsi catatan
export const getNotes = () => {
  return apiClient.get('/notes');
};

export const createNote = (noteData) => {
  return apiClient.post('/notes', noteData);
};

export const getNoteById = (noteId) => {
  return apiClient.get(`/notes/${noteId}`);
};

export const updateNote = (noteId, noteData) => {
  return apiClient.put(`/notes/${noteId}`, noteData);
};

export const deleteNote = (noteId) => {
  return apiClient.delete(`/notes/${noteId}`);
};

// Fungsi berbagi
export const shareNote = (noteId, shareData) => {
  return apiClient.post(`/notes/${noteId}/share`, shareData);
};

export const getSharedNotes = () => {
  return apiClient.get('/notes/shared');
};

export const revokeShare = (noteId, shareId) => {
  return apiClient.delete(`/notes/${noteId}/share/${shareId}`);
};
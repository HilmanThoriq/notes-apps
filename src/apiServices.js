import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://gdgoc-noteapp.my.id/',
  headers: {
    'Accept': 'application/json', // memastikan backend mengembalikan respon JSON 
  },
});

// Menambahkan interceptor request untuk menyertakan token di header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    console.log('Current token:', token);  // Debugging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
  (response) => response,
  (error) => {
    console.log('API Error:', {
      config: error.config,
      response: error.response,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Fungsi untuk mengunggah dokumen
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url; // Sesuaikan dengan struktur respons dari server
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error; // Lempar error agar bisa ditangani di tempat lain
  }
};

// Fungsi autentikasi
export const registerUser = (userData) => {
  return apiClient.post('/register', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/login', credentials);
};

export const logoutUser = () => {
  const token = localStorage.getItem('auth_token');
  return apiClient.post('/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

};

// Fungsi catatan
export const getNotes = () => {
  const token = localStorage.getItem('auth_token');
  return apiClient.get('/notes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createNote = async (noteData) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.post('/notes', noteData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getNoteById = (noteId) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.get(`/notes/${noteId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateNote = (noteId, noteData) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.put(`/notes/${noteId}`, noteData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteNote = (noteId) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.delete(`/notes/${noteId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Fungsi berbagi
export const shareNote = (noteId, shareData) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.post(`/notes/${noteId}/share`, shareData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getSharedNotes = () => {
  const token = localStorage.getItem('auth_token');
  return apiClient.get('/notes/shared', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const revokeShare = (noteId, shareId) => {
  const token = localStorage.getItem('auth_token');
  return apiClient.delete(`/notes/${noteId}/share/${shareId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export default apiClient;
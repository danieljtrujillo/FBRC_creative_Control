import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadScript = async (formData) => {
  return await api.post('/upload-script', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateCharacter = async (prompt) => {
  return await api.post('/generate-character', prompt);
};

export const generateVideo = async (sceneData) => {
  return await api.post('/generate-video', sceneData);
};

export const generate3DModel = async (characterData) => {
  return await api.post('/generate-3d-model', characterData);
};

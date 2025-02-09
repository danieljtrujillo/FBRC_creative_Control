// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScriptUpload from './components/ScriptUpload';
import CharacterPreview from './components/CharacterPreview';
import VideoGenerator from './components/VideoGenerator';
import ModelViewer from './components/ModelViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScriptUpload />} />
        <Route path="/character" element={<CharacterPreview />} />
        <Route path="/video" element={<VideoGenerator />} />
        <Route path="/model" element={<ModelViewer />} />
      </Routes>
    </Router>
  );
}

export default App;

// frontend/src/components/ScriptUpload/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadScript } from '../../services/api';

const ScriptUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadScript(formData);
      
      // Store the script data in state management
      // Navigate to character preview
      navigate('/character', { state: { scriptData: response.data } });
    } catch (error) {
      console.error('Error uploading script:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Upload Your Script</h1>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="script-upload"
            />
            <label
              htmlFor="script-upload"
              className="cursor-pointer text-blue-500 hover:text-blue-600"
            >
              Click to upload or drag and drop
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-2 px-4 rounded-md ${
              !file || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptUpload;

// frontend/src/services/api.js
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
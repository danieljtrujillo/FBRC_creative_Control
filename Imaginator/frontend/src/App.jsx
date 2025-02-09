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

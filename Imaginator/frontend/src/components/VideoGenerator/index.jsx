import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateVideo } from '../../services/api';

const VideoGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scriptData, characters } = location.state || {};
  
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedScene, setSelectedScene] = useState(null);

  const handleGenerateVideo = async (sceneIndex) => {
    if (loading[sceneIndex]) return;

    setLoading(prev => ({ ...prev, [sceneIndex]: true }));
    try {
      const scene = scriptData.scenes[sceneIndex];
      const response = await generateVideo({
        description: scene.content,
        camera_motion: "camera orbit around scene", // Default camera motion
        characters: scene.characters.map(char => ({
          name: char,
          image_url: characters[char]
        }))
      });

      setVideos(prev => ({
        ...prev,
        [sceneIndex]: response.data.video_url
      }));
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(prev => ({ ...prev, [sceneIndex]: false }));
    }
  };

  const handleContinue = () => {
    navigate('/model', {
      state: {
        scriptData,
        characters,
        videos
      }
    });
  };

  if (!scriptData?.scenes) {
    return <div>No script data found. Please start from the beginning.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Video Generation</h1>
        
        <div className="space-y-6">
          {scriptData.scenes.map((scene, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
              onClick={() => setSelectedScene(index)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Scene {index + 1}</h3>
                <div className="text-sm text-gray-500">
                  Characters: {scene.characters.join(', ')}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{scene.content}</p>
              
              {videos[index] ? (
                <video
                  src={videos[index]}
                  controls
                  className="w-full rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  No video generated
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleGenerateVideo(index)}
                  disabled={loading[index]}
                  className={`py-2 px-4 rounded-md ${
                    loading[index]
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {loading[index] ? 'Generating...' : 'Generate Video'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={Object.keys(videos).length === 0}
            className={`py-2 px-6 rounded-md ${
              Object.keys(videos).length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Continue to 3D Model Generation
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;

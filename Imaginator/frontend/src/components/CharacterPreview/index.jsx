import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCharacter } from '../../services/api';

const CharacterPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scriptData } = location.state || {};
  
  const [characters, setCharacters] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleGenerateCharacter = async (character) => {
    if (loading[character]) return;

    setLoading(prev => ({ ...prev, [character]: true }));
    try {
      const response = await generateCharacter({
        description: `Create a character that looks like ${character} from the script`,
      });

      setCharacters(prev => ({
        ...prev,
        [character]: response.data.image_url
      }));
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setLoading(prev => ({ ...prev, [character]: false }));
    }
  };

  const handleContinue = () => {
    navigate('/video', {
      state: {
        scriptData,
        characters
      }
    });
  };

  if (!scriptData?.scenes) {
    return <div>No script data found. Please upload a script first.</div>;
  }

  // Extract unique characters from all scenes
  const uniqueCharacters = [...new Set(
    scriptData.scenes.flatMap(scene => scene.characters)
  )];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Character Preview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueCharacters.map((character) => (
            <div
              key={character}
              className="bg-white rounded-lg shadow-md p-4"
              onClick={() => setSelectedCharacter(character)}
            >
              <h3 className="text-xl font-semibold mb-4">{character}</h3>
              
              {characters[character] ? (
                <img
                  src={characters[character]}
                  alt={character}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  No image generated
                </div>
              )}
              
              <button
                onClick={() => handleGenerateCharacter(character)}
                disabled={loading[character]}
                className={`w-full py-2 px-4 rounded-md ${
                  loading[character]
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {loading[character] ? 'Generating...' : 'Generate Character'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={Object.keys(characters).length === 0}
            className={`py-2 px-6 rounded-md ${
              Object.keys(characters).length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Continue to Video Generation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPreview;

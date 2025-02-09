import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { generate3DModel } from '../../services/api';

const ModelViewer = () => {
  const location = useLocation();
  const { scriptData, characters } = location.state || {};
  
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (selectedCharacter && models[selectedCharacter]) {
      initThreeJS();
    }
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedCharacter, models]);

  const initThreeJS = () => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load and display 3D model
    // In a real implementation, you would use a GLTFLoader to load the model
    // For now, we'll just show a cube as a placeholder
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  };

  const handleGenerateModel = async (character) => {
    if (loading[character]) return;

    setLoading(prev => ({ ...prev, [character]: true }));
    try {
      const response = await generate3DModel({
        description: `Create a 3D model of ${character}`,
        reference_image: characters[character]
      });

      setModels(prev => ({
        ...prev,
        [character]: response.data.model_url
      }));
      setSelectedCharacter(character);
    } catch (error) {
      console.error('Error generating 3D model:', error);
    } finally {
      setLoading(prev => ({ ...prev, [character]: false }));
    }
  };

  if (!scriptData?.scenes) {
    return <div>No script data found. Please start from the beginning.</div>;
  }

  // Extract unique characters from all scenes
  const uniqueCharacters = [...new Set(
    scriptData.scenes.flatMap(scene => scene.characters)
  )];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">3D Model Viewer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character List */}
          <div className="lg:col-span-1 space-y-4">
            {uniqueCharacters.map((character) => (
              <div
                key={character}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h3 className="text-xl font-semibold mb-4">{character}</h3>
                
                {characters[character] && (
                  <img
                    src={characters[character]}
                    alt={character}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                )}
                
                <button
                  onClick={() => handleGenerateModel(character)}
                  disabled={loading[character]}
                  className={`w-full py-2 px-4 rounded-md ${
                    loading[character]
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {loading[character] ? 'Generating...' : 'Generate 3D Model'}
                </button>
              </div>
            ))}
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div
              ref={containerRef}
              className="w-full h-[600px] bg-black rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;

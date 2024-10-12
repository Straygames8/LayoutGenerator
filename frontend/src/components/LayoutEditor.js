// components/LayoutEditor.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeDxf } from 'three-dxf';
import { getLayout } from '../api';

function LayoutEditor({ onUpdateLayout }) {
  const { id } = useParams();
  const [layout, setLayout] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchLayout();
  }, [id]);

  useEffect(() => {
    if (layout && selectedSheet) {
      initThreeJS();
    }
  }, [layout, selectedSheet]);

  const fetchLayout = async () => {
    const fetchedLayout = await getLayout(id);
    setLayout(fetchedLayout);
    if (fetchedLayout.sheets.length > 0) {
      setSelectedSheet(fetchedLayout.sheets[0]);
    }
  };

  const initThreeJS = () => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const scene = new THREE.Scene();
    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.z = 5;

    const loader = new ThreeDxf();
    selectedSheet.drawings.forEach(drawing => {
      loader.load(drawing.url, (object) => {
        scene.add(object);
      });
    });

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newDrawings = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      return { name: file.name, url: data.url };
    }));

    const updatedSheet = { ...selectedSheet, drawings: [...selectedSheet.drawings, ...newDrawings] };
    const updatedLayout = { 
      ...layout, 
      sheets: layout.sheets.map(sheet => 
        sheet._id === selectedSheet._id ? updatedSheet : sheet
      ) 
    };

    setLayout(updatedLayout);
    setSelectedSheet(updatedSheet);
    onUpdateLayout(updatedLayout);
  };

  if (!layout) return <div>Loading...</div>;

  return (
    <div>
      <h2>{layout.name}</h2>
      <div>
        <label htmlFor="sheet-select">Select Sheet:</label>
        <select 
          id="sheet-select" 
          value={selectedSheet?._id} 
          onChange={(e) => setSelectedSheet(layout.sheets.find(sheet => sheet._id === e.target.value))}
        >
          {layout.sheets.map(sheet => (
            <option key={sheet._id} value={sheet._id}>{sheet.name}</option>
          ))}
        </select>
      </div>
      <div>
        <input type="file" accept=".dwg" multiple onChange={handleFileUpload} />
      </div>
      <canvas ref={canvasRef} width="800" height="600"></canvas>
    </div>
  );
}

export default LayoutEditor;

// api.js
const API_URL = 'http://localhost:5000/api';

export const getLayouts = async () => {
  const response = await fetch(`${API_URL}/layouts`);
  return response.json();
};

export const getLayout = async (id) => {
  const response = await fetch(`${API_URL}/layouts/${id}`);
  return response.json();
};

export const createLayout = async (layout) => {
  const response = await fetch(`${API_URL}/layouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });
  return response.json();
};

export const updateLayout = async (layout) => {
  const response = await fetch(`${API_URL}/layouts/${layout._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });
  return response.json();
};

export const deleteLayout = async (id) => {
  await fetch(`${API_URL}/layouts/${id}`, { method: 'DELETE' });
};
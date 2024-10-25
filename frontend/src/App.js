// App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LayoutEditor from './components/LayoutEditor';
import LayoutList from './components/LayoutList';
import { getLayouts, createLayout, updateLayout, deleteLayout } from './api';

function App() {
  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    const fetchedLayouts = await getLayouts();
    setLayouts(fetchedLayouts);
  };

  const handleCreateLayout = async (newLayout) => {
    const createdLayout = await createLayout(newLayout);
    setLayouts([...layouts, createdLayout]);
  };

  const handleUpdateLayout = async (updatedLayout) => {
    const updated = await updateLayout(updatedLayout);
    setLayouts(layouts.map(layout => layout._id === updated._id ? updated : layout));
  };

  const handleDeleteLayout = async (layoutId) => {
    await deleteLayout(layoutId);
    setLayouts(layouts.filter(layout => layout._id !== layoutId));
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <LayoutList 
                layouts={layouts} 
                onCreateLayout={handleCreateLayout}
                onDeleteLayout={handleDeleteLayout}
              />
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <LayoutEditor 
                onUpdateLayout={handleUpdateLayout} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
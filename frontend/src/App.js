// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
        <Switch>
          <Route exact path="/">
            <LayoutList 
              layouts={layouts} 
              onCreateLayout={handleCreateLayout}
              onDeleteLayout={handleDeleteLayout}
            />
          </Route>
          <Route path="/editor/:id">
            <LayoutEditor onUpdateLayout={handleUpdateLayout} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
// components/LayoutList.js
import React from 'react';
import { Link } from 'react-router-dom';

function LayoutList({ layouts, onCreateLayout, onDeleteLayout }) {
  const handleCreate = () => {
    const newLayout = { name: 'New Layout', sheets: [] };
    onCreateLayout(newLayout);
  };

  return (
    <div>
      <h2>Your Layouts</h2>
      <button onClick={handleCreate}>Create New Layout</button>
      <ul>
        {layouts.map(layout => (
          <li key={layout._id}>
            <Link to={`/editor/${layout._id}`}>{layout.name}</Link>
            <button onClick={() => onDeleteLayout(layout._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LayoutList;
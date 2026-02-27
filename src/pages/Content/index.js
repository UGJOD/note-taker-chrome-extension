import React from 'react';
import { createRoot } from 'react-dom/client';
import NoteCreator from './NoteCreator';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

// Create container for the note creator
const container = document.createElement('div');
container.id = 'notey-app-container';
container.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9999;
`;

// Make sure container allows pointer events for children
container.style.pointerEvents = 'auto';

document.body.appendChild(container);

// Render the NoteCreator component
const root = createRoot(container);
root.render(<NoteCreator />);

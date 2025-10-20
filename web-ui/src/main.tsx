import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element defined in index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  // Create a React root and render the application
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    // Basic error handling if the root element is missing
    console.error("Failed to find the root element in the document.");
}
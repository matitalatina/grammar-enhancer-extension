import React from 'react';
import ReactDOM from 'react-dom/client';
import TextImprover from '../components/TextImprover';
import '../styles/index.css';

/**
 * Creates a container element and renders a React component inside it
 * @param originalText The original text selected by the user
 * @param improvedText The improved text from the API
 * @param onAccept Callback function when the user accepts the improved text
 * @param onCancel Callback function when the user cancels
 * @returns The container element
 */
export const renderTextImprover = (
  originalText: string,
  improvedText: string,
  onAccept: () => void,
  onCancel: () => void
): HTMLElement => {
  // Create container element
  const container = document.createElement('div');
  container.id = 'grammar-enhancer-container';
  document.body.appendChild(container);

  // Create root and render component
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <div className="grammar-enhancer">
        <TextImprover
          originalText={originalText}
          improvedText={improvedText}
          onAccept={onAccept}
          onCancel={onCancel}
        />
      </div>
    </React.StrictMode>
  );

  // Store the root in a data attribute for later unmounting
  (container as any)._reactRoot = root;

  return container;
};

/**
 * Removes the React component and its container from the DOM
 * @param container The container element to remove
 */
export const removeTextImprover = (container: HTMLElement): void => {
  if (container && document.body.contains(container)) {
    // Unmount the React component using the stored root
    if ((container as any)._reactRoot) {
      (container as any)._reactRoot.unmount();
    }
    document.body.removeChild(container);
  }
}; 
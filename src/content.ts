/// <reference types="chrome" />
import { renderTextImprover, removeTextImprover } from './utils/reactRenderer';

interface TextProcessRequest {
  action: string;
  text?: string;
}

interface ImprovedTextResponse {
  success: boolean;
  improvedText?: string;
  error?: string;
}

// Store the current selection and its range
let currentSelection: Selection | null = null;
let currentRange: Range | null = null;
let popupContainer: HTMLElement | null = null;

// Flag to prevent multiple simultaneous processing
let isProcessing = false;

// Debounce timer for keyboard shortcut
let debounceTimer: number | null = null;

// Check if we're on Gmail
const isGmail = window.location.hostname === 'mail.google.com';

// Check if we're in an iframe (common in Gmail)
const isIframe = window !== window.top;

// Initialize for Gmail if needed
if (isGmail) {
  console.log('Grammar extension initialized for Gmail');
  
  // Set up a mutation observer to handle Gmail's dynamic content
  const observer = new MutationObserver((mutations) => {
    // This will fire when Gmail's DOM changes
    // We don't need to do anything specific here, just ensure our listeners work
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request: TextProcessRequest) => {
  // For Gmail in iframes, only process in the iframe where text is selected
  if (isGmail && isIframe) {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      // No selection in this iframe, ignore the message
      return true;
    }
  }
  
  // Prevent multiple simultaneous processing
  if (isProcessing) {
    console.log('Already processing a request, ignoring new request');
    return true;
  }
  
  if (request.action === 'processText' && request.text) {
    isProcessing = true;
    
    // Save the current selection
    currentSelection = window.getSelection();
    if (currentSelection && currentSelection.rangeCount > 0) {
      currentRange = currentSelection.getRangeAt(0);
      
      // Send the selected text to the background script for processing
      chrome.runtime.sendMessage(
        { action: 'improveText', text: request.text },
        (response: ImprovedTextResponse) => {
          isProcessing = false;
          if (response.success && response.improvedText) {
            showImprovedTextPopup(request.text as string, response.improvedText);
          } else {
            showErrorPopup(response.error || 'Unknown error occurred');
          }
        }
      );
    } else {
      isProcessing = false;
    }
  } else if (request.action === 'getSelectedTextAndProcess') {
    // Debounce the keyboard shortcut to prevent multiple triggers
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = window.setTimeout(() => {
      isProcessing = true;
      
      // Handle keyboard shortcut - get the current selection
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || '';
      
      if (selectedText !== '') {
        currentSelection = selection;
        if (currentSelection && currentSelection.rangeCount > 0) {
          currentRange = currentSelection.getRangeAt(0);
          
          // Send the selected text to the background script for processing
          chrome.runtime.sendMessage(
            { action: 'improveText', text: selectedText },
            (response: ImprovedTextResponse) => {
              isProcessing = false;
              if (response.success && response.improvedText) {
                showImprovedTextPopup(selectedText, response.improvedText);
              } else {
                showErrorPopup(response.error || 'Unknown error occurred');
              }
            }
          );
        } else {
          isProcessing = false;
        }
      } else {
        // Only show the error message once
        showErrorPopup('No text selected. Please select some text first.');
        isProcessing = false;
      }
    }, 100); // 100ms debounce
  }
  
  // Return true to indicate we'll respond asynchronously
  return true;
});

/**
 * Shows a popup with the improved text using React
 */
function showImprovedTextPopup(originalText: string, improvedText: string): void {
  // Remove any existing popups
  removeExistingPopups();
  
  // Create and render the React component
  popupContainer = renderTextImprover(
    originalText,
    improvedText,
    () => {
      // Accept button clicked - copy to clipboard instead of replacing text
      copyToClipboard(improvedText);
      removeExistingPopups();
    },
    () => {
      // Cancel button clicked - just close the popup
      removeExistingPopups();
    }
  );
}

/**
 * Shows an error popup
 */
function showErrorPopup(errorMessage: string): void {
  // For "No text selected" errors, use a more subtle notification instead of an alert
  if (errorMessage.includes('No text selected')) {
    showNotification(errorMessage, '#f44336'); // Red color for error
  } else {
    // Use alert for other errors
    alert(`Error: ${errorMessage}`);
  }
}

/**
 * Copies the provided text to the clipboard and shows a notification
 */
function copyToClipboard(text: string): void {
  try {
    // Use the Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showNotification('Improved text copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          fallbackCopyToClipboard(text);
        });
    } else {
      // Fallback for browsers that don't support the Clipboard API
      fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showNotification('Failed to copy text. Please try again.');
  }
}

/**
 * Fallback method to copy text to clipboard using document.execCommand
 */
function fallbackCopyToClipboard(text: string): void {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Execute the copy command
    const successful = document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(textArea);
    
    if (successful) {
      showNotification('Improved text copied to clipboard!');
    } else {
      showNotification('Failed to copy text. Please try again.');
    }
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err);
    showNotification('Failed to copy text. Please try again.');
  }
}

/**
 * Shows a temporary notification to the user
 */
function showNotification(message: string, backgroundColor: string = '#4CAF50'): void {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = backgroundColor;
  notification.style.color = 'white';
  notification.style.padding = '16px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  
  // Add to the document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
}

/**
 * Removes any existing popups
 */
function removeExistingPopups(): void {
  if (popupContainer) {
    removeTextImprover(popupContainer);
    popupContainer = null;
  }
} 
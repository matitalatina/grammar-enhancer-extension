/// <reference types="chrome" />
import { API_ENDPOINT, MODEL, MAX_TOKENS, getApiKey } from './config';

// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'grammar-enhancer',
    title: 'Improve Grammar and Clarity',
    contexts: ['selection']
  });
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'improve-grammar') {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        // Send message to content script to get and process selected text
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'getSelectedTextAndProcess'
        });
      }
    });
  }
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'grammar-enhancer' && info.selectionText) {
    // Send message to content script with the selected text
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'processText',
        text: info.selectionText
      });
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((
  request: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response: any) => void
) => {
  if (request.action === 'improveText') {
    improveText(request.text)
      .then(improvedText => {
        sendResponse({ success: true, improvedText });
      })
      .catch(error => {
        console.error('Error improving text:', error);
        sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
      });
    return true; // Indicates we will send a response asynchronously
  }
  return false;
});

// Function to call ChatGPT API
async function improveText(text: string): Promise<string> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that improves text grammar and clarity. Your task is to fix grammar issues and make the text clearer without changing its meaning. Preserve all original formatting including newlines, paragraphs, and spacing. Only return the improved text without any explanations or additional text.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
} 
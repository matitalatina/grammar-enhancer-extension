// API endpoint for ChatGPT
export const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// The model to use for the API requests
export const MODEL = 'gpt-4o-mini';

// Maximum number of tokens to generate in the response
export const MAX_TOKENS = 1000;

// Get API key from Chrome storage
export const getApiKey = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (!result.apiKey) {
        reject(new Error('API key not found. Please set your OpenAI API key in the extension popup.'));
      } else {
        resolve(result.apiKey);
      }
    });
  });
}; 
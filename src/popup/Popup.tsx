import React, { useState, useEffect } from 'react';

interface PopupState {
  apiKey: string;
  status: string;
  isLoading: boolean;
}

const Popup: React.FC = () => {
  const [state, setState] = useState<PopupState>({
    apiKey: '',
    status: '',
    isLoading: true
  });

  useEffect(() => {
    // Load API key from storage when component mounts
    chrome.storage.sync.get(['apiKey'], (result) => {
      setState(prevState => ({
        ...prevState,
        apiKey: result.apiKey || '',
        isLoading: false
      }));
    });
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({
      ...prevState,
      apiKey: e.target.value
    }));
  };

  const saveApiKey = () => {
    setState(prevState => ({
      ...prevState,
      isLoading: true
    }));

    chrome.storage.sync.set({ apiKey: state.apiKey }, () => {
      setState(prevState => ({
        ...prevState,
        status: 'API key saved successfully!',
        isLoading: false
      }));

      // Clear status message after 3 seconds
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          status: ''
        }));
      }, 3000);
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md w-[350px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Grammar and Clarity Enhancer</h1>
      
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key
        </label>
        <input
          type="password"
          id="apiKey"
          value={state.apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your OpenAI API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={saveApiKey}
        disabled={state.isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {state.isLoading ? 'Saving...' : 'Save API Key'}
      </button>

      {state.status && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {state.status}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h2 className="font-semibold mb-2">How to use:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Select text on any webpage</li>
          <li>Right-click and select "Improve Grammar and Clarity"</li>
          <li>Review the improved text in the popup</li>
          <li>Click "Accept" to replace the original text</li>
        </ol>
      </div>
    </div>
  );
};

export default Popup; 
import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface TextImproverProps {
  originalText: string;
  improvedText: string;
  onAccept: () => void;
  onCancel: () => void;
}

const TextImprover: React.FC<TextImproverProps> = ({
  originalText,
  improvedText,
  onAccept,
  onCancel
}) => {
  // Preprocess text to preserve spaces by replacing them with visible spaces
  // This ensures spaces are properly displayed in the diff
  const preprocessText = (text: string) => {
    // Ensure newlines are preserved
    return text;
  };

  // Custom styles to make the diff look less like code
  const customStyles = {
    variables: {
      light: {
        diffViewerBackground: '#fff',
        diffViewerColor: '#212121',
        addedBackground: '#e6ffec',
        addedColor: '#24292e',
        removedBackground: '#ffebe9',
        removedColor: '#24292e',
        wordAddedBackground: '#abf2bc',
        wordRemovedBackground: '#ffc0bd',
        addedGutterBackground: '#e6ffec',
        removedGutterBackground: '#ffebe9',
        gutterBackground: '#f8f8f8',
        gutterBackgroundDark: '#f3f1f1',
        codeFoldBackground: '#f8f8f8',
        codeFoldContentBackground: '#f8f8f8'
      }
    },
    contentText: {
      fontSize: '16px',
      lineHeight: '1.6',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    line: {
      padding: '8px 2px',
      width: '100%',
    },
    wordDiff: {
      padding: '2px 0',
      borderRadius: '3px',
      display: 'inline',
    },
    content: {
      width: '100%',
      display: 'block',
    },
    gutter: {
      display: 'none',
    },
    diffContainer: {
      width: '100%',
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Grammar and Clarity Improvement</h2>
        
        <div className="mb-6 w-full">
          <ReactDiffViewer
            oldValue={preprocessText(originalText)}
            newValue={preprocessText(improvedText)}
            splitView={false}
            compareMethod={DiffMethod.WORDS_WITH_SPACE}
            hideLineNumbers={true}
            styles={customStyles}
            useDarkTheme={false}
            disableWordDiff={false}
            showDiffOnly={false}
            extraLinesSurroundingDiff={10}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextImprover; 
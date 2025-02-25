# Grammar and Clarity Enhancer - Installation Guide

This guide will help you build and install the Grammar and Clarity Enhancer Chrome extension.

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Chrome browser

## Building the Extension

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with the built extension.

## Installing the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle in the top right corner.
3. Click "Load unpacked" and select the `dist` directory that was created during the build process.
4. The extension should now be installed and visible in your Chrome toolbar.

## Setting Up Your API Key

1. Click on the extension icon in the Chrome toolbar to open the popup.
2. Enter your OpenAI API key in the input field.
3. Click "Save API Key".

You can obtain an OpenAI API key by signing up at [https://platform.openai.com/](https://platform.openai.com/).

## Using the Extension

1. Select text on any webpage.
2. Right-click and select "Improve Grammar and Clarity" from the context menu.
3. A popup will appear with the improved text.
4. Click "Accept" to replace the original text with the improved version, or "Cancel" to close the popup.

## Troubleshooting

- If the extension doesn't appear in the context menu, try reloading the page.
- If you encounter any errors, check the console for error messages (right-click on the page, select "Inspect", and go to the "Console" tab).
- Make sure your API key is correctly set in the extension popup.

## Development

To work on the extension in development mode:

```bash
npm run watch
```

This will watch for changes and rebuild the extension automatically. 
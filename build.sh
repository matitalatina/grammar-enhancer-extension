#!/bin/bash

# Exit on error
set -e

echo "Building Grammar and Clarity Enhancer extension..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the extension
echo "Building the extension..."
npm run build

echo "Build completed successfully!"
echo "The extension is now available in the 'dist' directory."
echo ""
echo "To install the extension in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select the 'dist' directory"
echo ""
echo "Don't forget to set your OpenAI API key in the extension popup!" 
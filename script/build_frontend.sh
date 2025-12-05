#!/bin/bash
set -e

echo "🔧 Installing dependencies..."
npm install

echo "🏗 Building frontend for production..."
npm run build

echo "✅ Build completed successfully!"

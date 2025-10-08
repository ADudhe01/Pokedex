#!/bin/bash

# 🚀 Modern Pokédex - GitHub Pages Deployment Script
# This script automates the deployment process

echo "🎮 Modern Pokédex - GitHub Pages Deployment"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app should be live at: https://yourusername.github.io/pokedex"
    echo "📝 Don't forget to update the 'homepage' field in package.json with your actual GitHub username!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

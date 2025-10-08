# 🌐 GitHub Pages Setup - Quick Start

## 🚀 Deploy Your Pokédex in 3 Steps

### 1. Update Your Username
Edit `package.json` and replace `yourusername` with your actual GitHub username:
```json
"homepage": "https://yourusername.github.io/pokedex"
```

### 2. Create GitHub Repository
- Go to GitHub.com
- Create a new repository named `pokedex`
- Make it **Public**
- Don't initialize with README

### 3. Deploy
Run these commands in your terminal:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Modern Pokédex app"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/pokedex.git
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

### 4. Enable GitHub Pages
- Go to your repository Settings
- Scroll to "Pages" section
- Select "Deploy from a branch"
- Choose "gh-pages" branch and "/ (root)"
- Click Save

## 🎉 Done!
Your app will be live at: `https://yourusername.github.io/pokedex`

## 🔄 Updates
To update your deployed app:
```bash
npm run deploy
```

## 📱 Features
- ✅ All 1,118 Pokémon
- ✅ Fully responsive design
- ✅ Modern glassmorphism UI
- ✅ Fast loading
- ✅ Mobile optimized

---
**Need help?** Check the detailed [DEPLOYMENT.md](DEPLOYMENT.md) guide!

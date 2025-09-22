#!/bin/bash

# CMS Dashboard Deployment Script
echo "🚀 CMS Dashboard Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy CMS Dashboard to GitHub Pages"

# Get repository URL from user
echo ""
echo "🔗 Please provide your GitHub repository URL:"
echo "   Example: https://github.com/your-username/cms-dashboard-news-management.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required!"
    exit 1
fi

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Push to main branch
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings > Pages"
echo "3. Set Source to 'GitHub Actions'"
echo "4. Wait 2-5 minutes for deployment"
echo "5. Your site will be live at: https://YOUR-USERNAME.github.io/cms-dashboard-news-management"
echo ""
echo "🎉 Happy coding!"

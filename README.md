# AMM Platform - Accessibility-First Creator Platform

## 🎯 Project Overview

AMM Platform is an **accessibility-first AI creator platform** built for creators with disabilities. We support blind, deaf, mobility-disabled, and paralysis users with a modern, responsive Next.js application.

### Core Values
- ✅ **Accessibility First** - WCAG 2.1 AA compliance
- ✅ **Beginner Friendly** - Simple, well-commented code
- ✅ **Solo Developer Focused** - Minimal dependencies
- ✅ **Open Source** - Community-driven development
- ✅ **No Barriers** - No API keys required yet

---

## 📁 Project Structure

```
amm-platform/
├── app/                           # Main application files (Next.js App Router)
│   ├── layout.tsx                # Root layout (wraps all pages)
│   ├── globals.css               # ALL styles (accessibility-focused)
│   ├── page.tsx                  # Home page
│   ├── marketplace/page.tsx       # Marketplace page (coming soon)
│   ├── streaming/page.tsx         # Streaming page (coming soon)
│   ├── ai/page.tsx               # AI Assistant page (coming soon)
│   ├── academy/page.tsx           # Creator Academy page (coming soon)
│   └── accessibility/page.tsx    # Accessibility documentation page
│
├── components/                    # Reusable React components
│   ├── Header.js                 # Navigation + Accessibility controls
│   └── Footer.js                 # Footer with links and shortcuts
│
├── lib/                           # Utility functions
│   ├── translations.js            # Multi-language support (EN, ES, FR, DE)
│   └── a11y.js                   # Accessibility utilities (high contrast, large text)
│
├── public/                        # Static files (images, icons)
│
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── .gitignore                    # Git ignore rules
└── README.md                     # This file

```

---

## 🎨 Folder Explanations

### `/app` - Main Application
- **Purpose:** Contains all pages and layouts using Next.js App Router
- **How it works:** Each folder with `page.tsx` becomes a route
  - `/app/page.tsx` → Home page (`/`)
  - `/app/marketplace/page.tsx` → Marketplace page (`/marketplace`)
  - `/app/streaming/page.tsx` → Streaming page (`/streaming`)
- **globals.css:** All styles in one file (easier to manage, fully accessible)

### `/components` - Reusable Components
- **Header.js:** Navigation menu + Accessibility controls (high contrast, large text, language selection)
- **Footer.js:** Footer with links, keyboard shortcuts table, and copyright info
- **Why separate:** Used on every page, easy to update globally

### `/lib` - Utility Functions
- **translations.js:** Contains all text in 4 languages (EN, ES, FR, DE)
  - Usage: `t('home.title')` returns title in user's language
- **a11y.js:** Accessibility functions
  - `getAccessibilitySettings()` - Get user's preferences
  - `setHighContrast(true)` - Toggle high contrast mode
  - `setLargeText(true)` - Toggle large text mode
  - `initAccessibilitySettings()` - Apply settings on page load

### `/public` - Static Files
- For images, logos, icons (currently empty, add later)

---

## 📄 File Explanations

### `package.json`
Lists all dependencies and npm scripts:
```json
{
  "scripts": {
    "dev": "next dev",          // Run locally
    "build": "next build",      // Build for production
    "start": "next start",      // Run production build
    "lint": "next lint"         // Check code quality
  }
}
```

### `next.config.js`
Next.js configuration:
- React strict mode (catches bugs)
- Image optimization
- Font optimization

### `.gitignore`
Tells Git to ignore:
- `node_modules/` (dependencies folder)
- `.next/` (build folder)
- `.env.local` (environment variables)
- `npm-debug.log` (error logs)

### `globals.css`
**All styles in one file!** Contains:
- High contrast mode styles (black bg, yellow text)
- Large text mode styles (25% bigger)
- Focus indicators for keyboard navigation
- Responsive design for mobile
- WCAG 2.1 accessibility compliance

### `Header.js`
**Navigation and Accessibility Controls**
- Shows navigation links (Home, Marketplace, Streaming, AI, Academy, Accessibility)
- High contrast checkbox
- Large text checkbox
- Language buttons (EN, ES, FR, DE)
- All settings saved to browser localStorage

### `Footer.js`
**Footer Information**
- Quick links navigation
- Keyboard shortcuts reference
- Copyright info
- Links to GitHub and resources

### `translations.js`
**Multi-Language Support**
```javascript
translations = {
  en: { 'home.title': 'Welcome to AMM Platform' },
  es: { 'home.title': 'Bienvenido a la Plataforma AMM' },
  fr: { 'home.title': 'Bienvenue sur la Plateforme AMM' },
  de: { 'home.title': 'Willkommen auf der AMM-Plattform' }
}
```
- No API calls needed
- Works offline
- Lightning fast

### `a11y.js`
**Accessibility Utilities**
```javascript
// Get settings
const settings = getAccessibilitySettings();

// Toggle high contrast
setHighContrast(true); // Adds 'high-contrast' class to body

// Toggle large text
setLargeText(true); // Adds 'large-text' class to body

// Change language
setLanguage('es'); // Changes to Spanish

// Initialize on load
initAccessibilitySettings(); // Applies saved preferences
```

### Each Page (`page.tsx` files)
- **Home:** Landing page with features and CTAs
- **Marketplace:** Coming soon - creator marketplace preview
- **Streaming:** Coming soon - live streaming preview
- **AI:** Coming soon - AI assistant preview
- **Academy:** Coming soon - free courses preview
- **Accessibility:** Comprehensive accessibility guide and documentation

---

## ✨ Key Features Explained

### 1. **High Contrast Mode**
- **What it does:** Black background, bright yellow text
- **Why:** Helps users with low vision, light sensitivity
- **How:** Toggle checkbox in header → adds `high-contrast` class to `<body>`
- **CSS:** All styles in `globals.css` under `body.high-contrast`

### 2. **Large Text Mode**
- **What it does:** Increases all fonts by 25%
- **Why:** Helps users with low vision or reading difficulties
- **How:** Toggle checkbox in header → adds `large-text` class to `<body>`
- **CSS:** All styles in `globals.css` under `body.large-text`

### 3. **Keyboard Navigation**
- **What it does:** Tab through all interactive elements, Enter to activate
- **Why:** Essential for users who can't use a mouse
- **Features:**
  - Focus indicators on all buttons/links (visible blue outline)
  - Skip to main content link (press Tab, then Enter)
  - Alt+Key shortcuts: Alt+H (Home), Alt+M (Marketplace), etc.

### 4. **Multi-Language Support**
- **Languages:** English, Spanish, French, German
- **How it works:** Click language button in header → page reloads with content in that language
- **Storage:** Language preference saved to browser localStorage

### 5. **Screen Reader Support**
- **What it does:** Works with NVDA, JAWS, VoiceOver
- **How:** Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`) + ARIA labels
- **Result:** Screen readers announce everything correctly

### 6. **Responsive Design**
- **Mobile first:** Works perfectly on phones (320px and up)
- **Tablet:** Optimized layout for tablets (576px and up)
- **Desktop:** Full layout for large screens (993px and up)
- **Touch friendly:** Buttons are large enough to tap with finger

---

## 🚀 Complete Deployment Guide

### Step 1: Prerequisites
You need:
- GitHub account (free at github.com)
- Vercel account (free at vercel.com)
- Git installed (optional but recommended)

### Step 2: Set Up GitHub Repository (If Not Done)

```bash
# Initialize git in project folder
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial AMM Platform setup"

# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/amm-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A: Using Web Interface (Easiest)**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select "jgoldie1/amm-platform" repository
5. Click "Deploy"
6. Wait 3-5 minutes
7. Get your live URL (e.g., `amm-platform-xyz.vercel.app`)

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project folder
vercel

# Follow the prompts
# After deployment, you'll get a live URL
```

### Step 4: Automatic Deployments
Every time you push code to GitHub:
```bash
# Make changes
# Save files
# Commit and push
git add .
git commit -m "Update home page"
git push

# Vercel automatically redeploys! (takes 2-3 minutes)
# Your live site updates automatically
```

### Step 5: Custom Domain (Optional)
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Follow instructions to update DNS settings

---

## 🎯 How to Push to GitHub

### First Time Setup
```bash
# Clone this repo if you don't have it
git clone https://github.com/jgoldie1/amm-platform.git
cd amm-platform

# Add your changes
git add .

# Create commit with message
git commit -m "Add new features or describe changes"

# Push to GitHub
git push origin main
```

### Regular Updates
```bash
# After making changes, save files, then:
git add .
git commit -m "Describe what you changed"
git push
```

### Common Git Commands
```bash
# Check status of changes
git status

# See what you changed
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See commit history
git log --oneline

# Create new branch for testing
git checkout -b feature/my-feature

# Switch back to main
git checkout main

# Merge feature branch to main
git merge feature/my-feature
```

---

## 🏃 How to Run Locally

### Initial Setup (First Time Only)

```bash
# Navigate to project folder
cd amm-platform

# Install all dependencies (takes 2-3 minutes)
npm install

# You'll see: "added XXX packages"
```

### Run Development Server

```bash
# Start the development server
npm run dev

# You'll see:
# > amm-platform@0.1.0 dev
# > next dev
# ▲ Next.js 14.0.0
# ✓ ready started server on 0.0.0.0:3000

# Open browser to: http://localhost:3000
```

### Edit and See Changes
- Edit any `.tsx` or `.css` file
- Save the file
- Browser automatically refreshes!

### Stop the Server
- Press `Ctrl+C` in terminal
- Server stops

### Restart the Server
- Press up arrow to get last command
- Type `npm run dev`
- Press Enter

---

## 🔨 How to Build for Production

```bash
# Create optimized production build
npm run build

# You'll see:
# ✓ Compiled successfully
# ✓ Linting and type checking passed
# ✓ Generating static pages

# Test the production build locally
npm start

# Visit: http://localhost:3000
# (Looks same as dev but is optimized)

# Stop with Ctrl+C
```

---

## 📝 Step-by-Step Bash Commands

### Install Dependencies
```bash
cd amm-platform
npm install
```

### Run Development Server
```bash
npm run dev
# Then open: http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
# Then open: http://localhost:3000
```

### Push to GitHub
```bash
git add .
git commit -m "Your message here"
git push
```

### Deploy to Vercel
```bash
# Option 1: Push to GitHub (Vercel auto-deploys)
git push

# Option 2: Use Vercel CLI
vercel
```

### Check Status
```bash
# See what changed
git status

# See commit history
git log --oneline

# See differences
git diff
```

---

## ✅ Testing Checklist

### Before Pushing to GitHub
- [ ] Run `npm run build` (no errors)
- [ ] Run `npm run dev` and test in browser
- [ ] Test navigation works
- [ ] Test accessibility controls
- [ ] Test on mobile (F12 → toggle device toolbar)
- [ ] Test keyboard navigation (Tab through page)

### Before Deploying to Vercel
- [ ] All files committed to GitHub
- [ ] `npm run build` passes
- [ ] Tested locally with `npm run dev`
- [ ] No broken links
- [ ] All pages load

### After Deployment
- [ ] Visit your live URL
- [ ] Test navigation
- [ ] Test on mobile
- [ ] Test accessibility features
- [ ] Check console for errors (F12)

---

## 📚 Learning Resources

### Accessibility
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org/
- A11y Project: https://www.a11yproject.com/

### Next.js
- Official Docs: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn
- YouTube Tutorials: Search "Next.js tutorial"

### Git & GitHub
- GitHub Guides: https://guides.github.com/
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- YouTube: "Git and GitHub for beginners"

### React
- Official Docs: https://react.dev/
- React Learn: https://react.dev/learn
- Hooks Documentation: https://react.dev/reference/react/hooks

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal
- Try `npm --version` to verify

### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
# Then visit: http://localhost:3001
```

### Build fails with errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
```

### Changes not showing up
```bash
# Stop server (Ctrl+C)
# Clear browser cache (Ctrl+Shift+Delete)
# Restart: npm run dev
```

### Git authentication error
```bash
# Generate new SSH key
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Add to GitHub: Settings → SSH Keys

# Or use HTTPS with personal access token
git remote set-url origin https://YOUR-USERNAME:YOUR-TOKEN@github.com/YOUR-USERNAME/amm-platform.git
```

---

## 🎓 Next Steps After Setup

1. **Customize Home Page**
   - Edit `/app/page.tsx`
   - Add your own features
   - Add images to `/public` folder

2. **Add Your Logo**
   - Add logo image to `/public`
   - Update Header.js to show it

3. **Set Custom Domain**
   - In Vercel dashboard
   - Go to Settings → Domains
   - Add your domain

4. **Add Marketplace Features**
   - Edit `/app/marketplace/page.tsx`
   - Plan your marketplace structure

5. **Build Community**
   - Share GitHub link
   - Get feedback
   - Improve together

---

## 📞 Support & Contributing

- **GitHub Issues:** Report bugs or request features
- **GitHub Discussions:** Ask questions, share ideas
- **Pull Requests:** Contribute improvements

### How to Contribute
1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make changes
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Open Pull Request

---

## 📄 License

This project is open source. Feel free to use, modify, and share.

---

## 🎉 You're All Set!

Your AMM Platform is ready. Start with:

```bash
npm install
npm run dev
```

Then visit: http://localhost:3000

Happy coding! 🚀

---

**Built with ❤️ for accessibility. Made by disabled developers, for all creators.**

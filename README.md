<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1GOvlVq4aLTz59WkSEKD0m6bwwS2evDvT

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file and add your Gemini API key:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying this app to Vercel.

**Quick Start:**
1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy

## Get Gemini API Key

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

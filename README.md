<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1GOvlVq4aLTz59WkSEKD0m6bwwS2evDvT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

This project is ready to deploy on Vercel. Vercel will run `npm run build` and serve the `dist` directory.

1. Go to https://vercel.com/new and import the repository.
2. Set the environment variable `GEMINI_API_KEY` in the Vercel project settings (if you use the Gemini API).
3. (Optional) If Vercel doesn't auto-detect the framework, set:

   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`

4. Deploy. The app is a Single Page App; `vercel.json` includes a fallback route to `index.html`.

Notes:
- The Vite config outputs to `dist` and reads `GEMINI_API_KEY` from process.env. Configure those env vars in Vercel.
- You can override `base` by setting `BASE_URL` in the Vercel environment if needed.

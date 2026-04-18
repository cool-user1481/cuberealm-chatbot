# CubeRealm Chatbot

the code or supporting files for cuberealm.io's @chatbot assistant bot.

the full code has ***way*** too many tokens, keys, ids, and other secrets to put here. (I don't want to bother de-tokening it)

## Local development

Install dependencies and start the SvelteKit dev server:

```bash
npm install
npm run dev -- --host
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Commit this repository to GitHub.
2. Log in to Vercel and create a new project.
3. Select the GitHub repository for `cuberealm-chatbot`.
4. Use the default SvelteKit settings.

Vercel will automatically detect the project and use `npm install`, `npm run build`, and `npm run preview` as needed.

If you want to set the root branch manually, choose `main` or the branch you are deploying from.

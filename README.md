# [Skimmr.xyz](https://skimmr.xyz)

A browser extension to help you _skim_ articles at the speed of your internet.

# Self-hosting / how to not get rate-limitted (for devs)
1. Clone the git repo.
```sh
git clone git@github.com:YashKarthik/skimmr.git
```

## Configuring API
1. Create a `.env` file in `/skimmr.xyz` folder.
2. Get your OpenAI API keys from [here](beta.openai.com/) and paste them in the `.env file` like so: `OPENAI_API_KEY="<your api key>"`
3. Open `/skimmr.xyz/netlify/functios/gpt-summarize.ts` and remove the lines marked "Remove if self-hosting" in the comments.
4. Deploy to Netlify (or whatever serverless platform you use).

## Loading the extension
1. Open Chromium and type `chrome://extensions` in the URL bar.
2. Turn on developer mode.
3. Click load unpacked extension.
4. Go to the project root and load `manifest.json` in `/chrome`.

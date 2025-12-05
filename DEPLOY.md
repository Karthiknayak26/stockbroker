# Deploying to Render

This project is configured for easy deployment on [Render](https://render.com/).

## Option 1: Zero-Config Deployment (Recommended)

1.  Push your code to GitHub (you've already done this!).
2.  Log in to the [Render Dashboard](https://dashboard.render.com/).
3.  Click "New +" and select **"Static Site"**.
4.  Connect your GitHub repository.
5.  Render should automatically detect the settings:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
6.  Click **"Deploy Static Site"**.
7.  **IMPORTANT**: Go to the **Redirects/Rewrites** tab in your new service settings and add this rule to support client-side routing (if not auto-detected from `render.yaml`):
    *   **Source**: `/*`
    *   **Destination**: `/index.html`
    *   **Action**: `Rewrite`

## Option 2: Blueprint (Infrastructure as Code)

Since a `render.yaml` is included in the project:

1.  In Render Dashboard, click "New +" -> **"Blueprint"**.
2.  Connect your repository.
3.  Render will read `render.yaml` and set everything up automatically, including the rewrite rules.
4.  Click **Apply**.

Your dashboard will be live in minutes! 🚀

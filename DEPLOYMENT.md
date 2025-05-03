# Automatic Deployment Configuration

This project is configured to automatically deploy to Vercel whenever changes are pushed to the `main` branch on GitHub.

## Setting Up GitHub Secrets

To enable automatic deployments, you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

### Required Secrets

- `VERCEL_TOKEN`: Your Vercel personal access token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## How to Get These Values

### VERCEL_TOKEN

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your profile picture in the top right
3. Go to "Settings" > "Tokens"
4. Create a new token with a descriptive name (e.g., "GitHub Actions Deployment")
5. Copy the token value

### VERCEL_ORG_ID and VERCEL_PROJECT_ID

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings" > "General"
4. Scroll down to find your "Project ID" - this is your `VERCEL_PROJECT_ID`
5. For `VERCEL_ORG_ID`, go to "Settings" > "General" in your Vercel account settings (not project settings)

## Verifying the Setup

After setting up the secrets:

1. Make a small change to your project
2. Commit and push to the `main` branch
3. Go to the "Actions" tab in your GitHub repository to see the deployment workflow running
4. Once completed, your changes should be live on your Vercel deployment

## Manual Deployment

If you need to deploy manually, you can still do so through the Vercel dashboard or by using the Vercel CLI:

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel --prod
```

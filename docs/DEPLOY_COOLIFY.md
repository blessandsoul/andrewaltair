# 🚀 Deployment Guide: Coolify

This guide will walk you through setting up your own "Heroku-like" platform using Coolify on your VPS and deploying the **Fresh** application.

## 📋 Prerequisites
- A **VPS Server** (Ubuntu 22.04 or 24.04 recommended).
- **Domain Name** (e.g., `yoursite.com`) pointing to your VPS IP address.
- access to **SSH**-terminal of your server.

---

## Step 1: Install Coolify on your VPS

1. Connect to your server via SSH:
   ```bash
   ssh root@your-server-ip
   ```
2. Run the automatic installation script (this takes a few minutes):
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
3. Once finished, it will show you:
   - URL: `http://<your-ip>:8000`
   - Email/Password for the initial login.

---

## Step 2: Initial Setup

1. Open `http://<your-ip>:8000` in your browser.
2. Register your Admin account.
3. You will be asked about "localhost" — just accept detailed defaults to install the required managing components on the server itself.

---

## Step 3: Connect Your Source

The easiest way to deploy is to connect your GitHub repository.

1. In Coolify, go to **Keys & Tokens** (or Sources).
2. Add a **GitHub App** (follow the instructions to install the Coolify app on your GitHub account/repo).
   - *Alternative*: You can also just choose "Public Repository" if your repo is public, or "Private Repository (Deploy Key)" if you want to paste a simplified SSH key.

---

## Step 4: Create the Resource

1. Go to **Applications** -> **+ Add**.
2. Select your **Source** (e.g., GitHub App).
3. Select the Repository: `andrewaltair/fresh`.
4. Branch: `main` (or whatever branch you use).
5. Build Pack: **Docker Compose** or **Nixpacks**.
   - Since we have a perfect `Dockerfile` and `docker-compose.yml`, choosing **Docker Compose** is very reliable.
   - If you choose **Docker Compose**, ensure it points to the `docker-compose.yml` file in your repo.
   - *Recommendation*: Since your `Dockerfile` is robust, you can also just choose **Dockerfile** as the build pack. Coolify will find it in the root.

---

## Step 5: Configure Environment Variables

Before you hit deploy, you MUST add your secrets.

1. In the Application settings, go to the **Environment Variables** (Secrets) tab.
2. Copy the contents of your local `.env` file.
3. Paste them into Coolify.
   - **Important**: Make sure `NEXT_PUBLIC_APP_URL` is set to your actual domain (e.g., `https://andrewaltair.com`).

**Required Variables (Check your .env):**
- `DATABASE_URL` / `MONGODB_URI` (If you need a database, you can create one in Coolify first context -> "+ Add" -> "Database" -> PostgreSQL/Mongo, and then copy the internal connection string).
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY` (if used)

---

## Step 6: Domain & Deploy

1. In the **General** / **Settings** tab of your application in Coolify.
2. Find the **Domains** field.
3. Enter your full domain: `https://andrewaltair.com` (or whatever your domain is).
   - *Note*: Ensure your DNS provider (Cloudflare, Namecheap, etc.) has an **A Record** for `@` pointing to your VPS IP.
4. Click **Save**.
5. Click **Deploy** (top right).

Coolify will now:
- Pull your code.
- Build the Docker image (using your Dockerfile).
- Start the container.
- Automatically issue an SSL certificate for HTTPS.

---

## 🛠 Troubleshooting

- **Build Fails?** Check the "Build Logs". If it says something about missing files, ensure all files (like `public/`) are committed to Git.
- **Database Connection?** If using a database inside Coolify, use the internal network host (usually detailed in the Database connection info), e.g., `tcp://uuid-of-db:5432`.

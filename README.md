# Second Brain

My personal digital garden built with Quartz v4, automatically synced from my Obsidian vault.

## 🚀 Automated Blog Pipeline

This repository features an automated deployment pipeline that:

- ✅ Syncs posts and attachments from my Obsidian vault
- ✅ Processes Obsidian image links to proper markdown format
- ✅ Builds the site using Quartz
- ✅ Automatically deploys to GitHub Pages

## 📝 How to Deploy

Run the deployment script to sync your Obsidian content and deploy:

```bash
./deploy.sh
```

This will:
1. Copy posts from your Obsidian vault to `content/Posts`
2. Copy attachments to `content/attachments`
3. Process image links in markdown files
4. Build the Quartz site
5. Commit and push changes
6. Trigger GitHub Pages deployment

## 🌐 Live Site

Visit the live site at: **https://dev-pradeep-ns.github.io/second-brain/**

## ⚙️ Configuration

Update the `.env` file with your Obsidian vault paths:

```env
OBSIDIAN_POSTS_PATH=/path/to/your/obsidian/posts
OBSIDIAN_ATTACHMENTS_PATH=/path/to/your/obsidian/attachments
REPO_URL=git@github.com-Personal:Dev-Pradeep-NS/second-brain.git
```

## 🛠️ Built With

- [Quartz v4](https://quartz.jzhao.xyz/) - Static site generator
- [GitHub Pages](https://pages.github.com/) - Hosting
- [Obsidian](https://obsidian.md/) - Note-taking

# GitHub Setup Guide for Epicenter

## 🔗 Connecting to nicolewafula1-sudo GitHub Account

This guide explains how to push the Epicenter project to the GitHub account `nicolewafula1-sudo` and set up automatic deployments.

### Prerequisites
- Git installed and configured
- GitHub account: `nicolewafula1-sudo`
- SSH key or Personal Access Token (PAT)
- Railway account (for backend)
- Vercel account (for frontend)

### Step 1: Create SSH Key (if not already done)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "epicenter@aptuguard.health"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Step 2: Add SSH Key to GitHub

1. Go to https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Click "Add SSH key"

### Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `epicenter`
3. Description: "Outbreak Mapping & Monitoring System for Kenya"
4. Visibility: `Public` (or `Private` as needed)
5. Click "Create repository"

### Step 4: Add Remote and Push

```bash
# Navigate to project
cd c:\Users\user\OneDrive\Desktop\aptuguard_backend1

# Add remote (replace with your repo URL)
git remote add origin git@github.com:nicolewafula1-sudo/epicenter.git

# Create main branch and push
git branch -M main
git push -u origin main

# Create develop branch for development
git checkout -b develop
git push -u origin develop
```

### Step 5: Configure Railway for Backend

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repository
4. Select `backend` as root directory
5. Add PostgreSQL plugin
6. Set environment variables:
   ```
   DB_HOST=${DATABASE_HOST}
   DB_PORT=${DATABASE_PORT}
   DB_NAME=${DATABASE_NAME}
   DB_USER=${DATABASE_USER}
   DB_PASSWORD=${DATABASE_PASSWORD}
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```
7. Railway will auto-deploy on git push to `main`

### Step 6: Configure Vercel for Frontend

1. Go to https://vercel.com
2. Click "Import Project"
3. Import from GitHub: `nicolewafula1-sudo/epicenter`
4. Select Framework: Next.js
5. Set root directory: `frontend`
6. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-railway-domain.railway.app/api
   NEXT_PUBLIC_WS_URL=wss://your-backend-railway-domain.railway.app
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```
7. Click Deploy
8. Vercel will auto-deploy on git push to `main`

### Step 7: Configure GitHub Secrets (for CI/CD)

1. Go to https://github.com/nicolewafula1-sudo/epicenter/settings/secrets/actions
2. Add secrets:
   - `RAILWAY_TOKEN`: Your Railway API token (from https://railway.app/account/tokens)
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `NEXT_PUBLIC_API_URL`: Backend URL

### Step 8: Configure Branch Protection Rules

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews before merging
   - Dismiss stale pull request approvals
   - Require status checks to pass (backend, frontend tests)
   - Include administrators

### Step 9: Setup Continuous Integration

1. GitHub Actions workflows are already configured in `.github/workflows/`
2. Tests run automatically on pull requests
3. Deployment happens automatically on merge to `main`

## 📋 Daily Development Workflow

### Working on Features

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Review and merge to develop
```

### Releasing to Production

```bash
# After testing on develop/staging
git checkout main
git pull origin main

# Merge develop to main
git merge develop

# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push to GitHub (triggers auto-deployment)
git push origin main
git push origin v1.0.0
```

## 🔄 Automated Deployment Pipeline

### Development Flow
```
Feature Branch → Pull Request → Code Review → Merge to develop
                                               ↓
                                        Staging Deployment (Railway)
```

### Production Flow
```
Merge to main → GitHub Actions Tests → Auto-deploy to Railway/Vercel
                                       ↓
                                   Production Live
```

## 📊 Monitoring Deployments

### Railway Dashboard
- https://railway.app/project/{project-id}
- Monitor logs in real-time
- Check deployment status
- View metrics and analytics

### Vercel Dashboard
- https://vercel.com/dashboard
- Monitor deployment status
- View analytics and performance
- Check error tracking

### GitHub Actions
- https://github.com/nicolewafula1-sudo/epicenter/actions
- View test results
- Check deployment status
- Debug failed workflows

## 🐛 Troubleshooting

### Push rejected: "remote: Permission denied"
```bash
# Verify SSH key is added
ssh -T git@github.com

# If not working, use HTTPS instead
git remote set-url origin https://github.com/nicolewafula1-sudo/epicenter.git
```

### Railway deployment fails
1. Check logs on Railway dashboard
2. Verify environment variables
3. Check database connection
4. View build logs

### Vercel deployment fails
1. Check deployment logs on Vercel
2. Verify build command succeeds locally
3. Check environment variables
4. Review Next.js configuration

### Tests fail in GitHub Actions
1. Check test logs in GitHub Actions
2. Run tests locally to reproduce
3. Fix issues and push again
4. CI/CD will re-run automatically

## 📚 Useful Commands

```bash
# View git history
git log --oneline --graph --all

# Check remote
git remote -v

# Switch branches
git checkout main
git checkout develop

# Pull latest changes
git pull origin main

# Stash changes temporarily
git stash
git stash pop

# Reset to previous commit
git reset --hard HEAD~1

# View current status
git status
```

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use SSH keys** - More secure than HTTPS
3. **Review PRs carefully** - Check code before merging
4. **Keep dependencies updated** - Regular security updates
5. **Rotate tokens** - Update API tokens regularly
6. **Use branch protection** - Prevent accidental pushes to main

## 📞 Support

For GitHub-related issues:
- Documentation: https://docs.github.com
- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support

---

**Ready to deploy? Let's go! 🚀**

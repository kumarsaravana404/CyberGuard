# 🚀 Vercel Deployment Guide for CyberGuard

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- [x] GitHub account with CyberGuard repository
- [x] Vercel account (sign up at https://vercel.com)
- [x] Project pushed to GitHub

## ⚠️ Important Notes

### Current Limitation: In-Memory Storage

The current deployment uses **in-memory storage** for users and scans. This means:

- ❌ Data will be **lost** when the serverless function restarts
- ❌ Each serverless function instance has its **own separate memory**
- ❌ Not suitable for production use

### Recommended: Upgrade to MongoDB Atlas

For a production-ready deployment, you should:

1. Create a **free MongoDB Atlas account** (https://www.mongodb.com/cloud/atlas)
2. Replace the in-memory storage in API files with MongoDB
3. Add `MONGODB_URI` to Vercel environment variables

## 🎯 Deployment Steps

### Step 1: Push to GitHub

Ensure all your latest changes are pushed:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **CyberGuard** repository
5. Vercel will auto-detect the configuration

### Step 3: Configure Project Settings

In the Vercel import screen:

**Framework Preset**: Vite
**Root Directory**: `./` (leave as default)
**Build Command**: Leave default or use `cd client && npm run build`
**Output Directory**: `client/dist`

### Step 4: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

| Name         | Value                               | Description               |
| ------------ | ----------------------------------- | ------------------------- |
| `JWT_SECRET` | `your-super-secret-key-change-this` | Secret key for JWT tokens |
| `NODE_ENV`   | `production`                        | Environment mode          |

**Important**: Generate a strong JWT_SECRET (random 32+ character string)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Vercel will provide you with a URL: `https://your-project.vercel.app`

## 📂 Project Structure for Vercel

```
CyberGuard/
├── api/                      # Serverless functions
│   ├── auth/
│   │   ├── login.js         # POST /api/auth/login
│   │   ├── register.js      # POST /api/auth/register
│   │   └── verify.js        # GET /api/auth/verify
│   ├── scan/
│   │   ├── analyze.js       # POST /api/scan/analyze
│   │   └── history.js       # GET /api/scan/history
│   └── package.json
├── client/                   # React frontend
│   ├── dist/                # Build output (auto-generated)
│   ├── src/
│   └── package.json
├── vercel.json              # Vercel configuration
└── .env.example             # Environment variables template
```

## 🔧 API Endpoints

After deployment, your API will be available at:

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Scanning

- `POST /api/scan/analyze` - Analyze text for threats
- `GET /api/scan/history` - Get scan history

## 🌐 Testing Your Deployment

1. Visit your Vercel URL
2. Try registering a new account
3. Login with your credentials
4. Test the threat scanner
5. Check if steganography features work

## 🔄 Updating Your Deployment

Any push to the `main` branch will automatically redeploy:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically detect the push and redeploy.

## 🛠️ Troubleshooting

### Build Fails

- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify node version compatibility

### API Not Working

- Check Environment Variables in Vercel dashboard
- Verify JWT_SECRET is set
- Check serverless function logs in Vercel

### Frontend Not Loading

- Ensure client/dist is being generated
- Check vite.config.js for proper base path
- Verify routes in vercel.json

### Authentication Issues

- Clear browser localStorage
- Check JWT_SECRET matches between deployments
- Verify CORS headers in API functions

## 📊 Performance Optimization

Current setup includes:

- ✅ Automatic GZIP compression
- ✅ CDN distribution
- ✅ Serverless function auto-scaling
- ✅ Smart caching

## 🔐 Security Checklist

Before going live:

- [ ] Change default JWT_SECRET
- [ ] Implement rate limiting (add to API functions)
- [ ] Add input validation and sanitization
- [ ] Set up proper CORS policies
- [ ] Implement MongoDB with authentication
- [ ] Add HTTPS enforcement (Vercel does this automatically)
- [ ] Set up monitoring and alerts

## 🚀 Upgrade Path: Add MongoDB

To make this production-ready, follow these steps:

### 1. Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string

### 2. Add MongoDB to API Functions

Install mongoose in api folder:

```bash
cd api
npm install mongoose
```

### 3. Update API Functions

Replace in-memory arrays with MongoDB queries. Example:

```javascript
// In api/auth/register.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// Use User.create(), User.findOne(), etc. instead of arrays
```

### 4. Add MONGODB_URI to Vercel

In Vercel dashboard → Environment Variables:

- Name: `MONGODB_URI`
- Value: `mongodb+srv://username:password@cluster.mongodb.net/cyberguard`

## 📞 Support

If you encounter issues:

1. Check Vercel documentation: https://vercel.com/docs
2. Review Vercel function logs
3. Check browser console for errors
4. Verify all environment variables are set

## 🎉 Success!

Once deployed, your CyberGuard application will be:

- 🌐 Accessible worldwide
- ⚡ Fast and responsive
- 🔄 Auto-deployed on every git push
- 📊 Monitored by Vercel analytics

Your deployment URL: `https://your-project.vercel.app`

---

**Next Steps:**

1. Deploy to Vercel
2. Test all features
3. Upgrade to MongoDB Atlas
4. Set up custom domain (optional)
5. Enable Vercel Analytics (optional)

Good luck with your deployment! 🚀

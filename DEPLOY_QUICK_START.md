# 🚀 Quick Vercel Deployment Steps

## 1️⃣ Go to Vercel

Visit: https://vercel.com and sign in with GitHub

## 2️⃣ Import Project

- Click "Add New Project"
- Select "CyberGuard" repository
- Click "Import"

## 3️⃣ Configure Build Settings

**Framework Preset**: Vite

**Root Directory**: `.` (leave as default)

**Build & Development Settings**:

- Build Command: `cd client && npm run build`
- Output Directory: `client/dist`
- Install Command: `npm install` (leave default)

## 4️⃣ Add Environment Variables

Click "Environment Variables" and add:

```
JWT_SECRET = your-super-secret-key-123456789  (change this!)
NODE_ENV = production
```

**Generate strong JWT_SECRET** (32+ random characters)

## 5️⃣ Deploy

Click "Deploy" button and wait 2-5 minutes

## 6️⃣ Access Your App

Your app will be live at: `https://your-project-name.vercel.app`

---

## ⚠️ Important Notes

### Data Persistence Warning

Current setup uses **in-memory storage** which means:

- ❌ User data resets when serverless functions restart
- ❌ Each function instance has separate memory
- ❌ Not suitable for real production use

### For Production Use

**Upgrade to MongoDB Atlas** (free tier available):

1. Create account at mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to Vercel: `MONGODB_URI = your-connection-string`
5. Update API functions to use MongoDB instead of arrays

---

## 🔧 Testing Checklist

After deployment, test:

- [ ] Homepage loads
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard displays
- [ ] Threat scanner works
- [ ] Steganography page loads
- [ ] All navigation works

---

## 🛠️ Common Issues & Fixes

### Build Failed

- Check build logs in Vercel dashboard
- Ensure `client/package.json` has all dependencies
- Verify `vite build` works locally

### API 404 Errors

- Check `vercel.json` is in root directory
- Verify API functions are in `/api` folder
- Check Environment Variables are set

### Login Not Working

- Ensure `JWT_SECRET` is set in Vercel
- Clear browser localStorage
- Check browser console for errors

### Blank Page

- Check browser console
- Verify `client/dist` was created
- Check routing in `vercel.json`

---

## 🔄 Auto-Deploy

Any push to `main` branch auto-deploys:

```bash
git add .
git commit -m "your changes"
git push origin main
```

Vercel automatically rebuilds and redeploys!

---

## 📞 Need Help?

1. Check full guide: `VERCEL_DEPLOYMENT.md`
2. Vercel docs: vercel.com/docs
3. Check Vercel function logs
4. Review browser console errors

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Vercel gives you a live URL
- ✅ Can access website from URL
- ✅ Can register and login
- ✅ All features work

**Your app is now live! 🎉**

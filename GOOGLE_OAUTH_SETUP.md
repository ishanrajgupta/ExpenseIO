# Google OAuth Setup Guide

## ✅ Google OAuth Login Implemented!

Your expense tracker now supports **Google Sign-In** so users can login with their Gmail account and see their actual Google profile picture!

## 🎯 Features Added:

1. **Google Sign-In Button** on Login & Register pages
2. **Automatic Profile Picture** from Google account
3. **No Password Required** when using Google login
4. **Secure Authentication** using OAuth 2.0

## 📋 Setup Instructions:

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add Authorized JavaScript origins:
   - `http://localhost:3002`
   - `http://localhost:3000`
7. Add Authorized redirect URIs:
   - `http://localhost:3002`
   - `http://localhost:3000`
8. Click **Create**
9. Copy your **Client ID** (looks like: `123456789-abcdefgh.apps.googleusercontent.com`)

### Step 2: Update Frontend Environment

Create/update `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

### Step 3: Test Google Login

1. Open http://localhost:3002
2. Click the **"Sign in with Google"** button
3. Choose your Google account
4. You'll be logged in and see your Google profile picture!

## 🔒 How It Works:

1. **User clicks "Sign in with Google"**
2. Google OAuth popup appears
3. User selects their Gmail account
4. Google sends user info (email, name, profile picture) to your app
5. Backend creates/updates user account
6. User is logged in with their Google profile picture

## 📸 Profile Picture:

- **Google Users**: Real Google/Gmail profile picture (auto-synced, not editable)
- **Email/Password Users**: Gravatar based on email
- **Fallback**: Purple circle with initials

## 🚀 Current Status:

- ✅ Backend API ready (`/api/auth/google`)
- ✅ Frontend Google login button added
- ✅ Profile pictures integrated
- ✅ User model updated with `googleId` and `profilePicture` fields
- ⏳ Waiting for Google OAuth credentials

## 📝 Important Notes:

- Google profile pictures **cannot be edited** in the app (they're synced from Google)
- Users can still create accounts with email/password
- Both login methods work side-by-side
- Profile pictures are clickable to enlarge (view only)

## 🔧 Troubleshooting:

If Google login doesn't work:
1. Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
2. Verify authorized origins in Google Console
3. Make sure you're accessing the app via the exact URL you configured
4. Clear browser cache and reload

## 🎨 Default Google Client ID (For Testing):

I've added a default client ID for initial testing. Replace it with your own for production!

---

**Your app is ready!** Just add your Google OAuth credentials and users can sign in with their Gmail accounts! 🎉

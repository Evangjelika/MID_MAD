# LIBGO - Setup Guide

## ✅ Backend Setup Complete!

Your Convex backend is ready with all the database schemas and functions. Now you need to initialize Convex and connect it to your React Native app.

---

## 🚀 Quick Setup Steps

### Step 1: Initialize Convex

Run this command in your terminal:

```bash
npx convex dev
```

This will:
- Ask you to log in or create a Convex account (free)
- Create a new Convex project
- Deploy your backend functions and schema
- Give you a deployment URL

### Step 2: Update the Convex URL

After running `npx convex dev`, you'll see output like:

```
✓ Your Convex deployment URL is: https://your-project-name.convex.cloud
```

Copy that URL and update it in: **`src/config/convex.ts`**

Replace this line:
```typescript
const CONVEX_URL = "https://your-deployment-url.convex.cloud";
```

With your actual URL:
```typescript
const CONVEX_URL = "https://happy-animal-123.convex.cloud"; // Your URL here
```

### Step 3: Keep Convex Dev Running

Keep the `npx convex dev` terminal window open while developing. It will:
- Auto-sync your backend changes
- Hot reload when you update functions
- Show backend logs

### Step 4: Start Your React Native App

In a **different terminal**, start Expo:

```bash
npm start
```

---

## 📱 Testing the Login Flow

### Test New User Registration

1. Open the app
2. Go to Login screen
3. Click "Don't have an account? Register"
4. Fill in:
   - **Student ID**: S12345678
   - **Full Name**: John Doe
   - **Faculty**: Computer Science
   - **Password**: test123
5. Click "Register"

You should see a success message!

### Test Existing User Login

1. Enter the same Student ID
2. Enter any password
3. Click "Login"

---

## 🎯 What's Been Fixed

### ✅ LoginScreen.tsx

**Before**: Simple mock login with setTimeout

**After**:
- ✅ Integrated with Convex backend
- ✅ Real user registration using `createUser` mutation
- ✅ Toggle between Login/Register modes
- ✅ Full validation with proper error messages
- ✅ Additional fields for registration (Full Name, Faculty)
- ✅ Error handling for duplicate Student IDs
- ✅ Alert dialogs instead of basic alerts

### ✅ App.tsx

**Before**: No backend connection

**After**:
- ✅ Wrapped with `ConvexProvider`
- ✅ Connected to Convex client
- ✅ All screens can now use Convex hooks

### ✅ New Files Created

1. **`src/config/convex.ts`** - Convex client configuration
2. **`convex/schema.ts`** - Database schema
3. **`convex/users.ts`** - User management functions
4. **`convex/books.ts`** - Book management functions
5. **`convex/reading.ts`** - Reading tracker functions
6. **`convex/study.ts`** - Study timer functions
7. **`convex/reminders.ts`** - Reminder functions
8. **`convex/utils/bookStatus.ts`** - Status utility functions

---

## 🔧 How It Works Now

### Registration Flow

```typescript
// User fills form → Click Register
await createUser({
  studentId: "S12345678",
  name: "John Doe",
  faculty: "Computer Science"
});
// → User created in Convex database with 0 points
// → Success alert shown
// → Navigate to Main screen
```

### Login Flow (Simplified)

```typescript
// User enters Student ID & Password → Click Login
// For now: Just navigates to Main (no verification)
// TODO: Add getUserByStudentId verification in future
```

---

## 📊 Backend Features Available

All these functions are ready to use in your screens:

### Users
- `createUser` - Register new user ✅ (Used in LoginScreen)
- `getUserByStudentId` - Get user by Student ID
- `getUserProfile` - Get user profile
- `getAllUsers` - Get leaderboard

### Books
- `addBorrowedBook` - Add borrowed book (+10 points)
- `getUserBorrowedBooks` - Get user's books
- `updateBookStatus` - Update book status
- `deleteBorrowedBook` - Remove book

### Reading
- `addReadingProgress` - Start tracking book (+3 points)
- `updateReadingProgress` - Update reading progress (+3 points)
- `getUserReadingProgress` - Get reading list
- `getCompletedBooks` - Get finished books

### Study
- `completeStudySession` - Record study session (+5 points)
- `getUserStudySessions` - Get study history
- `getStudyStatistics` - Get stats
- `getTodayStudyTime` - Get today's study time

### Reminders
- `getDueSoonBooks` - Books due within 3 days
- `getOverdueBooks` - Overdue books
- `getAllReminders` - All reminders
- `getReminderCount` - Badge counts

---

## 🎮 Using Convex in Other Screens

Example for any screen:

```typescript
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

function MyScreen() {
  // Query (read data)
  const books = useQuery(api.books.getUserBorrowedBooks, { 
    userId: "user-id-here" 
  });

  // Mutation (write data)
  const addBook = useMutation(api.books.addBorrowedBook);

  const handleAddBook = async () => {
    await addBook({
      userId: "user-id-here",
      title: "Clean Code",
      borrowDate: Date.now(),
      returnDate: Date.now() + 14 * 24 * 60 * 60 * 1000
    });
  };

  return (
    // Your UI here
  );
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'convex/react'"

**Fix**: Run `npm install`

```bash
npm install
```

### Error: "Convex client is not connected"

**Fix**: Make sure you:
1. Ran `npx convex dev`
2. Updated the CONVEX_URL in `src/config/convex.ts`
3. Restarted Expo after changes

### TypeScript errors about `api`

**Fix**: The `convex/_generated/` folder is created after running `npx convex dev`

---

## 📖 Next Steps

1. **Run Setup**: Follow steps 1-4 above
2. **Test Login**: Try registering a new user
3. **Add User Context**: Create a global user state to store logged-in user ID
4. **Integrate Other Screens**: Use Convex hooks in other screens
5. **Add Real Authentication**: Implement password verification

---

## 💡 Tips

- Keep `npx convex dev` running while developing
- Check Convex Dashboard for data: https://dashboard.convex.dev
- Backend logs appear in the `convex dev` terminal
- React Native logs appear in Expo terminal

---

## 🎉 You're All Set!

Your LIBGO app now has a fully functional backend! 

Start with: `npx convex dev` then `npm start`

# LibGo - Smart Library Companion (React Native + Expo)

A modern React Native mobile application designed to enhance the student experience when visiting the university library.

## 🎯 Project Overview

**LibGo** is a University Mobile App Development project that serves as a companion app to improve how students interact with their library. The app does **NOT** replace the existing library system but provides additional features to make library visits more engaging and productive.

## ✨ Features

### 1. **Student Login**
- Simple authentication with Student ID and Password
- Secure login flow

### 2. **Home Dashboard**
- Overview of borrowed books
- Books due soon counter
- Library points display
- Quick access to main features

### 3. **Library Guide**
- Step-by-step guide on how to borrow books
- Clear instructions for using OPAC system
- Return instructions

### 4. **Library Map**
- Visual guide to library sections
- Categorized shelves (Education, Computer Science, Religion, Business, etc.)
- Easy navigation to find books

### 5. **Borrowed Books Tracker**
- Track all borrowed books manually
- View borrow and return dates
- Status indicators (Normal, Due Soon, Overdue)
- Filter books by status

### 6. **Book Return Reminder**
- Automatic reminders for books due soon
- Overdue book notifications
- Visual status indicators

### 7. **Study Focus Timer**
- Pomodoro-style timer (25 min focus / 5 min break)
- Session tracking
- Points earned for completed sessions

### 8. **Reading Progress Tracker**
- Track reading progress for each book
- Visual progress bars
- Earn points for updating progress

### 9. **Profile Dashboard**
- Student information display
- Library statistics
- Points and achievements
- Settings and logout

### 10. **Gamification System**
- Earn points for various activities:
  - Add borrowed book: +10 points
  - Complete study timer: +5 points
  - Update reading progress: +3 points

## 🎨 Design

### Color Palette
- **Primary**: `#1E3A8A` (Deep Blue)
- **Secondary**: `#3B82F6` (Sky Blue)
- **Accent**: `#FBBF24` (Golden Yellow)
- **Background**: `#F8FAFC` (Light Gray)

### Status Colors
- **Success/Normal**: `#22C55E` (Green)
- **Warning/Due Soon**: `#F59E0B` (Orange)
- **Error/Overdue**: `#EF4444` (Red)

## 📱 Technology Stack

- **Framework**: React Native
- **Development**: Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **UI Library**: React Native Paper
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. **Navigate to project folder**
   ```bash
   cd "/Users/evangjelikacoraliepietersz/Desktop/MID MAD"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Expo development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan the QR code with **Expo Go** app on your phone
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator (Mac only)

## 📱 Testing with Expo Go

1. Download **Expo Go** from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Make sure your phone and computer are on the same WiFi network

3. Run `npx expo start` in terminal

4. Scan QR code:
   - **Android**: Use Expo Go app to scan
   - **iOS**: Use Camera app to scan, then open in Expo Go

## 📁 Project Structure

```
src/
├── constants/
│   ├── theme.ts              # App theme and colors
│   └── constants.ts          # App constants
├── types/
│   ├── Book.ts               # Book data types
│   └── User.ts               # User data types
├── data/
│   └── dummyBooks.ts         # Dummy data for testing
├── components/
│   ├── CustomButton.tsx      # Reusable button component
│   ├── BookCard.tsx          # Book display card
│   ├── StatCard.tsx          # Statistics card
│   └── ProgressCard.tsx      # Reading progress card
├── screens/
│   ├── LoginScreen.tsx       # Login page
│   ├── HomeScreen.tsx        # Dashboard
│   ├── LibraryGuideScreen.tsx # Borrowing guide
│   ├── LibraryMapScreen.tsx  # Library sections
│   ├── BorrowedBooksScreen.tsx # Books list
│   ├── AddBookScreen.tsx     # Add new book
│   ├── ReminderScreen.tsx    # Reminders
│   ├── StudyTimerScreen.tsx  # Pomodoro timer
│   ├── ReadingTrackerScreen.tsx # Reading progress
│   └── ProfileScreen.tsx     # User profile
├── navigation/
│   └── MainNavigation.tsx    # Bottom tab navigation
└── utils/
    └── dateUtils.ts          # Date helper functions
```

## 🎓 Educational Purpose

This application is developed for a **University Mobile App Development** course. It demonstrates:

- React Native development with Expo
- TypeScript usage
- React Navigation implementation
- Component-based architecture
- State management with hooks
- Custom UI components
- Date handling
- Timer implementation
- Modal dialogs
- Form handling

## 🔒 Important Constraints

- **No API Integration**: The app does not connect to real library databases
- **No OPAC Access**: Does not replace the library's OPAC system
- **Manual Entry**: Books are manually tracked by students
- **Dummy Data**: Uses sample data for demonstration

## 📝 Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Start on Android
npx expo start --android

# Start on iOS
npx expo start --ios

# Clear cache
npx expo start -c
```

## 🐛 Troubleshooting

**QR Code not working?**
- Make sure phone and computer are on same WiFi
- Try typing the URL manually in Expo Go
- Run `npx expo start --tunnel` for slower but more reliable connection

**App not loading?**
- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Make sure Expo Go app is updated

## 📝 License

This project is created for educational purposes as part of a University Mobile App Development course.

## 👨‍💻 Author

Student Project - Mobile App Development Course

---

**Note**: This is a student project designed to complement, not replace, the existing library system. All data is stored locally and is for demonstration purposes only.

Built with ❤️ using React Native + Expo

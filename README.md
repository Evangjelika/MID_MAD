# LibGo - Smart Library Companion

A modern Flutter mobile application designed to enhance the student experience when visiting the university library.

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

### UI Principles
- Material Design 3
- Clean and minimal design
- Card-based layout
- Rounded corners with soft shadows
- Consistent spacing and padding
- Modern iconography

## 🏗️ Project Structure

```
lib/
├── main.dart                      # App entry point
├── core/
│   ├── theme.dart                 # App theme and colors
│   └── constants.dart             # App constants
├── models/
│   ├── book.dart                  # Book data model
│   └── user.dart                  # User data model
├── data/
│   └── dummy_books.dart           # Dummy data for testing
├── widgets/
│   ├── custom_button.dart         # Reusable button widget
│   ├── book_card.dart             # Book display card
│   ├── stat_card.dart             # Statistics card
│   └── progress_card.dart         # Reading progress card
├── screens/
│   ├── login_screen.dart          # Login page
│   ├── main_navigation.dart       # Bottom navigation
│   ├── home_screen.dart           # Dashboard
│   ├── library_guide_screen.dart  # Borrowing guide
│   ├── library_map_screen.dart    # Library sections
│   ├── borrowed_books_screen.dart # Books list
│   ├── add_book_screen.dart       # Add new book
│   ├── reminder_screen.dart       # Reminders
│   ├── study_timer_screen.dart    # Pomodoro timer
│   ├── reading_tracker_screen.dart # Reading progress
│   └── profile_screen.dart        # User profile
└── utils/
    └── date_utils.dart            # Date helper functions
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (>=3.0.0)
- Dart SDK
- Android Studio / VS Code
- Android Emulator / iOS Simulator / Physical Device

### Installation

1. **Clone or download the project**
   ```bash
   cd "MID MAD"
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

## 📱 App Navigation

The app uses a **Bottom Navigation Bar** with 4 main tabs:

1. **Home** 🏠 - Dashboard with overview and quick actions
2. **Books** 📚 - View and manage borrowed books
3. **Focus** ⏱️ - Study timer for focused sessions
4. **Profile** 👤 - User profile and settings

## 🎓 Educational Purpose

This application is developed for a **University Mobile App Development** course. It demonstrates:

- Clean Flutter architecture
- Material Design 3 implementation
- State management
- Custom widgets and reusability
- User interface best practices
- Navigation patterns
- Form handling and validation
- Date management
- Local data handling
- Timer implementation
- Gamification concepts

## 🔒 Important Constraints

- **No API Integration**: The app does not connect to real library databases
- **No OPAC Access**: Does not replace the library's OPAC system
- **Manual Entry**: Books are manually tracked by students
- **Dummy Data**: Uses sample data for demonstration

## 📝 License

This project is created for educational purposes as part of a University Mobile App Development course.

## 👨‍💻 Author

Student Project - Mobile App Development Course

## 🙏 Acknowledgments

- Flutter Team for the amazing framework
- Material Design for design guidelines
- University for the project opportunity

---

**Note**: This is a student project designed to complement, not replace, the existing library system. All data is stored locally and is for demonstration purposes only.

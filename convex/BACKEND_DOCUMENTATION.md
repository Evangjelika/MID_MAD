# LIBGO - Convex Backend Documentation

## Overview

This is the complete Convex backend for **LIBGO – Smart Library Companion**, a mobile application that helps students manage their library borrowing, reading progress, and study sessions.

**Important**: This backend does NOT connect to any university library system. All data is user-generated and manually entered by students.

---

## Backend Structure

```
convex/
├── schema.ts              # Database schema definitions
├── users.ts               # User management functions
├── books.ts               # Borrowed books management
├── reading.ts             # Reading progress tracking
├── study.ts               # Study session tracking
├── reminders.ts           # Book return reminders
└── utils/
    └── bookStatus.ts      # Book status calculation utilities
```

---

## Database Schema

### Table: `users`
Stores student account information and gamification points.

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | string | Unique student identifier |
| `name` | string | Student's full name |
| `faculty` | string | Faculty/Department |
| `points` | number | Gamification points |
| `createdAt` | number | Account creation timestamp |

### Table: `borrowedBooks`
Tracks books students have manually added when borrowing from the library.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | Id<users> | Reference to user |
| `title` | string | Book title |
| `author` | string (optional) | Book author |
| `borrowDate` | number | Borrow date timestamp |
| `returnDate` | number | Expected return date |
| `status` | "normal" \| "dueSoon" \| "late" | Return status |
| `createdAt` | number | Record creation timestamp |

### Table: `readingProgress`
Tracks reading progress for books students are actively reading.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | Id<users> | Reference to user |
| `bookTitle` | string | Book title |
| `progress` | number | Progress percentage (0-100) |
| `updatedAt` | number | Last update timestamp |

### Table: `studySessions`
Records completed study/focus timer sessions.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | Id<users> | Reference to user |
| `durationMinutes` | number | Session duration in minutes |
| `completedAt` | number | Completion timestamp |

---

## Gamification Points System

Points are automatically awarded for various activities:

| Activity | Points Awarded |
|----------|----------------|
| Add borrowed book | +10 points |
| Complete study session | +5 points |
| Add/update reading progress | +3 points |

Points are handled **inside backend mutations** and update automatically.

---

## Book Status Logic

Book status is calculated based on the return date:

| Status | Condition |
|--------|-----------|
| `normal` | Return date more than 3 days away |
| `dueSoon` | Return date within 3 days |
| `late` | Return date has passed |

Status is automatically calculated using the `calculateBookStatus()` utility function.

---

## API Functions

### User Management (`users.ts`)

#### `createUser`
Creates a new user account.

```typescript
const userId = await api.users.createUser({
  studentId: "S12345678",
  name: "John Doe",
  faculty: "Computer Science"
});
```

#### `getUserByStudentId`
Retrieves user by student ID.

```typescript
const user = await api.users.getUserByStudentId({
  studentId: "S12345678"
});
```

#### `getUserProfile`
Retrieves user profile by user ID.

```typescript
const profile = await api.users.getUserProfile({
  userId: userId
});
```

#### `getAllUsers`
Gets all users sorted by points (for leaderboard).

```typescript
const leaderboard = await api.users.getAllUsers();
```

#### `updateUserProfile`
Updates user profile information.

```typescript
await api.users.updateUserProfile({
  userId: userId,
  name: "Jane Doe",
  faculty: "Engineering"
});
```

---

### Borrowed Books (`books.ts`)

#### `addBorrowedBook`
Adds a new borrowed book. Awards +10 points.

```typescript
const bookId = await api.books.addBorrowedBook({
  userId: userId,
  title: "Introduction to Algorithms",
  author: "Cormen et al.",
  borrowDate: Date.now(),
  returnDate: Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days
});
```

#### `getUserBorrowedBooks`
Gets all borrowed books for a user.

```typescript
const books = await api.books.getUserBorrowedBooks({
  userId: userId
});
```

#### `updateBookStatus`
Updates book status or return date.

```typescript
await api.books.updateBookStatus({
  bookId: bookId,
  returnDate: Date.now() + 7 * 24 * 60 * 60 * 1000 // Extended
});
```

#### `deleteBorrowedBook`
Removes a borrowed book (when returned).

```typescript
await api.books.deleteBorrowedBook({
  bookId: bookId
});
```

#### `getBooksByStatus`
Gets books filtered by status.

```typescript
const lateBooks = await api.books.getBooksByStatus({
  userId: userId,
  status: "late"
});
```

---

### Reading Progress (`reading.ts`)

#### `addReadingProgress`
Creates a new reading progress entry. Awards +3 points.

```typescript
const progressId = await api.reading.addReadingProgress({
  userId: userId,
  bookTitle: "Clean Code",
  progress: 15
});
```

#### `updateReadingProgress`
Updates reading progress. Awards +3 points.

```typescript
await api.reading.updateReadingProgress({
  progressId: progressId,
  progress: 45
});
```

#### `updateReadingProgressByTitle`
Alternative way to update progress using book title.

```typescript
await api.reading.updateReadingProgressByTitle({
  userId: userId,
  bookTitle: "Clean Code",
  progress: 65
});
```

#### `getUserReadingProgress`
Gets all reading progress for a user.

```typescript
const readingList = await api.reading.getUserReadingProgress({
  userId: userId
});
```

#### `getCompletedBooks`
Gets books with 100% progress.

```typescript
const completed = await api.reading.getCompletedBooks({
  userId: userId
});
```

#### `getInProgressBooks`
Gets books with 1-99% progress.

```typescript
const inProgress = await api.reading.getInProgressBooks({
  userId: userId
});
```

---

### Study Sessions (`study.ts`)

#### `completeStudySession`
Records a completed study session. Awards +5 points.

```typescript
const sessionId = await api.study.completeStudySession({
  userId: userId,
  durationMinutes: 25
});
```

#### `getUserStudySessions`
Gets all study sessions for a user.

```typescript
const sessions = await api.study.getUserStudySessions({
  userId: userId
});
```

#### `getStudyStatistics`
Gets study statistics (total sessions, minutes, average).

```typescript
const stats = await api.study.getStudyStatistics({
  userId: userId
});
// Returns: { totalSessions: 10, totalMinutes: 250, averageDuration: 25 }
```

#### `getTodayStudyTime`
Gets today's study time.

```typescript
const today = await api.study.getTodayStudyTime({
  userId: userId
});
// Returns: { sessions: 3, totalMinutes: 75 }
```

#### `getWeeklyStudySummary`
Gets weekly study summary grouped by day.

```typescript
const weekly = await api.study.getWeeklyStudySummary({
  userId: userId
});
```

---

### Reminders (`reminders.ts`)

#### `getDueSoonBooks`
Gets books due within 3 days.

```typescript
const dueSoon = await api.reminders.getDueSoonBooks({
  userId: userId
});
```

#### `getOverdueBooks`
Gets overdue books.

```typescript
const overdue = await api.reminders.getOverdueBooks({
  userId: userId
});
```

#### `getAllReminders`
Gets all books requiring attention.

```typescript
const reminders = await api.reminders.getAllReminders({
  userId: userId
});
// Returns: { dueSoon: [...], overdue: [...], totalReminders: 3 }
```

#### `getReminderCount`
Gets reminder counts for badge display.

```typescript
const counts = await api.reminders.getReminderCount({
  userId: userId
});
// Returns: { dueSoon: 2, overdue: 1, total: 3 }
```

#### `hasUrgentReminders`
Quick check for urgent reminders.

```typescript
const hasUrgent = await api.reminders.hasUrgentReminders({
  userId: userId
});
```

---

## Setup Instructions

### 1. Install Convex

If not already installed:

```bash
npm install convex
```

### 2. Initialize Convex (if not done)

```bash
npx convex dev
```

This will:
- Create a Convex project
- Deploy your schema and functions
- Start the development server

### 3. Get Your Convex URL

After running `npx convex dev`, you'll get a deployment URL. Add it to your React Native app's configuration.

### 4. Connect from React Native

In your React Native app, install the Convex client:

```bash
npm install convex
```

Then configure the client:

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      {/* Your app components */}
    </ConvexProvider>
  );
}
```

### 5. Use in Your Components

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent() {
  // Query
  const user = useQuery(api.users.getUserProfile, { userId: "..." });
  
  // Mutation
  const addBook = useMutation(api.books.addBorrowedBook);
  
  const handleAddBook = async () => {
    await addBook({
      userId: "...",
      title: "Book Title",
      borrowDate: Date.now(),
      returnDate: Date.now() + 14 * 24 * 60 * 60 * 1000
    });
  };
  
  return <View>{/* Your UI */}</View>;
}
```

---

## Best Practices

### 1. Error Handling
Always wrap mutation calls in try-catch blocks:

```typescript
try {
  await addBook({ ... });
} catch (error) {
  console.error("Failed to add book:", error);
}
```

### 2. Date Handling
Use timestamps (milliseconds) for all dates:

```typescript
const now = Date.now();
const twoWeeksLater = now + 14 * 24 * 60 * 60 * 1000;
```

### 3. Progress Validation
Ensure progress values are between 0-100:

```typescript
const progress = Math.min(Math.max(value, 0), 100);
```

### 4. Status Updates
Book statuses are automatically calculated in queries. To manually update statuses across all books:

```typescript
await api.books.bulkUpdateBookStatuses();
```

---

## Testing

### Test User Creation

```typescript
const userId = await api.users.createUser({
  studentId: "S12345678",
  name: "Test User",
  faculty: "Computer Science"
});
```

### Test Book Flow

```typescript
// 1. Add a book
const bookId = await api.books.addBorrowedBook({
  userId: userId,
  title: "Test Book",
  borrowDate: Date.now(),
  returnDate: Date.now() + 2 * 24 * 60 * 60 * 1000 // Due in 2 days
});

// 2. Check reminders
const reminders = await api.reminders.getDueSoonBooks({ userId });
console.log("Due soon books:", reminders);

// 3. Delete book
await api.books.deleteBorrowedBook({ bookId });
```

---

## Production Considerations

1. **Authentication**: Add authentication before deploying to production
2. **Data Validation**: All inputs are validated in mutations
3. **Indexes**: Schema includes proper indexes for performance
4. **Error Messages**: Clear error messages for debugging
5. **Point System**: Points are atomically updated to prevent race conditions

---

## Support

For issues or questions about this backend:
1. Check the inline code comments
2. Review the function examples above
3. Test with the Convex dashboard at https://dashboard.convex.dev

---

## License

This backend is part of the LIBGO university project.

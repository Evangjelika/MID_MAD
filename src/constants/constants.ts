export const APP_NAME = 'LibGo';
export const APP_TAGLINE = 'Smart Library Companion';

// Points System
export const POINTS = {
  ADD_BOOK: 10,
  COMPLETE_TIMER: 5,
  TRACK_READING: 3,
};

// Timer Durations (in minutes)
export const TIMER = {
  FOCUS_DURATION: 25,
  BREAK_DURATION: 5,
};

// Due Date Warning (in days)
export const DUE_SOON_THRESHOLD = 3;

// Library Sections
export const LIBRARY_SECTIONS = [
  { name: 'Shelf A', category: 'Education', icon: '📚' },
  { name: 'Shelf B', category: 'Computer Science', icon: '💻' },
  { name: 'Shelf C', category: 'Religion', icon: '🕌 💒' },
  { name: 'Shelf D', category: 'Business', icon: '💼' },
  { name: 'Shelf E', category: 'Social Sciences', icon: '🌍' },
  { name: 'Shelf F', category: 'Engineering', icon: '⚙️' },
];

// Library Guide Steps
export const LIBRARY_GUIDE_STEPS = [
  {
    number: '1',
    title: 'Search Books via OPAC',
    description: 'Use the library OPAC system to search for available books',
  },
  {
    number: '2',
    title: 'Search Using Filters',
    description: 'Search by Title, Author, or Subject to find your book',
  },
  {
    number: '3',
    title: 'Write Down Call Number',
    description: 'Note the Call Number displayed for your selected book',
  },
  {
    number: '4',
    title: 'Find the Correct Shelf',
    description: 'Use the Call Number to locate the shelf where the book is stored',
  },
  {
    number: '5',
    title: 'Bring Book to Circulation Desk',
    description: 'Take the book to the circulation desk to borrow it',
  },
  {
    number: '6',
    title: 'Borrow Using Student ID',
    description: 'Present your student ID card to complete the borrowing process',
  },
];

// Return Instructions
export const RETURN_INSTRUCTIONS =
  'To return books, bring them to the circulation desk or use the return box located at the library entrance.';

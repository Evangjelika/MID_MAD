import { Book, isDueSoon, isOverdue } from '../types/Book';

export const getDummyBooks = (): Book[] => {
  const now = new Date();

  return [
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      readingProgress: 65,
    },
    {
      id: '2',
      title: 'Database Systems',
      author: 'Ramez Elmasri',
      borrowDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      readingProgress: 40,
    },
    {
      id: '3',
      title: 'Operating Systems Concepts',
      author: 'Abraham Silberschatz',
      borrowDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      readingProgress: 85,
    },
    {
      id: '4',
      title: 'Data Structures and Algorithms',
      author: 'Thomas H. Cormen',
      borrowDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      readingProgress: 30,
    },
    {
      id: '5',
      title: 'Software Engineering',
      author: 'Ian Sommerville',
      borrowDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      readingProgress: 15,
    },
    {
      id: '6',
      title: 'Computer Networks',
      author: 'Andrew S. Tanenbaum',
      borrowDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      readingProgress: 75,
    },
  ];
};

export const getDueSoonBooks = (books: Book[]): Book[] => {
  return books.filter((book) => isDueSoon(book));
};

export const getOverdueBooks = (books: Book[]): Book[] => {
  return books.filter((book) => isOverdue(book));
};

export const getNormalBooks = (books: Book[]): Book[] => {
  return books.filter((book) => !isDueSoon(book) && !isOverdue(book));
};

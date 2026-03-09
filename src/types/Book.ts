import { DUE_SOON_THRESHOLD } from '../constants/constants';

export enum BookStatus {
  NORMAL = 'normal',
  DUE_SOON = 'dueSoon',
  OVERDUE = 'overdue',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  borrowDate: Date;
  returnDate: Date;
  readingProgress: number;
}

export const getBookStatus = (book: Book): BookStatus => {
  const now = new Date();
  const daysUntilDue = Math.floor(
    (book.returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) {
    return BookStatus.OVERDUE;
  } else if (daysUntilDue <= DUE_SOON_THRESHOLD) {
    return BookStatus.DUE_SOON;
  } else {
    return BookStatus.NORMAL;
  }
};

export const getDaysUntilDue = (book: Book): number => {
  const now = new Date();
  return Math.floor(
    (book.returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
};

export const isOverdue = (book: Book): boolean => {
  return new Date() > book.returnDate;
};

export const isDueSoon = (book: Book): boolean => {
  const daysUntilDue = getDaysUntilDue(book);
  return daysUntilDue > 0 && daysUntilDue <= DUE_SOON_THRESHOLD;
};

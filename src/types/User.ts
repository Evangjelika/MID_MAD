export interface User {
  id: string;
  name: string;
  studentId: string;
  faculty: string;
  libraryPoints: number;
  booksBorrowed: number;
  booksReturned: number;
}

export const createUser = (
  id: string,
  name: string,
  studentId: string,
  faculty: string
): User => ({
  id,
  name,
  studentId,
  faculty,
  libraryPoints: 45,
  booksBorrowed: 6,
  booksReturned: 12,
});

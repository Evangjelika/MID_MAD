/**
 * BOOK STATUS UTILITY
 * 
 * Calculates the status of a borrowed book based on its return date.
 * 
 * Status Logic:
 * - "normal": Return date is more than 3 days away
 * - "dueSoon": Return date is within 3 days (including today)
 * - "late": Return date has already passed
 */

export type BookStatus = "normal" | "dueSoon" | "late";

/**
 * Calculate the status of a borrowed book based on return date
 * 
 * @param returnDate - The expected return date timestamp (milliseconds)
 * @returns BookStatus - The calculated status
 * 
 * @example
 * const status = calculateBookStatus(Date.now() + 2 * 24 * 60 * 60 * 1000);
 * // Returns "dueSoon" (2 days from now)
 */
export function calculateBookStatus(returnDate: number): BookStatus {
  const now = Date.now();
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  const timeDifference = returnDate - now;

  // Book is already overdue
  if (timeDifference < 0) {
    return "late";
  }

  // Book is due within 3 days
  if (timeDifference <= threeDaysInMs) {
    return "dueSoon";
  }

  // Book return date is more than 3 days away
  return "normal";
}

/**
 * Get a human-readable description of the book status
 * 
 * @param status - The book status
 * @returns string - A user-friendly description
 */
export function getStatusDescription(status: BookStatus): string {
  switch (status) {
    case "normal":
      return "No rush - you have plenty of time to return this book";
    case "dueSoon":
      return "Due soon - return within 3 days";
    case "late":
      return "Overdue - please return as soon as possible";
  }
}

/**
 * Calculate days until return date
 * Useful for displaying countdown in the UI
 * 
 * @param returnDate - The expected return date timestamp
 * @returns number - Days until return (negative if overdue)
 */
export function getDaysUntilReturn(returnDate: number): number {
  const now = Date.now();
  const timeDifference = returnDate - now;
  const daysUntilReturn = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
  
  return daysUntilReturn;
}

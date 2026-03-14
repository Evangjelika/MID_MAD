import { v } from "convex/values";
import { query } from "./_generated/server";
import { calculateBookStatus, getDaysUntilReturn } from "./utils/bookStatus";

/**
 * BOOK RETURN REMINDERS
 * 
 * Provides queries for getting books that need attention
 * Used to power reminder notifications and alerts
 */

/**
 * GET DUE SOON BOOKS
 * 
 * Retrieves all books that are due within 3 days for a user
 * These books should trigger reminder notifications
 * 
 * @param userId - The user's ID
 * @returns Array of books with "dueSoon" status, sorted by return date
 * 
 * @example
 * const dueSoonBooks = await api.reminders.getDueSoonBooks({
 *   userId: "abc123..."
 * });
 */
export const getDueSoonBooks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for books with "dueSoon" status
    const dueSoonBooks = books
      .map((book) => ({
        ...book,
        status: calculateBookStatus(book.returnDate),
        daysUntilReturn: getDaysUntilReturn(book.returnDate),
      }))
      .filter((book) => book.status === "dueSoon");

    // Sort by return date (soonest first)
    return dueSoonBooks.sort((a, b) => a.returnDate - b.returnDate);
  },
});

/**
 * GET OVERDUE BOOKS
 * 
 * Retrieves all books that are past their return date for a user
 * These books should trigger urgent notifications
 * 
 * @param userId - The user's ID
 * @returns Array of books with "late" status, sorted by how overdue they are
 * 
 * @example
 * const overdueBooks = await api.reminders.getOverdueBooks({
 *   userId: "abc123..."
 * });
 */
export const getOverdueBooks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for books with "late" status
    const overdueBooks = books
      .map((book) => ({
        ...book,
        status: calculateBookStatus(book.returnDate),
        daysOverdue: Math.abs(getDaysUntilReturn(book.returnDate)),
      }))
      .filter((book) => book.status === "late");

    // Sort by how overdue (most overdue first)
    return overdueBooks.sort((a, b) => a.returnDate - b.returnDate);
  },
});

/**
 * GET ALL REMINDERS
 * 
 * Retrieves all books requiring attention (both due soon and overdue)
 * Useful for displaying a combined reminder list
 * 
 * @param userId - The user's ID
 * @returns Object with dueSoon and overdue book arrays
 * 
 * @example
 * const reminders = await api.reminders.getAllReminders({
 *   userId: "abc123..."
 * });
 * // Returns: { dueSoon: [...], overdue: [...] }
 */
export const getAllReminders = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Process all books and categorize by status
    const booksWithStatus = books.map((book) => ({
      ...book,
      status: calculateBookStatus(book.returnDate),
      daysUntilReturn: getDaysUntilReturn(book.returnDate),
    }));

    const dueSoon = booksWithStatus
      .filter((book) => book.status === "dueSoon")
      .sort((a, b) => a.returnDate - b.returnDate);

    const overdue = booksWithStatus
      .filter((book) => book.status === "late")
      .sort((a, b) => a.returnDate - b.returnDate);

    return {
      dueSoon,
      overdue,
      totalReminders: dueSoon.length + overdue.length,
    };
  },
});

/**
 * GET REMINDER COUNT
 * 
 * Gets the total number of books requiring attention
 * Useful for badge counts in the UI
 * 
 * @param userId - The user's ID
 * @returns Object with counts for due soon, overdue, and total
 * 
 * @example
 * const counts = await api.reminders.getReminderCount({
 *   userId: "abc123..."
 * });
 * // Returns: { dueSoon: 2, overdue: 1, total: 3 }
 */
export const getReminderCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Count books by status
    let dueSoonCount = 0;
    let overdueCount = 0;

    books.forEach((book) => {
      const status = calculateBookStatus(book.returnDate);
      if (status === "dueSoon") {
        dueSoonCount++;
      } else if (status === "late") {
        overdueCount++;
      }
    });

    return {
      dueSoon: dueSoonCount,
      overdue: overdueCount,
      total: dueSoonCount + overdueCount,
    };
  },
});

/**
 * GET BOOKS DUE TODAY
 * 
 * Retrieves books that are due today specifically
 * Useful for daily notifications
 * 
 * @param userId - The user's ID
 * @returns Array of books due today
 * 
 * @example
 * const todayBooks = await api.reminders.getBooksDueToday({
 *   userId: "abc123..."
 * });
 */
export const getBooksDueToday = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for books due today (0 days until return)
    const booksDueToday = books
      .map((book) => ({
        ...book,
        daysUntilReturn: getDaysUntilReturn(book.returnDate),
      }))
      .filter((book) => book.daysUntilReturn === 0);

    return booksDueToday;
  },
});

/**
 * GET URGENT REMINDERS
 * 
 * Gets only the most urgent reminders (due tomorrow or overdue)
 * Used for priority notifications
 * 
 * @param userId - The user's ID
 * @returns Array of urgent books
 * 
 * @example
 * const urgentBooks = await api.reminders.getUrgentReminders({
 *   userId: "abc123..."
 * });
 */
export const getUrgentReminders = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for urgent books (overdue or due within 1 day)
    const urgentBooks = books
      .map((book) => ({
        ...book,
        status: calculateBookStatus(book.returnDate),
        daysUntilReturn: getDaysUntilReturn(book.returnDate),
      }))
      .filter(
        (book) =>
          book.status === "late" ||
          (book.status === "dueSoon" && book.daysUntilReturn <= 1)
      );

    // Sort by urgency (overdue first, then by return date)
    return urgentBooks.sort((a, b) => {
      if (a.status === "late" && b.status !== "late") return -1;
      if (a.status !== "late" && b.status === "late") return 1;
      return a.returnDate - b.returnDate;
    });
  },
});

/**
 * HAS URGENT REMINDERS
 * 
 * Quick check if a user has any urgent reminders
 * Useful for showing notification badges
 * 
 * @param userId - The user's ID
 * @returns Boolean indicating if there are urgent reminders
 * 
 * @example
 * const hasUrgent = await api.reminders.hasUrgentReminders({
 *   userId: "abc123..."
 * });
 */
export const hasUrgentReminders = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all borrowed books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Check if any book is overdue or due within 1 day
    const hasUrgent = books.some((book) => {
      const status = calculateBookStatus(book.returnDate);
      const daysUntilReturn = getDaysUntilReturn(book.returnDate);

      return (
        status === "late" || (status === "dueSoon" && daysUntilReturn <= 1)
      );
    });

    return hasUrgent;
  },
});

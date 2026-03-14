import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { calculateBookStatus } from "./utils/bookStatus";

/**
 * BORROWED BOOKS MANAGEMENT
 * 
 * Handles adding, retrieving, updating, and deleting borrowed books
 * Integrates with the points system to reward students for tracking their books
 */

/**
 * ADD BORROWED BOOK
 * 
 * Adds a new borrowed book to the user's collection
 * Awards +10 points for adding a book
 * 
 * @param userId - The user who borrowed the book
 * @param title - Book title
 * @param author - Book author (optional)
 * @param borrowDate - When the book was borrowed (timestamp)
 * @param returnDate - When the book should be returned (timestamp)
 * @returns ID of the newly created borrowed book record
 * 
 * @example
 * const bookId = await api.books.addBorrowedBook({
 *   userId: "abc123...",
 *   title: "Introduction to Algorithms",
 *   author: "Cormen et al.",
 *   borrowDate: Date.now(),
 *   returnDate: Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days
 * });
 */
export const addBorrowedBook = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    author: v.optional(v.string()),
    borrowDate: v.number(),
    returnDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate initial status based on return date
    const status = calculateBookStatus(args.returnDate);

    // Create the borrowed book record
    const bookId = await ctx.db.insert("borrowedBooks", {
      userId: args.userId,
      title: args.title,
      author: args.author,
      borrowDate: args.borrowDate,
      returnDate: args.returnDate,
      status: status,
      createdAt: Date.now(),
    });

    // Award points for adding a borrowed book (+10 points)
    const newPoints = user.points + 10;
    await ctx.db.patch(args.userId, {
      points: newPoints,
    });

    return bookId;
  },
});

/**
 * GET USER BORROWED BOOKS
 * 
 * Retrieves all borrowed books for a specific user
 * Automatically recalculates book status based on current date
 * 
 * @param userId - The user's ID
 * @returns Array of borrowed books with current status
 * 
 * @example
 * const books = await api.books.getUserBorrowedBooks({ userId: "abc123..." });
 */
export const getUserBorrowedBooks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Recalculate status for each book based on current date
    const booksWithUpdatedStatus = books.map((book) => ({
      ...book,
      status: calculateBookStatus(book.returnDate),
    }));

    // Sort by return date (earliest first)
    return booksWithUpdatedStatus.sort((a, b) => a.returnDate - b.returnDate);
  },
});

/**
 * UPDATE BORROWED BOOK
 * 
 * Updates details of a borrowed book (title, author, dates)
 * Automatically recalculates status based on new return date
 * 
 * @param bookId - The borrowed book's ID
 * @param title - Optional new title
 * @param author - Optional new author
 * @param borrowDate - Optional new borrow date
 * @param returnDate - Optional new return date
 * 
 * @example
 * await api.books.updateBorrowedBook({
 *   bookId: "xyz789...",
 *   title: "Updated Title",
 *   returnDate: Date.now() + 14 * 24 * 60 * 60 * 1000
 * });
 */
export const updateBorrowedBook = mutation({
  args: {
    bookId: v.id("borrowedBooks"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    borrowDate: v.optional(v.number()),
    returnDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);

    if (!book) {
      throw new Error("Borrowed book not found");
    }

    // Build update object
    const updates: {
      title?: string;
      author?: string;
      borrowDate?: number;
      returnDate?: number;
      status?: "normal" | "dueSoon" | "late";
    } = {};

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    if (args.author !== undefined) {
      updates.author = args.author;
    }

    if (args.borrowDate !== undefined) {
      updates.borrowDate = args.borrowDate;
    }

    if (args.returnDate !== undefined) {
      updates.returnDate = args.returnDate;
      // Recalculate status if return date changed
      updates.status = calculateBookStatus(args.returnDate);
    }

    // Update the book record
    await ctx.db.patch(args.bookId, updates);

    return { success: true };
  },
});

/**
 * UPDATE BOOK STATUS
 * 
 * Manually updates a book's status or updates its return date
 * Status is automatically recalculated based on the new return date
 * 
 * @param bookId - The borrowed book's ID
 * @param returnDate - Optional new return date
 * 
 * @example
 * await api.books.updateBookStatus({
 *   bookId: "xyz789...",
 *   returnDate: Date.now() + 7 * 24 * 60 * 60 * 1000 // Extended by 7 days
 * });
 */
export const updateBookStatus = mutation({
  args: {
    bookId: v.id("borrowedBooks"),
    returnDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);

    if (!book) {
      throw new Error("Borrowed book not found");
    }

    // Determine the return date to use
    const returnDate = args.returnDate ?? book.returnDate;

    // Recalculate status based on return date
    const newStatus = calculateBookStatus(returnDate);

    // Update the book record
    const updates: {
      status: "normal" | "dueSoon" | "late";
      returnDate?: number;
    } = {
      status: newStatus,
    };

    if (args.returnDate) {
      updates.returnDate = args.returnDate;
    }

    await ctx.db.patch(args.bookId, updates);

    return { success: true, newStatus };
  },
});

/**
 * DELETE BORROWED BOOK
 * 
 * Removes a borrowed book from the user's collection
 * Use this when a book has been returned to the library
 * 
 * @param bookId - The borrowed book's ID
 * 
 * @example
 * await api.books.deleteBorrowedBook({ bookId: "xyz789..." });
 */
export const deleteBorrowedBook = mutation({
  args: {
    bookId: v.id("borrowedBooks"),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);

    if (!book) {
      throw new Error("Borrowed book not found");
    }

    // Delete the book record
    await ctx.db.delete(args.bookId);

    return { success: true };
  },
});

/**
 * GET BOOK BY ID
 * 
 * Retrieves a specific borrowed book with current status
 * 
 * @param bookId - The borrowed book's ID
 * @returns The book object with current status
 * 
 * @example
 * const book = await api.books.getBookById({ bookId: "xyz789..." });
 */
export const getBookById = query({
  args: {
    bookId: v.id("borrowedBooks"),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);

    if (!book) {
      return null;
    }

    // Recalculate status based on current date
    return {
      ...book,
      status: calculateBookStatus(book.returnDate),
    };
  },
});

/**
 * GET BOOKS BY STATUS
 * 
 * Retrieves all books for a user filtered by status
 * Useful for showing specific categories (e.g., only overdue books)
 * 
 * @param userId - The user's ID
 * @param status - The status to filter by
 * @returns Array of books with the specified status
 * 
 * @example
 * const lateBooks = await api.books.getBooksByStatus({
 *   userId: "abc123...",
 *   status: "late"
 * });
 */
export const getBooksByStatus = query({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("normal"),
      v.literal("dueSoon"),
      v.literal("late")
    ),
  },
  handler: async (ctx, args) => {
    // Get all books for this user
    const books = await ctx.db
      .query("borrowedBooks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by status (recalculated)
    const filteredBooks = books
      .map((book) => ({
        ...book,
        status: calculateBookStatus(book.returnDate),
      }))
      .filter((book) => book.status === args.status);

    // Sort by return date
    return filteredBooks.sort((a, b) => a.returnDate - b.returnDate);
  },
});

/**
 * BULK UPDATE BOOK STATUSES
 * 
 * Updates the status of all borrowed books in the database
 * This can be run periodically to ensure statuses are current
 * 
 * @returns Number of books updated
 * 
 * @example
 * const updated = await api.books.bulkUpdateBookStatuses();
 */
export const bulkUpdateBookStatuses = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all borrowed books
    const allBooks = await ctx.db.query("borrowedBooks").collect();

    let updatedCount = 0;

    // Update each book's status
    for (const book of allBooks) {
      const currentStatus = calculateBookStatus(book.returnDate);

      // Only update if status has changed
      if (book.status !== currentStatus) {
        await ctx.db.patch(book._id, {
          status: currentStatus,
        });
        updatedCount++;
      }
    }

    return updatedCount;
  },
});

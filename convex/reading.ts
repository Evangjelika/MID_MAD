import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * READING PROGRESS TRACKER
 * 
 * Manages reading progress for books students are actively reading
 * Integrates with points system to reward reading activity
 */

/**
 * ADD READING PROGRESS
 * 
 * Creates a new reading progress entry for a book
 * Awards +3 points for starting to track a new book
 * 
 * @param userId - The user reading the book
 * @param bookTitle - Title of the book
 * @param progress - Initial progress percentage (0-100)
 * @returns ID of the newly created reading progress record
 * 
 * @example
 * const progressId = await api.reading.addReadingProgress({
 *   userId: "abc123...",
 *   bookTitle: "Clean Code",
 *   progress: 15
 * });
 */
export const addReadingProgress = mutation({
  args: {
    userId: v.id("users"),
    bookTitle: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate progress is between 0 and 100
    if (args.progress < 0 || args.progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    // Check if reading progress already exists for this book
    const existingProgress = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId_bookTitle", (q) =>
        q.eq("userId", args.userId).eq("bookTitle", args.bookTitle)
      )
      .first();

    if (existingProgress) {
      throw new Error(
        "Reading progress already exists for this book. Use updateReadingProgress instead."
      );
    }

    // Create new reading progress entry
    const progressId = await ctx.db.insert("readingProgress", {
      userId: args.userId,
      bookTitle: args.bookTitle,
      progress: args.progress,
      updatedAt: Date.now(),
    });

    // Award points for adding reading progress (+3 points)
    const newPoints = user.points + 3;
    await ctx.db.patch(args.userId, {
      points: newPoints,
    });

    return progressId;
  },
});

/**
 * UPDATE READING PROGRESS
 * 
 * Updates the progress percentage for an existing book
 * Awards +3 points for each update (to encourage regular tracking)
 * 
 * @param progressId - The reading progress record ID
 * @param progress - New progress percentage (0-100)
 * 
 * @example
 * await api.reading.updateReadingProgress({
 *   progressId: "xyz789...",
 *   progress: 45
 * });
 */
export const updateReadingProgress = mutation({
  args: {
    progressId: v.id("readingProgress"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    // Get existing progress record
    const progressRecord = await ctx.db.get(args.progressId);

    if (!progressRecord) {
      throw new Error("Reading progress record not found");
    }

    // Validate progress is between 0 and 100
    if (args.progress < 0 || args.progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    // Verify user exists
    const user = await ctx.db.get(progressRecord.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update progress
    await ctx.db.patch(args.progressId, {
      progress: args.progress,
      updatedAt: Date.now(),
    });

    // Award points for updating reading progress (+3 points)
    const newPoints = user.points + 3;
    await ctx.db.patch(progressRecord.userId, {
      points: newPoints,
    });

    return { success: true };
  },
});

/**
 * UPDATE READING PROGRESS BY BOOK TITLE
 * 
 * Alternative way to update progress using userId and bookTitle
 * Useful when you don't have the progressId
 * 
 * @param userId - The user's ID
 * @param bookTitle - The book title
 * @param progress - New progress percentage (0-100)
 * 
 * @example
 * await api.reading.updateReadingProgressByTitle({
 *   userId: "abc123...",
 *   bookTitle: "Clean Code",
 *   progress: 65
 * });
 */
export const updateReadingProgressByTitle = mutation({
  args: {
    userId: v.id("users"),
    bookTitle: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    // Find existing progress record
    const progressRecord = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId_bookTitle", (q) =>
        q.eq("userId", args.userId).eq("bookTitle", args.bookTitle)
      )
      .first();

    if (!progressRecord) {
      throw new Error(
        "Reading progress not found for this book. Use addReadingProgress first."
      );
    }

    // Validate progress is between 0 and 100
    if (args.progress < 0 || args.progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }

    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update progress
    await ctx.db.patch(progressRecord._id, {
      progress: args.progress,
      updatedAt: Date.now(),
    });

    // Award points for updating reading progress (+3 points)
    const newPoints = user.points + 3;
    await ctx.db.patch(args.userId, {
      points: newPoints,
    });

    return { success: true };
  },
});

/**
 * GET USER READING PROGRESS
 * 
 * Retrieves all reading progress entries for a specific user
 * 
 * @param userId - The user's ID
 * @returns Array of reading progress records, sorted by most recently updated
 * 
 * @example
 * const readingList = await api.reading.getUserReadingProgress({
 *   userId: "abc123..."
 * });
 */
export const getUserReadingProgress = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all reading progress for this user
    const progressRecords = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by most recently updated first
    return progressRecords.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/**
 * GET READING PROGRESS BY BOOK
 * 
 * Retrieves reading progress for a specific book
 * 
 * @param userId - The user's ID
 * @param bookTitle - The book title
 * @returns Reading progress record or null if not found
 * 
 * @example
 * const progress = await api.reading.getReadingProgressByBook({
 *   userId: "abc123...",
 *   bookTitle: "Clean Code"
 * });
 */
export const getReadingProgressByBook = query({
  args: {
    userId: v.id("users"),
    bookTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const progressRecord = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId_bookTitle", (q) =>
        q.eq("userId", args.userId).eq("bookTitle", args.bookTitle)
      )
      .first();

    return progressRecord;
  },
});

/**
 * DELETE READING PROGRESS
 * 
 * Removes a reading progress entry
 * Use this when a book is finished or the user wants to stop tracking it
 * 
 * @param progressId - The reading progress record ID
 * 
 * @example
 * await api.reading.deleteReadingProgress({ progressId: "xyz789..." });
 */
export const deleteReadingProgress = mutation({
  args: {
    progressId: v.id("readingProgress"),
  },
  handler: async (ctx, args) => {
    const progressRecord = await ctx.db.get(args.progressId);

    if (!progressRecord) {
      throw new Error("Reading progress record not found");
    }

    // Delete the progress record
    await ctx.db.delete(args.progressId);

    return { success: true };
  },
});

/**
 * GET COMPLETED BOOKS
 * 
 * Retrieves all books that have been fully read (100% progress)
 * 
 * @param userId - The user's ID
 * @returns Array of completed books
 * 
 * @example
 * const completedBooks = await api.reading.getCompletedBooks({
 *   userId: "abc123..."
 * });
 */
export const getCompletedBooks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all reading progress for this user
    const progressRecords = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for completed books (100% progress)
    const completedBooks = progressRecords.filter(
      (record) => record.progress === 100
    );

    // Sort by completion date (most recent first)
    return completedBooks.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/**
 * GET IN-PROGRESS BOOKS
 * 
 * Retrieves all books that are currently being read (1-99% progress)
 * 
 * @param userId - The user's ID
 * @returns Array of in-progress books
 * 
 * @example
 * const currentBooks = await api.reading.getInProgressBooks({
 *   userId: "abc123..."
 * });
 */
export const getInProgressBooks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all reading progress for this user
    const progressRecords = await ctx.db
      .query("readingProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for in-progress books (1-99% progress)
    const inProgressBooks = progressRecords.filter(
      (record) => record.progress > 0 && record.progress < 100
    );

    // Sort by most recently updated first
    return inProgressBooks.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * LIBGO - Smart Library Companion
 * Database Schema Definition
 * 
 * This schema defines all tables for the student library management system.
 * No external library API integration - all data is user-generated.
 */

export default defineSchema({
  /**
   * USERS TABLE
   * 
   * Stores student account information and gamification points
   */
  users: defineTable({
    studentId: v.string(), // Unique student identifier (e.g., "S12345678")
    name: v.string(), // Student's full name
    faculty: v.string(), // Faculty/Department (e.g., "Computer Science")
    points: v.number(), // Gamification points earned through activities
    createdAt: v.number(), // Account creation timestamp
  }).index("by_studentId", ["studentId"]), // Index for fast lookup by studentId

  /**
   * BORROWED BOOKS TABLE
   * 
   * Tracks books that students have manually added when they borrow from the library
   * Students input these manually as there's no library system integration
   */
  borrowedBooks: defineTable({
    userId: v.id("users"), // Reference to the user who borrowed the book
    title: v.string(), // Book title (manually entered by student)
    author: v.optional(v.string()), // Book author (optional)
    borrowDate: v.number(), // Timestamp when book was borrowed
    returnDate: v.number(), // Expected return date timestamp
    status: v.union(
      v.literal("normal"),
      v.literal("dueSoon"),
      v.literal("late")
    ), // Book return status
    createdAt: v.number(), // Record creation timestamp
  })
    .index("by_userId", ["userId"]) // Index for getting all books for a user
    .index("by_userId_status", ["userId", "status"]), // Index for filtering by user and status

  /**
   * READING PROGRESS TABLE
   * 
   * Tracks student's reading progress for books they're actively reading
   * Progress is measured as percentage (0-100)
   */
  readingProgress: defineTable({
    userId: v.id("users"), // Reference to the user reading the book
    bookTitle: v.string(), // Title of the book being read
    progress: v.number(), // Reading progress percentage (0-100)
    updatedAt: v.number(), // Last update timestamp
  })
    .index("by_userId", ["userId"]) // Index for getting user's reading list
    .index("by_userId_bookTitle", ["userId", "bookTitle"]), // Index for finding specific book progress

  /**
   * STUDY SESSIONS TABLE
   * 
   * Records completed study/focus timer sessions
   * Used for tracking study habits and awarding points
   */
  studySessions: defineTable({
    userId: v.id("users"), // Reference to the user who completed the session
    durationMinutes: v.number(), // Session duration in minutes
    completedAt: v.number(), // Session completion timestamp
  }).index("by_userId", ["userId"]), // Index for getting user's study history
});

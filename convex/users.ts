import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * USER MANAGEMENT FUNCTIONS
 * 
 * Handles user account creation, retrieval, and profile management
 */

/**
 * CREATE USER
 * 
 * Creates a new user account for a student
 * 
 * @param studentId - Unique student identifier (e.g., "S12345678")
 * @param name - Student's full name
 * @param faculty - Student's faculty/department
 * @returns User ID of the newly created user
 * 
 * @example
 * const userId = await api.users.createUser({
 *   studentId: "S12345678",
 *   name: "John Doe",
 *   faculty: "Computer Science"
 * });
 */
export const createUser = mutation({
  args: {
    studentId: v.string(),
    name: v.string(),
    faculty: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if student ID already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .first();

    if (existingUser) {
      throw new Error(`Student ID ${args.studentId} already exists`);
    }

    // Create new user with starting points of 0
    const userId = await ctx.db.insert("users", {
      studentId: args.studentId,
      name: args.name,
      faculty: args.faculty,
      points: 0, // Starting points
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * GET OR CREATE DEMO USER
 * 
 * Gets existing demo user or creates one if it doesn't exist
 * This is used for testing without authentication
 * 
 * @returns User ID of the demo user
 * 
 * @example
 * const userId = await api.users.getOrCreateDemoUser();
 */
export const getOrCreateDemoUser = mutation({
  args: {},
  handler: async (ctx) => {
    const DEMO_STUDENT_ID = "DEMO_USER_LIBGO_123";
    
    // Check if demo user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_studentId", (q) => q.eq("studentId", DEMO_STUDENT_ID))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create demo user
    const userId = await ctx.db.insert("users", {
      studentId: DEMO_STUDENT_ID,
      name: "Demo Student",
      faculty: "Computer Science",
      points: 0,
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * GET USER BY STUDENT ID
 * 
 * Retrieves a user's complete profile using their student ID
 * 
 * @param studentId - The student's unique identifier
 * @returns User object or null if not found
 * 
 * @example
 * const user = await api.users.getUserByStudentId({ studentId: "S12345678" });
 */
export const getUserByStudentId = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .first();

    return user;
  },
});

/**
 * GET USER PROFILE
 * 
 * Retrieves a user's complete profile using their user ID
 * 
 * @param userId - The user's Convex ID
 * @returns User object or null if not found
 * 
 * @example
 * const profile = await api.users.getUserProfile({ userId: "abc123..." });
 */
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

/**
 * UPDATE USER POINTS (INTERNAL UTILITY)
 * 
 * Internal mutation to update a user's gamification points
 * This is called by other mutations when point-earning activities occur
 * 
 * @param userId - The user's ID
 * @param pointsToAdd - Number of points to add
 * 
 * @internal
 */
export const updateUserPoints = mutation({
  args: {
    userId: v.id("users"),
    pointsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Add points to user's current total
    const newPoints = user.points + args.pointsToAdd;

    await ctx.db.patch(args.userId, {
      points: newPoints,
    });

    return newPoints;
  },
});

/**
 * GET ALL USERS
 * 
 * Retrieves all users in the system (useful for admin/leaderboard features)
 * 
 * @returns Array of all users, sorted by points (descending)
 * 
 * @example
 * const leaderboard = await api.users.getAllUsers();
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Sort by points in descending order for leaderboard
    return users.sort((a, b) => b.points - a.points);
  },
});

/**
 * UPDATE USER PROFILE
 * 
 * Updates user profile information (name, faculty)
 * Points cannot be updated directly through this mutation
 * 
 * @param userId - The user's ID
 * @param name - Optional new name
 * @param faculty - Optional new faculty
 * 
 * @example
 * await api.users.updateUserProfile({
 *   userId: "abc123...",
 *   name: "Jane Doe",
 *   faculty: "Engineering"
 * });
 */
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    faculty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Build update object with only provided fields
    const updates: {
      name?: string;
      faculty?: string;
    } = {};

    if (args.name) {
      updates.name = args.name;
    }

    if (args.faculty) {
      updates.faculty = args.faculty;
    }

    await ctx.db.patch(args.userId, updates);

    return { success: true };
  },
});

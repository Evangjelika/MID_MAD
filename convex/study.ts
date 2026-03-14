import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * STUDY FOCUS TIMER SESSIONS
 * 
 * Tracks completed study/focus timer sessions
 * Integrates with points system to reward focused study time
 */

/**
 * COMPLETE STUDY SESSION
 * 
 * Records a completed study session
 * Awards +5 points for each completed session
 * 
 * @param userId - The user who completed the study session
 * @param durationMinutes - Duration of the study session in minutes
 * @returns ID of the newly created study session record
 * 
 * @example
 * const sessionId = await api.study.completeStudySession({
 *   userId: "abc123...",
 *   durationMinutes: 25
 * });
 */
export const completeStudySession = mutation({
  args: {
    userId: v.id("users"),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate duration is positive
    if (args.durationMinutes <= 0) {
      throw new Error("Duration must be greater than 0 minutes");
    }

    // Create study session record
    const sessionId = await ctx.db.insert("studySessions", {
      userId: args.userId,
      durationMinutes: args.durationMinutes,
      completedAt: Date.now(),
    });

    // Award points for completing a study session (+5 points)
    const newPoints = user.points + 5;
    await ctx.db.patch(args.userId, {
      points: newPoints,
    });

    return sessionId;
  },
});

/**
 * GET USER STUDY SESSIONS
 * 
 * Retrieves all study sessions for a specific user
 * 
 * @param userId - The user's ID
 * @returns Array of study sessions, sorted by most recent first
 * 
 * @example
 * const sessions = await api.study.getUserStudySessions({
 *   userId: "abc123..."
 * });
 */
export const getUserStudySessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all study sessions for this user
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by most recent first
    return sessions.sort((a, b) => b.completedAt - a.completedAt);
  },
});

/**
 * GET STUDY STATISTICS
 * 
 * Calculates study statistics for a user
 * Returns total sessions, total minutes, and average session duration
 * 
 * @param userId - The user's ID
 * @returns Object with study statistics
 * 
 * @example
 * const stats = await api.study.getStudyStatistics({ userId: "abc123..." });
 * // Returns: { totalSessions: 10, totalMinutes: 250, averageDuration: 25 }
 */
export const getStudyStatistics = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all study sessions for this user
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Calculate statistics
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0
    );
    const averageDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    return {
      totalSessions,
      totalMinutes,
      averageDuration: Math.round(averageDuration * 10) / 10, // Round to 1 decimal place
    };
  },
});

/**
 * GET RECENT STUDY SESSIONS
 * 
 * Retrieves study sessions from the last N days
 * 
 * @param userId - The user's ID
 * @param days - Number of days to look back (default: 7)
 * @returns Array of recent study sessions
 * 
 * @example
 * const recentSessions = await api.study.getRecentStudySessions({
 *   userId: "abc123...",
 *   days: 7
 * });
 */
export const getRecentStudySessions = query({
  args: {
    userId: v.id("users"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const daysToLookBack = args.days ?? 7;
    const cutoffTime = Date.now() - daysToLookBack * 24 * 60 * 60 * 1000;

    // Get all study sessions for this user
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for recent sessions
    const recentSessions = sessions.filter(
      (session) => session.completedAt >= cutoffTime
    );

    // Sort by most recent first
    return recentSessions.sort((a, b) => b.completedAt - a.completedAt);
  },
});

/**
 * GET TODAY'S STUDY TIME
 * 
 * Calculates total study time for today
 * 
 * @param userId - The user's ID
 * @returns Object with today's study statistics
 * 
 * @example
 * const todayStats = await api.study.getTodayStudyTime({ userId: "abc123..." });
 * // Returns: { sessions: 3, totalMinutes: 75 }
 */
export const getTodayStudyTime = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Calculate start of today (midnight)
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    // Get all study sessions for this user
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for today's sessions
    const todaySessions = sessions.filter(
      (session) => session.completedAt >= startOfToday
    );

    // Calculate total minutes
    const totalMinutes = todaySessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0
    );

    return {
      sessions: todaySessions.length,
      totalMinutes,
    };
  },
});

/**
 * GET STUDY SESSIONS BY DATE RANGE
 * 
 * Retrieves study sessions within a specific date range
 * 
 * @param userId - The user's ID
 * @param startDate - Start date timestamp
 * @param endDate - End date timestamp
 * @returns Array of study sessions within the date range
 * 
 * @example
 * const sessions = await api.study.getStudySessionsByDateRange({
 *   userId: "abc123...",
 *   startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
 *   endDate: Date.now()
 * });
 */
export const getStudySessionsByDateRange = query({
  args: {
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Get all study sessions for this user
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter for sessions within date range
    const filteredSessions = sessions.filter(
      (session) =>
        session.completedAt >= args.startDate &&
        session.completedAt <= args.endDate
    );

    // Sort by most recent first
    return filteredSessions.sort((a, b) => b.completedAt - a.completedAt);
  },
});

/**
 * GET WEEKLY STUDY SUMMARY
 * 
 * Provides a weekly summary of study activity
 * Groups sessions by day of the week
 * 
 * @param userId - The user's ID
 * @returns Array of daily summaries for the past 7 days
 * 
 * @example
 * const weeklySummary = await api.study.getWeeklyStudySummary({
 *   userId: "abc123..."
 * });
 */
export const getWeeklyStudySummary = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get recent sessions
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const recentSessions = sessions.filter(
      (session) => session.completedAt >= sevenDaysAgo
    );

    // Group by day
    const dailySummary: Record<
      string,
      { date: string; sessions: number; totalMinutes: number }
    > = {};

    recentSessions.forEach((session) => {
      const date = new Date(session.completedAt).toLocaleDateString();

      if (!dailySummary[date]) {
        dailySummary[date] = {
          date,
          sessions: 0,
          totalMinutes: 0,
        };
      }

      dailySummary[date].sessions++;
      dailySummary[date].totalMinutes += session.durationMinutes;
    });

    // Convert to array and sort by date
    return Object.values(dailySummary).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
});

/**
 * DELETE STUDY SESSION
 * 
 * Removes a study session record
 * Use with caution - this doesn't refund points
 * 
 * @param sessionId - The study session ID
 * 
 * @example
 * await api.study.deleteStudySession({ sessionId: "xyz789..." });
 */
export const deleteStudySession = mutation({
  args: {
    sessionId: v.id("studySessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      throw new Error("Study session not found");
    }

    // Delete the session record
    await ctx.db.delete(args.sessionId);

    return { success: true };
  },
});

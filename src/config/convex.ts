/**
 * Convex Client Configuration
 * 
 * This file sets up the Convex client for React Native
 */

import { ConvexReactClient } from "convex/react";

// Convex deployment URL - automatically set by `npx convex dev`
// The URL is stored in .env.local file
const CONVEX_URL = "https://calculating-squid-206.convex.cloud";

// Create and export the Convex client
export const convex = new ConvexReactClient(CONVEX_URL);

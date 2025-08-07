// src/app/api/genkit/[[...slug]]/route.ts

'use server';

/**
 * @fileoverview This file creates a Next.js API route to handle Genkit AI flows.
 * It imports the necessary Genkit flows and exposes them via the createNextHandler.
 * This is required for deploying to environments like Vercel.
 */

// 1. This is the correct import for the Next.js App Router.
import { createNextHandler } from '@genkit-ai/next';

// 2. These imports load your defined flows so Genkit can serve them.
import '@/ai/flows/generate-ai-responses';
import '@/ai/flows/interpret-images';

/* 
 * Your note is correct: The dotenv/config call is not needed on Vercel.
 * Vercel automatically injects environment variables from your project's settings.
 */

// 3. createNextHandler() returns a single handler function.
const handler = createNextHandler();

// 4. Export the handler for both GET and POST requests, as required by the App Router.
export { handler as GET, handler as POST };

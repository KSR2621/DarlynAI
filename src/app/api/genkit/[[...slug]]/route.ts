// src/app/api/genkit/[[...slug]]/route.ts

'use server';

/**
 * @fileoverview This file creates a Next.js API route to handle Genkit AI flows.
 * It imports the necessary Genkit flows and exposes them via the genkitNextHandler.
 * This is required for deploying to environments like Vercel.
 */

// 1. Corrected the import from 'createNextApiHandler' to 'genkitNextHandler'
import { genkitNextHandler } from '@genkit-ai/next';

// These imports are correct and should remain
import '@/ai/flows/generate-ai-responses';
import '@/ai/flows/interpret-images';

/* 
 * NOTE: The dotenv/config call is generally not needed on Vercel.
 * Vercel automatically injects environment variables from your project's settings.
 * You can likely remove the dotenv import and config() call.
 */
// import { config } from 'dotenv';
// config();

// 2. Corrected the usage to the new pattern for the App Router
export const { GET, POST } = genkitNextHandler();

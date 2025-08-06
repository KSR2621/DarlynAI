'use server';

/**
 * @fileoverview This file creates a Next.js API route to handle Genkit AI flows.
 * It imports the necessary Genkit flows and exposes them via the createNextApiHandler.
 * This is required for deploying to environments like Vercel.
 */

import {createNextApiHandler} from '@genkit-ai/next';
import '@/ai/flows/generate-ai-responses';
import '@/ai/flows/interpret-images';
import {config} from 'dotenv';

config();

export const GET = createNextApiHandler();
export const POST = createNextApiHandler();

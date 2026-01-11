/**
 * Mock Data Generators using Faker.js
 *
 * This module provides comprehensive mock data generators for all API types
 * based on the API schema defined in lib/api/types.ts
 *
 * Usage:
 *   import { generateProgramListItemResponse, generateMany } from '@/lib/mock';
 *
 *   const program = generateProgramListItemResponse();
 *   const programs = generateMany(generateProgramListItemResponse, 10);
 */

// Re-export all generators
export * from "./fakerGenerators";

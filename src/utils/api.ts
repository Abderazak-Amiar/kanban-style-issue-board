import issues from '../data/issues.json';
import type { Issue } from '../types';

// Simulate a network delay (e.g., 1 second)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Optional: randomly throw an error to simulate network failures
function maybeThrowError() {
  const shouldThrow = Math.random() < 0.2; // 20% chance
  if (shouldThrow) {
    throw new Error('Simulated network error');
  }
}

// Mock API
export async function fetchIssues() {
  await delay(1000); // simulate delay
  maybeThrowError(); // simulate error randomly
  return issues;
}

// Simulate saving status with ~500ms latency and random failure
export async function saveIssueStatus(id: number, status: Issue['status']) {
  await delay(500);
  console.log(`Saving issue ${id} with status: ${status}`);
  maybeThrowError(); // reuse 20% failure simulation
}

export async function saveIssuePriority(id: number, priority: string) {
  await delay(500);
  maybeThrowError(); // simulate random failure like fetchIssues
  console.log(`Saving issue ${id} priority: ${priority}`);
}

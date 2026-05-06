/**
 * Route prefetcher utility
 * Prefetches routes for instant navigation using expo-router
 */
import { router } from 'expo-router';

/**
 * Prefetch a single route — silent fail if not supported
 */
export async function prefetchRoute(route: string): Promise<void> {
  try {
    // expo-router doesn't expose a public prefetch API yet
    // This is a no-op placeholder that keeps the interface intact
    // When expo-router adds prefetching, implement it here
    void route;
  } catch {
    // Silent fail — prefetching is an optimization, not a requirement
  }
}

/**
 * Prefetch multiple routes in parallel
 */
export async function prefetchRoutes(routes: string[]): Promise<void> {
  await Promise.allSettled(routes.map(prefetchRoute));
}

import { vi } from 'vitest';

/**
 * Creates a chainable mock that mimics Supabase's query builder pattern.
 * Every method returns `this` (chainable) except the terminal one which resolves the result.
 *
 * Usage:
 *   mockFrom(supabase, { data: [...], error: null });
 *   await someService.getAll(); // resolves with the provided result
 */
export function createQueryChain(result: {
  data?: unknown;
  error?: { message: string; code?: string } | null;
  count?: number | null;
}) {
  const chain: Record<string, unknown> = {};

  const self = () => chain;

  // All chainable methods
  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'in', 'not', 'is',
    'gte', 'lte', 'gt', 'lt',
    'order', 'limit', 'range',
    'single', 'maybeSingle',
  ];

  for (const method of methods) {
    chain[method] = vi.fn(self);
  }

  // Make the chain thenable so `await` resolves to the result
  chain.then = (resolve: (v: unknown) => void) => resolve(result);

  return chain;
}

/**
 * Sets up `supabase.from()` to return a chainable mock with the given result.
 */
export function mockFrom(
  supabase: { from: ReturnType<typeof vi.fn> },
  result: {
    data?: unknown;
    error?: { message: string; code?: string } | null;
    count?: number | null;
  }
) {
  const chain = createQueryChain(result);
  vi.mocked(supabase.from).mockReturnValue(chain as never);
  return chain;
}

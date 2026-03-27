import { LoadingSpinner } from './LoadingSpinner';

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <LoadingSpinner size="lg" />
    </div>
  );
}

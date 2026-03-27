interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-zinc-700 border-t-amber-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Cargando..."
    />
  );
}

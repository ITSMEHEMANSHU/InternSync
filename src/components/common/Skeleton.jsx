const shimmer = 'animate-pulse bg-surface-container-high rounded';

const SkeletonCard = () => (
  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-3">
    <div className={`h-4 w-1/2 ${shimmer}`} />
    <div className={`h-8 w-1/3 ${shimmer}`} />
    <div className={`h-3 w-2/3 ${shimmer}`} />
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm">
    <div className={`w-10 h-10 rounded-full ${shimmer}`} />
    <div className="flex-1 flex flex-col gap-2">
      <div className={`h-4 w-1/3 ${shimmer}`} />
      <div className={`h-3 w-1/2 ${shimmer}`} />
    </div>
    <div className={`h-6 w-16 rounded-full ${shimmer}`} />
  </div>
);

const SkeletonTable = ({ rows = 4 }) => (
  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
    <div className={`h-10 w-full ${shimmer} rounded-none`} />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 px-4 py-3 border-b border-outline-variant/20">
        {[1, 2, 3, 4].map((j) => <div key={j} className={`h-4 flex-1 ${shimmer}`} />)}
      </div>
    ))}
  </div>
);

const Skeleton = ({ variant = 'card', rows = 4, count = 1 }) => {
  if (variant === 'table') return <SkeletonTable rows={rows} />;
  if (variant === 'row') return <div className="flex flex-col gap-3">{Array.from({ length: count }).map((_, i) => <SkeletonRow key={i} />)}</div>;
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">{Array.from({ length: count || 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
};

export default Skeleton;

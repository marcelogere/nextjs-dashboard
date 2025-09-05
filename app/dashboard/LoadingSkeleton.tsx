// app/dashboard/LoadingSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingSkeleton() {
  return (
    <div>
      <Skeleton height={32} width={200} />
      <Skeleton count={3} />
    </div>
  );
}
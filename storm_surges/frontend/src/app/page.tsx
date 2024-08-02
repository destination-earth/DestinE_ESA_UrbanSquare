// src/app/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicMap = dynamic(() => import('./components/Map'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicMap />
    </Suspense>
  );
}

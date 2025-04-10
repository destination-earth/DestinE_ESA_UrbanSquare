"use client";

import dynamic from 'next/dynamic';

// Import the Map component with ssr: false
const MapWithNoSSR = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )
});

export default function ClientSideMapWrapper() {
  return <MapWithNoSSR />;
}
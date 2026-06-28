import { Suspense } from 'react';
import OrderStatusClient from './OrderStatusClient';

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading status...</div>}>
      <OrderStatusClient />
    </Suspense>
  );
}

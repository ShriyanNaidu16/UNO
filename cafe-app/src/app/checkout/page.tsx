import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { OAuthCallbackHandler } from './OAuthCallbackHandler';

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackHandler />
    </Suspense>
  );
}
// hooks/useLoadingLink.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useLoadingLink = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navigateWithLoading = (href: string) => {
    setLoading(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      router.push(href);
      // Reset loading after navigation
      setTimeout(() => setLoading(false), 300);
    }, 150);
  };

  return { loading, navigateWithLoading };
};
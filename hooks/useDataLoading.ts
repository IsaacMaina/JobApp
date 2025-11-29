// hooks/useDataLoading.ts
import { useState, useEffect } from 'react';

interface DataLoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useDataLoading = (): DataLoadingState => {
  const [loading, setLoading] = useState<boolean>(true);

  return { loading, setLoading };
};
import { useState, useEffect } from 'react';

export function useAsyncSimulation<T>(
  fetchFn: () => Promise<T> | T,
  dependencies: any[] = [],
  delay = 900
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const res = await fetchFn();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const execute = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, delay));
        const res = await fetchFn();
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, isLoading, error, setData, refetch };
}

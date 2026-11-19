"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncData<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  /** Refetch and show the loading state again. For user-triggered refreshes. */
  refresh: () => Promise<void>;
  /** Refetch without touching the loading state. For background polling. */
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
}

/**
 * Fetch once on mount, then on demand.
 *
 * Responses are ticketed so a slow earlier request cannot overwrite a newer
 * one: without that, a refresh issued while the mount fetch is still in flight
 * can be clobbered by the stale result and show the wrong state until the user
 * asks again.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, errorMessage: string): AsyncData<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const latest = useRef(0);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const reload = useCallback(async () => {
    const ticket = ++latest.current;
    try {
      const result = await fetcherRef.current();
      if (ticket !== latest.current) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (ticket !== latest.current) return;
      setError(err instanceof Error ? err.message : errorMessage);
    } finally {
      if (ticket === latest.current) setLoading(false);
    }
  }, [errorMessage]);

  const refresh = useCallback(async () => {
    setLoading(true);
    // Drop any previous failure now rather than on success, so the UI never
    // shows a stale error next to an in-progress indicator.
    setError(null);
    await reload();
  }, [reload]);

  useEffect(() => {
    // Wrapped so the effect does not set state synchronously
    // (react-hooks/set-state-in-effect).
    void (async () => {
      await reload();
    })();
    return () => {
      // Abandon anything still in flight when this unmounts.
      latest.current += 1;
    };
  }, [reload]);

  return { data, error, loading, refresh, reload, setError };
}

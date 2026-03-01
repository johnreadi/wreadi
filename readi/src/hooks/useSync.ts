"use client";

import { useState, useEffect, useCallback } from "react";
import { IS_PRODUCTION } from "@/lib/storage";

interface SyncData {
  categories: any[];
  services: any[];
  products: any[];
  cableTypes: any[];
  cableConnectors: any[];
  testimonials: any[];
  pageContents: any[];
}

interface UseSyncReturn {
  data: SyncData | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  sync: () => Promise<void>;
}

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = "readi_sync_data";
const TIMESTAMP_KEY = "readi_sync_timestamp";

export function useSync(): UseSyncReturn {
  const [data, setData] = useState<SyncData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Utiliser la détection robuste de production
  const isProduction = IS_PRODUCTION;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/sync");
      if (!response.ok) {
        throw new Error("Failed to sync data");
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setLastSync(result.timestamp);

        // En développement uniquement : stocker dans localStorage comme cache
        if (!isProduction) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
          localStorage.setItem(TIMESTAMP_KEY, result.timestamp);
        }
      } else {
        throw new Error(result.error || "Sync failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      
      // En développement : utiliser le cache local en cas d'erreur
      if (!isProduction) {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setData(JSON.parse(cached));
          setLastSync(localStorage.getItem(TIMESTAMP_KEY));
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isProduction]);

  useEffect(() => {
    // En développement : charger le cache initial si disponible
    if (!isProduction) {
      const cached = localStorage.getItem(STORAGE_KEY);
      const cachedTime = localStorage.getItem(TIMESTAMP_KEY);
      if (cached) {
        setData(JSON.parse(cached));
        setLastSync(cachedTime);
      }
    }

    // Premier sync
    fetchData();

    // Sync périodique
    const interval = setInterval(fetchData, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData, isProduction]);

  return {
    data,
    isLoading,
    error,
    lastSync,
    sync: fetchData,
  };
}

"use client";

import { api } from "@/lib/api";
import type { HealthStatus } from "@/lib/api";
import { useAsyncData } from "@/hooks/use-async-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StatusPage() {
  const {
    data: health,
    error,
    loading,
    refresh,
  } = useAsyncData<HealthStatus>(() => api.health(), "Failed to reach API");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Status</h1>
        <p className="text-muted-foreground mt-2">
          Check the health of connected services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Service
            {loading ? (
              <Badge variant="secondary">Checking...</Badge>
            ) : health?.status === "ok" ? (
              <Badge variant="default">Healthy</Badge>
            ) : (
              <Badge variant="destructive">Unreachable</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : health ? (
            <p className="text-sm text-muted-foreground">
              API is responding normally.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Checking connection...</p>
          )}
          <Button variant="outline" size="sm" className="mt-4" onClick={refresh}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

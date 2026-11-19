"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Record, RecordListResponse } from "@/lib/api";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecordForm } from "./record-form";

const statusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default" as const;
    case "processing":
      return "secondary" as const;
    case "pending":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

export function RecordList() {
  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<Record | null>(null);

  const {
    data: list,
    error,
    loading,
    refresh,
    reload,
    setError,
  } = useAsyncData<RecordListResponse>(() => api.records.list(), "Failed to fetch records");

  const records = list?.items ?? [];
  const total = list?.total ?? 0;

  // Poll every 3s while any record is still pending or processing
  const hasPending = records.some((r) => r.status === "pending" || r.status === "processing");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hasPending) {
      // reload, not refresh: a background poll must not flash the loading state.
      pollRef.current = setInterval(() => {
        void reload();
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [hasPending, reload]);

  const handleCreate = async (data: Parameters<typeof api.records.create>[0]) => {
    try {
      await api.records.create(data);
      setShowCreate(false);
      void refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    }
  };

  const handleUpdate = async (data: Parameters<typeof api.records.update>[1]) => {
    if (!editRecord) return;
    try {
      await api.records.update(editRecord.id, data);
      setEditRecord(null);
      void refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update record");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.records.delete(id);
      void refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete record");
    }
  };

  if (loading && records.length === 0) {
    return <p className="text-muted-foreground">Loading records...</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} record(s)</p>
        <Button onClick={() => setShowCreate(true)}>Create Record</Button>
      </div>

      {records.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No records yet. Create one to get started.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {record.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(record.status)}>{record.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(record.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditRecord(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Record</DialogTitle>
          </DialogHeader>
          <RecordForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRecord} onOpenChange={() => setEditRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          {editRecord && (
            <RecordForm
              record={editRecord}
              onSubmit={handleUpdate}
              onCancel={() => setEditRecord(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

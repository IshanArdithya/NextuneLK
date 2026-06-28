"use client";

import React, { useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inboundId: number | null;
  client: any | null;
}

export default function DeleteClientDialog({
  open,
  onClose,
  onSuccess,
  inboundId,
  client,
}: DeleteClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!inboundId || !client) return;

    setLoading(true);
    try {
      await api.post("/admin/client/delete", {
        inboundId: inboundId.toString(),
        clientId: client.id,
        email: client.email,
      });

      toast({
        title: "Client Deleted",
        description: `${client.email} has been removed.`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : "Failed to delete client";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader className="flex flex-col items-center">
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Client?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="pt-2 text-center space-y-2">
              <p>
                Are you sure you want to delete client <strong>{client?.email}</strong>?
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed text-left w-full">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold truncate ml-2 text-foreground">{client?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inbound ID:</span>
                  <span className="font-semibold text-foreground">#{inboundId}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-dashed border-border/40 mt-1.5">
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-bold text-orange-600">
                    {client?.traffic?.totalUsedFormatted || "0 B"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-destructive/80 font-medium pt-1">
                This will permanently remove the VPN access. This action cannot be undone.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={loading} className="rounded-md">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading || countdown > 0}
            className="bg-destructive text-white hover:bg-destructive/90 min-w-[140px] transition-all rounded-md"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              `Confirm (${countdown}s)`
            ) : (
              "Confirm Deletion"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

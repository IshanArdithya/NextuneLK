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
import { Loader2 } from "lucide-react";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{client?.email}</strong> from
            the VPN panel. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={loading} className="w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading || countdown > 0}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto min-w-[100px]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : countdown > 0 ? (
              <span>Delete ({countdown}s)</span>
            ) : (
              <>
                <span className="sm:hidden">Delete</span>
                <span className="hidden sm:inline">Delete Client</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { CustomerSearch } from "./customer-search";
import { Loader2, Link as LinkIcon, User, Unlink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LinkCustomerModalProps {
  open: boolean;
  client: { id: string, xuiId?: string, email: string, inboundId: number, customerName?: string, customerEmail?: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LinkCustomerModal({
  open,
  client,
  onClose,
  onSuccess,
}: LinkCustomerModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<{ id?: string, name?: string | null, email?: string | null } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { toast } = useToast();

  React.useEffect(() => {
    if (unlinkConfirmOpen) {
      setCountdown(3);
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
  }, [unlinkConfirmOpen]);

  const handleLink = async () => {
    if (!client || (!selectedCustomer && !isNew)) return;

    setLoading(true);
    try {
      // If new, we need to create the customer first OR use a specific link-create endpoint
      // But standard linkCustomer API expects an email.
      // Let's use the email from the search or existing record.

      // Support both existing name-only customers and new customers
      const identity = selectedCustomer?.email || selectedCustomer?.name;

      if (!identity) {
        toast({ title: "Error", description: "No customer selected", variant: "destructive" });
        setLoading(false);
        return;
      }

      const payload = {
        xuiId: client.xuiId || client.id,
        inboundId: client.inboundId, // Pass the inboundId for precise lookup
        email: identity
      };

      await api.post(`/admin/client/link`, payload);

      toast({
        title: "Success",
        description: `Linked ${client.email} to ${selectedCustomer?.name || identity}`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to link customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!client) return;
    setLoading(true);
    try {
      await api.post(`/admin/client/unlink`, {
        xuiId: client.xuiId || client.id,
        inboundId: client.inboundId
      });

      toast({
        title: "Success",
        description: `Unlinked ${client.email} from customer`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to unlink customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-orange-500" />
            Link to Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-border/60 text-[13px] space-y-1">
            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Client Info</p>
            <p className="font-semibold text-foreground">{client?.email}</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Search Customer</Label>
            <CustomerSearch
              onSelect={(customer, isNewCust, name) => {
                if (isNewCust) {
                  setSelectedCustomer({ name });
                  setIsNew(true);
                } else {
                  setSelectedCustomer(customer);
                  setIsNew(false);
                }
              }}
              placeholder="Start typing name or email..."
            />
            {(client?.customerEmail || client?.customerName) && (
              <div className="flex items-center justify-between gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <p className="text-[10px] text-amber-600 font-medium leading-tight flex-1 ml-1">
                  Currently linked to <span className="font-bold underline">{client.customerName || client.customerEmail}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 font-bold uppercase tracking-tight"
                  onClick={() => setUnlinkConfirmOpen(true)}
                  disabled={loading}
                >
                  Unlink
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-9">
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={loading || (!selectedCustomer && !isNew)}
            className="w-full sm:w-auto h-9 bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Link
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={unlinkConfirmOpen} onOpenChange={setUnlinkConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-destructive text-center">
              <Unlink className="h-5 w-5" />
              Unlink Customer?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2 w-full">
                <p>
                  Are you sure you want to unlink this client?
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed border-border/40 text-left w-full">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-semibold text-foreground truncate ml-2">{client?.email}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-border/40 mt-1.5">
                    <span className="text-muted-foreground">Current Customer:</span>
                    <span className="font-medium text-foreground truncate ml-2">{client?.customerName || client?.customerEmail}</span>
                  </div>
                </div>
                <p className="text-xs text-destructive/80 font-medium pt-1">
                  The client service will remain active but will no longer be linked.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleUnlink();
                setUnlinkConfirmOpen(false);
              }}
              disabled={loading || countdown > 0}
              className="bg-destructive text-white hover:bg-destructive/90 min-w-[140px] transition-all rounded-md"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                `Unlink (${countdown}s)`
              ) : (
                "Confirm Unlink"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

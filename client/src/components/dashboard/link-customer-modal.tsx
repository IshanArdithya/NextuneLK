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
import { CustomerSearch } from "./customer-search";
import { Loader2, Link as LinkIcon, User } from "lucide-react";
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
  const [selectedCustomer, setSelectedCustomer] = useState<{id?: string, name?: string | null, email?: string | null} | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
          <div className="bg-muted/30 p-3 rounded-lg border border-dashed text-xs space-y-1">
            <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Client Info</p>
            <p className="font-medium">{client?.email}</p>
          </div>

          <div className="space-y-2">
            <Label>Search Customer</Label>
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
              <p className="text-[10px] text-amber-600 font-medium bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                Note: This client is currently linked to {client.customerName || client.customerEmail}. Linking a new customer will replace it.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {(client?.customerEmail || client?.customerName) && (
            <Button 
              variant="ghost" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs px-2 h-8"
              onClick={handleUnlink}
              disabled={loading}
            >
              Unlink Current
            </Button>
          )}
          <div className="flex-1" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button onClick={handleLink} disabled={loading || (!selectedCustomer && !isNew)} size="sm">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

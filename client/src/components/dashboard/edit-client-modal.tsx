"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inboundId: number | null;
  client: any | null;
}

export default function EditClientModal({
  open,
  onClose,
  onSuccess,
  inboundId,
  client,
}: EditClientModalProps) {
  const [email, setEmail] = useState("");
  const [totalGB, setTotalGB] = useState("");
  const [limitIp, setLimitIp] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setEmail(client.email || "");
      setTotalGB((client.total / (1024 * 1024 * 1024)).toFixed(2));
      setLimitIp(client.limitIp?.toString() || "0");
      
      if (client.expiryTime > 0) {
        const d = new Date(client.expiryTime);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60 * 1000);
        setExpiryDate(local.toISOString().slice(0, 16));
      } else {
        setExpiryDate("");
      }
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundId || !client) return;

    setLoading(true);
    try {
      const submitData = {
        inboundId: inboundId.toString(),
        clientId: client.id,
        email,
        totalGB: parseFloat(totalGB) || 0,
        limitIp: parseInt(limitIp) || 0,
        expiryTime: expiryDate ? new Date(expiryDate).getTime() : 0,
      };

      await api.put("/dashboard/client/update", submitData);

      toast({
        title: "Client Updated",
        description: `${email} has been updated successfully.`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : "Failed to update client";
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-totalGB">Total GB (0 = ∞)</Label>
              <Input
                id="edit-totalGB"
                type="number"
                step="0.01"
                value={totalGB}
                onChange={(e) => setTotalGB(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-limitIp">IP Limit (0 = ∞)</Label>
              <Input
                id="edit-limitIp"
                type="number"
                value={limitIp}
                onChange={(e) => setLimitIp(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="edit-expiryDate"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

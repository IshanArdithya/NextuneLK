"use client";

import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inboundId: number | null;
  protocol: string;
}

export default function AddClientModal({
  open,
  onClose,
  onSuccess,
  inboundId,
  protocol,
}: AddClientModalProps) {
  const [email, setEmail] = useState("");
  const [totalGB, setTotalGB] = useState("");
  const [limitIp, setLimitIp] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundId) return;

    setLoading(true);
    try {
      const submitData = {
        inboundId: inboundId.toString(),
        email,
        totalGB: parseFloat(totalGB) || 0,
        limitIp: parseInt(limitIp) || 0,
        expiryTime: expiryDate ? new Date(expiryDate).getTime() : 0,
        amountPaid: parseFloat(amountPaid) || 0,
        paymentStatus: paid ? "PAID" : "UNPAID",
      };

      await api.post("/dashboard/client/add", submitData);

      toast({
        title: "Client Added",
        description: `${email} has been added successfully.`,
      });
      onSuccess();
      onClose();
      // Reset form
      setEmail("");
      setTotalGB("");
      setLimitIp("");
      setExpiryDate("");
      setAmountPaid("");
      setPaid(false);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : "Failed to add client";
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
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalGB">Total GB (0 = ∞)</Label>
              <Input
                id="totalGB"
                type="number"
                value={totalGB}
                onChange={(e) => setTotalGB(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limitIp">IP Limit (0 = ∞)</Label>
              <Input
                id="limitIp"
                type="number"
                value={limitIp}
                onChange={(e) => setLimitIp(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid (LKR)</Label>
              <Input
                id="amountPaid"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="paid-status">Mark as Paid</Label>
              <Switch
                id="paid-status"
                checked={paid}
                onCheckedChange={setPaid}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Link2, Unlink, Link as LinkIcon } from "lucide-react";

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
  const [xuiEmail, setXuiEmail] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [totalGB, setTotalGB] = useState("");
  const [limitIp, setLimitIp] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [flow, setFlow] = useState("");
  const [comment, setComment] = useState("");
  const [startAfterFirstUse, setStartAfterFirstUse] = useState(false);
  const [durationDays, setDurationDays] = useState("");
  const [subId, setSubId] = useState("");
  const [tgId, setTgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setXuiEmail(client.email || "");
      setTotalGB((client.totalGB / (1024 * 1024 * 1024)).toFixed(2));
      setLimitIp(client.limitIp?.toString() || "0");
      setFlow(client.flow || "none");
      setComment(client.comment || "");
      setSubId(client.subId || "");
      setTgId(client.tgId || "");
      setReset(client.reset || 0);
      
      if (client.expiryTime < 0) {
        setStartAfterFirstUse(true);
        setDurationDays(Math.abs(Math.floor(client.expiryTime / (24 * 60 * 60 * 1000))).toString());
        setExpiryDate("");
      } else if (client.expiryTime > 0) {
        setStartAfterFirstUse(false);
        setDurationDays("");
        const d = new Date(client.expiryTime);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60 * 1000);
        setExpiryDate(local.toISOString().slice(0, 16));
      } else {
        setStartAfterFirstUse(false);
        setDurationDays("");
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
        xuiEmail,
        totalGB: parseFloat(totalGB) || 0,
        limitIp: parseInt(limitIp) || 0,
        expiryTime: !startAfterFirstUse && expiryDate ? new Date(expiryDate).getTime() : 0,
        startAfterFirstUse,
        startAfterFirstUseDays: startAfterFirstUse ? parseInt(durationDays) || 0 : 0,
        flow: flow === "none" ? "" : flow,
        comment,
        subId,
        tgId: parseInt(tgId) || 0,
        reset,
      };

      await api.put("/admin/client/update", submitData);

      toast({
        title: "Client Updated",
        description: `${xuiEmail} has been updated successfully.`,
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
            <Label htmlFor="edit-xuiEmail">Client Name (XUI Identifier)</Label>
            <Input
              id="edit-xuiEmail"
              value={xuiEmail}
              onChange={(e) => setXuiEmail(e.target.value)}
              placeholder="e.g. John Doe"
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

            <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Start after first use</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Activation starts only when the client first connects
                  </p>
                </div>
                <Switch 
                  checked={startAfterFirstUse} 
                  onCheckedChange={setStartAfterFirstUse} 
                />
              </div>

              {startAfterFirstUse ? (
                <div className="space-y-2 pt-2 border-t border-dashed">
                  <Label htmlFor="edit-durationDays">Duration (Days)</Label>
                  <Input
                    id="edit-durationDays"
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="e.g. 30"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-dashed">
                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                  <Input
                    id="edit-expiryDate"
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-flow">Flow</Label>
                <Select value={flow} onValueChange={setFlow}>
                  <SelectTrigger id="edit-flow">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="xtls-rprx-vision">xtls-rprx-vision</SelectItem>
                    <SelectItem value="xtls-rprx-vision-udp443">xtls-rprx-vision-udp443</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comment">Comment</Label>
                <Input
                  id="edit-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Internal notes"
                />
              </div>
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

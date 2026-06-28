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
import { Loader2, Link2, Unlink, Link as LinkIcon, RefreshCw } from "lucide-react";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { toast } = useToast();

  React.useEffect(() => {
    if (confirmOpen) {
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
  }, [confirmOpen]);

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

  const getChanges = () => {
    if (!client) return [];
    const changes: { label: string; old: string; new: string }[] = [];

    if (xuiEmail !== (client.email || "")) {
      changes.push({ label: "Client Name", old: client.email || "Empty", new: xuiEmail });
    }

    const oldGB = (client.totalGB / (1024 * 1024 * 1024)).toFixed(2);
    if (parseFloat(totalGB).toFixed(2) !== oldGB) {
      changes.push({ label: "Quota", old: `${oldGB} GB`, new: `${totalGB} GB` });
    }

    if (parseInt(limitIp) !== (client.limitIp || 0)) {
      changes.push({ label: "IP Limit", old: (client.limitIp || 0).toString(), new: limitIp });
    }

    if (comment !== (client.comment || "")) {
      changes.push({ label: "Comment", old: client.comment || "None", new: comment || "None" });
    }

    const currentFlow = flow === "none" ? "" : flow;
    const oldFlow = client.flow || "";
    if (currentFlow !== oldFlow) {
      changes.push({ label: "Flow", old: oldFlow || "None", new: currentFlow || "None" });
    }

    return changes;
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    const changes = getChanges();
    if (changes.length === 0) {
      toast({ title: "No Changes", description: "You haven't made any changes to this client." });
      return;
    }
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!inboundId || !client) return;

    setLoading(true);
    try {
      const submitData = {
        inboundId: inboundId.toString(),
        clientId: client.id,
        originalEmail: client.email,
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

        <div className="space-y-4 pt-4 pb-0">
          <div className="space-y-1.5">
            <Label htmlFor="edit-xuiEmail" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Client Name</Label>
            <Input
              id="edit-xuiEmail"
              value={xuiEmail}
              onChange={(e) => setXuiEmail(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 min-w-0">
              <Label htmlFor="edit-totalGB" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Total GB (0 = ∞)</Label>
              <Input
                id="edit-totalGB"
                type="number"
                step="0.01"
                value={totalGB}
                onChange={(e) => setTotalGB(e.target.value)}
                className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
              />
            </div>
            <div className="space-y-1.5 min-w-0">
              <Label htmlFor="edit-limitIp" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">IP Limit (0 = ∞)</Label>
              <Input
                id="edit-limitIp"
                type="number"
                value={limitIp}
                onChange={(e) => setLimitIp(e.target.value)}
                className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-dashed p-4 bg-muted/30 border-border/60">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Start after first use</Label>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Activation starts only when the client first connects
                </p>
              </div>
              <Switch
                checked={startAfterFirstUse}
                onCheckedChange={setStartAfterFirstUse}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>

            {startAfterFirstUse ? (
              <div className="space-y-1.5 pt-3 border-t border-dashed border-border/40">
                <Label htmlFor="edit-durationDays" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Duration (Days)</Label>
                <Input
                  id="edit-durationDays"
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="e.g. 30"
                  className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                />
              </div>
            ) : (
              <div className="space-y-1.5 pt-3 border-t border-dashed border-border/40">
                <Label htmlFor="edit-expiryDate" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 min-w-0">
              <Label htmlFor="edit-flow" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Flow</Label>
              <Select value={flow} onValueChange={setFlow}>
                <SelectTrigger id="edit-flow" className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10 w-full overflow-hidden">
                  <SelectValue placeholder="None" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xtls-rprx-vision">xtls-rprx-vision</SelectItem>
                  <SelectItem value="xtls-rprx-vision-udp443">xtls-rprx-vision-udp443</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 min-w-0">
              <Label htmlFor="edit-comment" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Comment</Label>
              <Input
                id="edit-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Internal notes"
                className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10 w-full"
              />
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-4 sm:flex sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto h-9">
              Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={loading} className="w-full sm:w-auto h-9 bg-orange-500 hover:bg-orange-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <RefreshCw className="h-5 w-5" />
              Confirm Changes?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2 w-full">
                <p>
                  Review your modifications below.
                </p>
                <div className="bg-muted/50 rounded-lg border border-dashed p-3 space-y-2 w-full max-h-[250px] overflow-y-auto">
                  {getChanges().map((change, i) => (
                    <div key={i} className="text-[13px] flex flex-col gap-0.5 border-b border-dashed border-border/40 last:border-0 pb-2 last:pb-0 text-left">
                      <span className="font-bold text-orange-600 uppercase tracking-tighter text-[10px]">{change.label}</span>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span className="line-through opacity-50">{change.old}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold text-foreground">{change.new}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  These changes will be applied to the X-UI panel immediately.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
                setConfirmOpen(false);
              }}
              disabled={loading || countdown > 0}
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px] transition-all rounded-md"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                `Confirm (${countdown}s)`
              ) : (
                "Confirm Changes"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

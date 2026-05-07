"use client";

import React, { useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import { CustomerSearch } from "./customer-search";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Info, Plus, Package } from "lucide-react";
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
  const [xuiEmail, setXuiEmail] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{id?: string, name?: string | null, email?: string | null} | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [totalGB, setTotalGB] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [limitIp, setLimitIp] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("PAID");
  const [flow, setFlow] = useState("");
  const [comment, setComment] = useState("");
  const [startAfterFirstUse, setStartAfterFirstUse] = useState(false);
  const [durationDays, setDurationDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("none_manual");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      api.get("/admin/presets")
        .then((res) => {
          if (res.data.success) {
            setPresets(res.data.obj);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  React.useEffect(() => {
    if (selectedPresetId && selectedPresetId !== "none_manual") {
      const p = presets.find(x => x.id === selectedPresetId);
      if (p) {
        setTotalGB(p.quotaGB.toString());
        setDurationDays(p.days.toString());
        setStartAfterFirstUse(true);
        setAmountPaid(p.amount.toString());
      }
    }
  }, [selectedPresetId, presets]);

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

  const handleClose = () => {
    setXuiEmail("");
    setSelectedCustomer(null);
    setIsNewCustomer(false);
    setTotalGB("");
    setExpiryDate("");
    setLimitIp("");
    setAmountPaid("");
    setFlow("");
    setComment("");
    setStartAfterFirstUse(false);
    setDurationDays("");
    onClose();
  };

  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xuiEmail) {
      toast({ title: "Error", description: "Client Name is required", variant: "destructive" });
      return;
    }
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!inboundId) return;

    setLoading(true);
    try {
      const submitData = {
        inboundId: inboundId.toString(),
        xuiEmail,
        email: selectedCustomer?.email || null,
        customerName: selectedCustomer?.name || null,
        linkAction: isNewCustomer ? "create" : (selectedCustomer ? "link" : "skip"),
        totalGB: parseFloat(totalGB) || 0,
        expiryTime: expiryDate || null,
        limitIp: parseInt(limitIp) || 0,
        amountPaid: parseFloat(amountPaid) || 0,
        paymentStatus,
        flow: flow === "none" ? "" : flow,
        comment,
        startAfterFirstUse,
        startAfterFirstUseDays: parseInt(durationDays) || 0,
        enable: true,
      };

      await api.post("/admin/client/add", submitData);

      toast({
        title: "Client Added",
        description: `${xuiEmail} has been added successfully.`,
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.msg || err.message
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4 pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Customer Link</Label>
              <CustomerSearch 
                onSelect={(customer, isNew, name) => {
                  if (isNew) {
                    setSelectedCustomer({ name });
                    setIsNewCustomer(true);
                  } else {
                    setSelectedCustomer(customer);
                    setIsNewCustomer(false);
                  }
                }}
                placeholder="Search or create customer..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Package className="h-3 w-3 text-orange-500" />
                Select Plan (Preset)
              </Label>
              <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Manual Entry (No Plan)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none_manual">None (Manual Entry)</SelectItem>
                  {presets.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.quotaGB}GB)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xuiEmail" className="text-sm font-semibold">Client Name</Label>
            <Input
              id="xuiEmail"
              value={xuiEmail}
              onChange={(e) => setXuiEmail(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="totalGB" className="text-xs font-semibold">Total GB (0 = ∞)</Label>
              <Input
                id="totalGB"
                type="number"
                step="0.01"
                value={totalGB}
                onChange={(e) => setTotalGB(e.target.value)}
                placeholder="e.g. 100"
                className="h-10 w-full"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <Label htmlFor="limitIp" className="text-xs font-semibold">IP Limit (0 = ∞)</Label>
              <Input
                id="limitIp"
                type="number"
                value={limitIp}
                onChange={(e) => setLimitIp(e.target.value)}
                placeholder="e.g. 2"
                className="h-10 w-full"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-dashed p-4 bg-muted/20">
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
              <div className="space-y-2 pt-3 border-t border-dashed">
                <Label htmlFor="durationDays" className="text-xs font-semibold">Duration (Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="e.g. 30"
                  className="h-10"
                />
              </div>
            ) : (
              <div className="space-y-2 pt-3 border-t border-dashed">
                <Label htmlFor="expiryDate" className="text-xs font-semibold">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-10"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="flow" className="text-xs font-semibold">Flow</Label>
              <Select value={flow} onValueChange={setFlow}>
                <SelectTrigger id="flow" className="h-10 min-h-[40px] py-0 flex items-center w-full overflow-hidden">
                  <SelectValue placeholder="None" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {protocol === "vless" && (
                    <>
                      <SelectItem value="xtls-rprx-vision">xtls-rprx-vision</SelectItem>
                      <SelectItem value="xtls-rprx-vision-udp443">xtls-rprx-vision-udp443</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 min-w-0">
              <Label htmlFor="comment" className="text-xs font-semibold">Comment</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Internal notes"
                className="h-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="amountPaid" className="text-xs font-semibold">Amount Paid (LKR)</Label>
              <Input
                id="amountPaid"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0"
                className="h-10 w-full"
              />
            </div>
            <div className="space-y-2 min-w-0">
              <Label className="text-xs font-semibold">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="h-10 min-h-[40px] py-0 flex items-center w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-4 sm:flex sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="w-full sm:w-auto mt-0">
              Cancel
            </Button>
            <Button onClick={handleAddClick} disabled={loading} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
              Add Client
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-center justify-center">
              <Plus className="h-5 w-5 text-orange-500" />
              Confirm New Client?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <div className="bg-muted/50 rounded-xl border border-dashed p-3 space-y-2 max-h-[300px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Name</span>
                    <span className="font-semibold truncate">{xuiEmail}</span>
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Customer</span>
                    <span className="font-semibold truncate">{selectedCustomer?.name || selectedCustomer?.email || "No Link"}</span>
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Quota</span>
                    <span className="font-semibold">{totalGB ? `${totalGB} GB` : "Unlimited"}</span>
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">IP Limit</span>
                    <span className="font-semibold">{limitIp || "Unlimited"}</span>
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Expiry</span>
                    <span className="font-semibold">
                      {startAfterFirstUse ? `${durationDays} Days (After use)` : (expiryDate ? new Date(expiryDate).toLocaleDateString() : "Unlimited")}
                    </span>
                  </div>
                  <div className="flex flex-col text-[11px]">
                    <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Flow</span>
                    <span className="font-semibold">{flow || "None"}</span>
                  </div>
                </div>

                <div className="text-[11px] border-t border-dashed pt-2 mt-1 flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Comment</span>
                  <p className="font-medium text-foreground/70 italic leading-tight">
                    {comment || "No internal notes"}
                  </p>
                </div>

                <div className="text-[11px] border-t border-dashed pt-2 mt-1 flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Payment Status</span>
                  <span className={`font-bold ${paymentStatus === "PAID" ? "text-emerald-600" : "text-orange-600"}`}>
                    LKR {amountPaid || "0"} ({paymentStatus})
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-center text-muted-foreground pt-1">
                Please review all details before creating this VLESS client.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
                setConfirmOpen(false);
              }}
              disabled={loading || countdown > 0}
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                <span>Add ({countdown}s)</span>
              ) : (
                <span>Confirm Creation</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

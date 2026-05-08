"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, RotateCcw, AlertTriangle, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ClientData } from "./admin-dashboard";
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Preset {
  id: string;
  name: string;
  quotaGB: number;
  days: number;
  amount: number;
  currency: string;
}

interface ResetCycleModalProps {
  open: boolean;
  client: ClientData | null;
  inboundId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResetCycleModal({
  open,
  client,
  inboundId,
  onClose,
  onSuccess,
}: ResetCycleModalProps) {
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [useCustom, setUseCustom] = useState(false);
  const [totalGB, setTotalGB] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [startAfterFirstUse, setStartAfterFirstUse] = useState(false);
  const [durationDays, setDurationDays] = useState("");
  const [paid, setPaid] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
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
    if (open) {
      api
        .get("/admin/presets")
        .then((res) => {
          if (res.data.success) {
            setPresets(res.data.obj);
            if (res.data.obj.length > 0) {
              setSelectedPresetId(res.data.obj[0].id);
              setUseCustom(false);
            } else {
              setUseCustom(true);
            }
          }
        })
        .catch(() => { });

      setPaid(false);
      setTotalGB("");
      setExpiryDate("");
      setStartAfterFirstUse(false);
      setDurationDays("");
      setCustomAmount("");
    }
  }, [open]);

  const selectedPreset = presets.find((p) => p.id === selectedPresetId);

  const handleSubmit = async () => {
    if (!client || !inboundId) return;

    setLoading(true);
    try {
      let submitData: Record<string, unknown>;

      if (!useCustom && selectedPreset) {
        submitData = {
          inboundId,
          clientId: client.id,
          email: client.email,
          totalGB: selectedPreset.quotaGB,
          startAfterFirstUse: true,
          startAfterFirstUseDays: selectedPreset.days,
          paid,
          amountPaid: selectedPreset.amount,
          presetId: selectedPreset.id,
        };
      } else {
        submitData = {
          inboundId,
          clientId: client.id,
          email: client.email,
          totalGB: totalGB ? parseFloat(totalGB) : 0,
          expiryTime: !startAfterFirstUse && expiryDate ? expiryDate : null,
          startAfterFirstUse,
          startAfterFirstUseDays: startAfterFirstUse
            ? parseInt(durationDays) || 0
            : 0,
          paid,
          amountPaid: customAmount ? parseFloat(customAmount) : 0,
        };
      }

      await api.post("/admin/client/reset-cycle", submitData);

      toast({
        title: "Cycle Reset",
        description: `Traffic reset for ${client.email}. ${paid ? "Paid" : "Unpaid"
          } invoice created.`,
      });
      onClose();
      onSuccess();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : "Failed to reset cycle";
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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Reset Cycle
          </DialogTitle>
          <DialogDescription>
            Reset traffic and create a new invoice for this client.
          </DialogDescription>
        </DialogHeader>

        {client && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              <p className="font-medium">
                This marks as a new client/tunnel
              </p>
              <p className="mt-0.5 opacity-80">
                Client:{" "}
                <Badge variant="outline" className="text-[10px] ml-1">
                  {client.email}
                </Badge>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-5 pt-4 pb-0">
          {/* Preset Selection */}
          {presets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Package className="inline h-3 w-3 mr-1" />
                  Preset
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => setUseCustom(!useCustom)}
                >
                  {useCustom ? "Use Preset" : "Custom"}
                </Button>
              </div>

              {!useCustom && (
                <RadioGroup
                  value={selectedPresetId}
                  onValueChange={setSelectedPresetId}
                  className="grid grid-cols-1 gap-2"
                >
                  {presets.map((preset) => (
                    <Label
                      key={preset.id}
                      htmlFor={`preset-${preset.id}`}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${selectedPresetId === preset.id
                          ? "border-orange-500 bg-orange-500/5"
                          : "border-border hover:border-foreground/20"
                        }`}
                    >
                      <RadioGroupItem
                        value={preset.id}
                        id={`preset-${preset.id}`}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {preset.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px]">
                            {preset.quotaGB} GB
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {preset.days}d
                          </Badge>
                          <Badge className="text-[10px] bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30">
                            Rs. {preset.amount}
                          </Badge>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>
          )}

          {(useCustom || presets.length === 0) && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Custom Settings
              </h4>
              <div className="space-y-1.5">
                <Label htmlFor="reset-totalGB" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">New Quota (GB)</Label>
                <Input
                  id="reset-totalGB"
                  type="number"
                  value={totalGB}
                  onChange={(e) => setTotalGB(e.target.value)}
                  placeholder="0 = Unlimited"
                  className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                />
              </div>

              <div className="space-y-3">
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
                    <Label htmlFor="reset-durationDays" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Duration (Days)</Label>
                    <Input
                      id="reset-durationDays"
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      placeholder="e.g. 30"
                      className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-3 border-t border-dashed border-border/40">
                    <Label htmlFor="reset-expiryDate" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">New Expiry Date</Label>
                    <Input
                      id="reset-expiryDate"
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reset-amount" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Amount (LKR)</Label>
                <Input
                  id="reset-amount"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0"
                  className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10"
                />
              </div>
            </div>
          )}

          {/* Paid Toggle */}
          <div className="rounded-xl border border-dashed p-3 flex items-center justify-between bg-muted/30 border-border/60">
            <div>
              <Label className="text-sm font-bold">Mark as Paid</Label>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                Create a paid invoice immediately
              </p>
            </div>
            <Switch 
              checked={paid} 
              onCheckedChange={setPaid} 
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto h-9">
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => setConfirmOpen(true)}
              disabled={loading}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white h-9"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset & Create Invoice
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <RotateCcw className="h-5 w-5" />
              Reset Cycle?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2 w-full">
                <p>
                  Confirm traffic reset for <strong>{client?.email}</strong>.
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed border-border/40 text-left w-full">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Quota:</span>
                    <span className="font-semibold text-foreground">
                      {!useCustom && selectedPreset ? `${selectedPreset.quotaGB} GB` : (totalGB ? `${totalGB} GB` : "Unlimited")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-orange-600">
                      LKR {!useCustom && selectedPreset ? selectedPreset.amount : (customAmount || "0")}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-border/40 mt-1.5">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-black text-[11px] uppercase ${paid ? "text-emerald-600" : "text-orange-600"}`}>
                      {paid ? "Paid (Manual)" : "Unpaid (Invoice)"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  This will reset bandwidth usage and set a new expiry date.
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
                "Confirm Reset"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

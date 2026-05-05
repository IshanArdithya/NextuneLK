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
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                          ? "border-violet-500 bg-violet-500/5"
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
                          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
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
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Custom Settings
              </h4>
              <div>
                <Label htmlFor="reset-totalGB">New Quota (GB)</Label>
                <Input
                  id="reset-totalGB"
                  type="number"
                  value={totalGB}
                  onChange={(e) => setTotalGB(e.target.value)}
                  placeholder="0 = Unlimited"
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Start after first use</Label>
                  <Switch
                    checked={startAfterFirstUse}
                    onCheckedChange={setStartAfterFirstUse}
                  />
                </div>
                {startAfterFirstUse ? (
                  <div>
                    <Label htmlFor="reset-durationDays">Duration (Days)</Label>
                    <Input
                      id="reset-durationDays"
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      placeholder="e.g. 30"
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="reset-expiryDate">New Expiry Date</Label>
                    <Input
                      id="reset-expiryDate"
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="reset-amount">Amount (LKR)</Label>
                <Input
                  id="reset-amount"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Paid Toggle */}
          <div className="rounded-lg border p-3 flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Paid</Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Mark this invoice as already paid
              </p>
            </div>
            <Switch checked={paid} onCheckedChange={setPaid} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset & Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

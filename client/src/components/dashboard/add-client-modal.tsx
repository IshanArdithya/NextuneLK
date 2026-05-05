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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Link as LinkIcon, Info } from "lucide-react";

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
  const [notificationEmail, setNotificationEmail] = useState("");
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
  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);
  const { toast } = useToast();

  const handleClose = () => {
    setXuiEmail("");
    setNotificationEmail("");
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

  const executeSubmit = async (submitData: any) => {
    setLoading(true);
    try {
      await api.post("/admin/client/add", submitData);

      toast({
        title: "Client Added",
        description: `${submitData.xuiEmail} has been added successfully.`,
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
      setShowLinkPrompt(false);
      setShowCreatePrompt(false);
      setPendingSubmitData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboundId) return;

    setLoading(true);
    try {
      const baseData = {
        inboundId: inboundId.toString(),
        xuiEmail,
        email: notificationEmail,
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

      let linkAction = "skip";
      if (notificationEmail) {
        const checkRes = await api.get(`/admin/client/check-email?email=${encodeURIComponent(notificationEmail)}`);
        if (checkRes.data.obj.exists) {
          setPendingSubmitData({ ...baseData, linkAction: "link" });
          setShowLinkPrompt(true);
          setLoading(false);
          return;
        } else {
          setPendingSubmitData({ ...baseData, linkAction: "create" });
          setShowCreatePrompt(true);
          setLoading(false);
          return;
        }
      }

      await executeSubmit({ ...baseData, linkAction });
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.msg || err.message
        : "Failed to verify email";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Customer Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="user@example.com (Optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xuiEmail">Client Name (XUI Identifier)</Label>
              <Input
                id="xuiEmail"
                value={xuiEmail}
                onChange={(e) => setXuiEmail(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalGB">Total GB (0 = ∞)</Label>
                <Input
                  id="totalGB"
                  type="number"
                  step="0.01"
                  value={totalGB}
                  onChange={(e) => setTotalGB(e.target.value)}
                  placeholder="e.g. 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limitIp">IP Limit (0 = ∞)</Label>
                <Input
                  id="limitIp"
                  type="number"
                  value={limitIp}
                  onChange={(e) => setLimitIp(e.target.value)}
                  placeholder="e.g. 2"
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
                  <Label htmlFor="durationDays">Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="e.g. 30"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-dashed">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flow">Flow</Label>
                <Select value={flow} onValueChange={setFlow}>
                  <SelectTrigger id="flow">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {protocol === "vless" && (
                      <SelectItem value="xtls-rprx-vision">XTLS Vision</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Input
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Internal notes"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid (LKR)</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
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

      <AlertDialog open={showLinkPrompt} onOpenChange={setShowLinkPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-violet-500" />
              Customer Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              The email <strong>{notificationEmail}</strong> is already registered to a customer.
              Do you want to link this new VPN service to their existing account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowLinkPrompt(false);
              setPendingSubmitData(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => executeSubmit(pendingSubmitData)}
            >
              Yes, Link Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showCreatePrompt} onOpenChange={setShowCreatePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-emerald-500" />
              New Customer
            </AlertDialogTitle>
            <AlertDialogDescription>
              The email <strong>{notificationEmail}</strong> is not in our database. 
              Do you want to create a new customer account for this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCreatePrompt(false);
              setPendingSubmitData(null);
            }}>
              No, Skip Linking
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => executeSubmit(pendingSubmitData)}
            >
              Yes, Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

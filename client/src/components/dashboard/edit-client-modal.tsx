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
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setXuiEmail(client.email || ""); // client.email is the XUI name
      setCustomerEmail(client.customerEmail || "");
      setIsLinked(!!client.customerId);
      setTotalGB((client.totalGB / (1024 * 1024 * 1024)).toFixed(2));
      setLimitIp(client.limitIp?.toString() || "0");
      setFlow(client.flow || "none");
      setComment(client.comment || "");
      
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

  const executeLink = async () => {
    if (!client || !customerEmail) return;
    setLinking(true);
    try {
      await api.post("/admin/client/link", {
        xuiId: client.id,
        email: customerEmail,
      });
      toast({ title: "Customer Linked", description: "Successfully linked to customer." });
      setIsLinked(true);
      setShowCreateConfirm(false);
      onSuccess();
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Failed to link customer";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLinking(false);
    }
  };

  const handleLink = async () => {
    if (!client || !customerEmail) return;
    
    setLinking(true);
    try {
      const checkRes = await api.get(`/admin/client/check-email?email=${encodeURIComponent(customerEmail)}`);
      if (!checkRes.data.obj.exists) {
        setShowCreateConfirm(true);
        setLinking(false);
        return;
      }
      
      await executeLink();
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Failed to check email";
      toast({ title: "Error", description: msg, variant: "destructive" });
      setLinking(false);
    }
  };

  const handleUnlink = async () => {
    if (!client) return;
    
    setLinking(true);
    try {
      await api.post("/admin/client/unlink", { xuiId: client.id });
      toast({ title: "Customer Unlinked", description: "Successfully unlinked from customer." });
      setIsLinked(false);
      setCustomerEmail("");
      onSuccess();
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "Failed to unlink customer";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLinking(false);
      setShowUnlinkConfirm(false);
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
            <Label>Linked Customer</Label>
            {isLinked ? (
              <div className="flex items-center gap-2">
                <Input value={customerEmail} readOnly className="bg-muted" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setShowUnlinkConfirm(true)}
                  disabled={linking}
                  className="shrink-0"
                >
                  {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlink className="mr-2 h-4 w-4" />}
                  Unlink
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  placeholder="user@example.com to link" 
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleLink}
                  disabled={!customerEmail || linking}
                >
                  {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                  {linking ? "" : "Link"}
                </Button>
              </div>
            )}
          </div>

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
                    <SelectItem value="xtls-rprx-vision">XTLS Vision</SelectItem>
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

      <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unlink <strong>{customerEmail}</strong> from this service. 
              The service will remain active in XUI, but it will no longer be tracked under this customer for payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={linking}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleUnlink();
              }}
              disabled={linking}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {linking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unlink Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showCreateConfirm} onOpenChange={setShowCreateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-emerald-500" />
              New Customer
            </AlertDialogTitle>
            <AlertDialogDescription>
              The email <strong>{customerEmail}</strong> is not in our database. 
              Do you want to create a new customer account for this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={linking}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                executeLink();
              }}
              disabled={linking}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {linking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Plus,
  Check,
  X,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  customerEmail: string;
  customerName?: string;
  inboundId: number;
  quotaGB: number | null;
  amountPaid: number;
  paymentDate: string | null;
  status: string;
  cycleStart: string | null;
  cycleEnd: string | null;
  isNewClient: boolean;
  notes: string | null;
  createdAt: string;
}

interface PaymentModalProps {
  open: boolean;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  inboundId: number | null;
  onClose: () => void;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 text-[10px]">
          <Check className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge variant="secondary" className="text-[10px]">
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
          <X className="h-3 w-3 mr-1" />
          Unpaid
        </Badge>
      );
  }
}

export default function PaymentModal({
  open,
  customerId,
  customerName,
  customerEmail,
  inboundId,
  onClose,
}: PaymentModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [markPaidConfirmOpen, setMarkPaidConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingPaidPayment, setPendingPaidPayment] = useState<Payment | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [paidCountdown, setPaidCountdown] = useState(2);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const { toast } = useToast();

  React.useEffect(() => {
    if (markPaidConfirmOpen) {
      setPaidCountdown(2);
      const timer = setInterval(() => {
        setPaidCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [markPaidConfirmOpen]);

  React.useEffect(() => {
    if (deleteConfirmOpen) {
      setDeleteCountdown(3);
      const timer = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deleteConfirmOpen]);

  // Form state
  const [formAmount, setFormAmount] = useState("");
  const [formStatus, setFormStatus] = useState("UNPAID");
  const [formNotes, setFormNotes] = useState("");

  const fetchPayments = async () => {
    const identifier = customerId || customerEmail;
    if (!identifier) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/payments/${identifier}`);
      if (res.data.success) {
        setPayments(res.data.obj);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && (customerId || customerEmail)) {
      fetchPayments();
      setFormOpen(false);
      setEditingPayment(null);
    }
  }, [open, customerId, customerEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      await api.put(`/admin/payments/${payment.id}`, {
        status: "PAID",
        amountPaid: payment.amountPaid,
      });
      toast({ title: "Success", description: "Payment marked as paid" });
      fetchPayments();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
    }
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        customerId,
        customerEmail,
        inboundId,
        amountPaid: parseFloat(formAmount) || 0,
        status: formStatus,
        notes: formNotes,
      };

      if (editingPayment) {
        await api.put(`/admin/payments/${editingPayment.id}`, payload);
        toast({ title: "Success", description: "Payment record updated" });
      } else {
        await api.post(`/admin/payments`, payload);
        toast({ title: "Success", description: "Payment record created" });
      }

      setFormOpen(false);
      setEditingPayment(null);
      fetchPayments();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await api.delete(`/admin/payments/${id}`);
      toast({ title: "Success", description: "Payment record deleted" });
      fetchPayments();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
    }
  };

  const startEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormAmount(payment.amountPaid.toString());
    setFormStatus(payment.status);
    setFormNotes(payment.notes || "");
    setFormOpen(true);
  };

  const startAdd = () => {
    setEditingPayment(null);
    setFormAmount("");
    setFormStatus("UNPAID");
    setFormNotes("");
    setFormOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="p-4 sm:p-6 sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payments
              <Badge variant="secondary" className="text-xs font-normal">
                {customerName || customerEmail || "Unnamed Customer"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                  <CreditCard className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No payment records found</p>
                  <Button variant="link" size="sm" onClick={startAdd} className="text-orange-500">
                    Add your first record
                  </Button>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="text-[10px] uppercase font-bold px-4">Transaction Details</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold hidden sm:table-cell">Amount</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold hidden sm:table-cell">Notes</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-right px-4">Act</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0">
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                                <span>
                                  {payment.createdAt
                                    ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                    : "—"}
                                </span>
                                <span>•</span>
                                <span>
                                  {payment.createdAt
                                    ? new Date(payment.createdAt).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                    : ""}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold tracking-tight text-foreground">
                                  {payment.amountPaid > 0 ? `LKR ${payment.amountPaid.toLocaleString()}` : "—"}
                                </span>
                                <div className="sm:hidden scale-[0.85] origin-left">
                                  <StatusBadge status={payment.status} />
                                </div>
                              </div>

                              {payment.notes && (
                                <p className="text-[9px] italic text-muted-foreground truncate max-w-[150px] sm:hidden leading-none">
                                  {payment.notes}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium hidden sm:table-cell px-4">
                            {payment.amountPaid > 0 ? `LKR ${payment.amountPaid.toLocaleString()}` : "—"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell px-4">
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate hidden sm:table-cell px-4">
                            {payment.notes || "—"}
                          </TableCell>
                          <TableCell className="text-right px-4">
                            <div className="flex items-center justify-end gap-1">
                              {payment.status === "UNPAID" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-orange-500/10"
                                  onClick={() => {
                                    setPendingPaidPayment(payment);
                                    setMarkPaidConfirmOpen(true);
                                  }}
                                >
                                  <Check className="h-4 w-4 text-orange-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => startEdit(payment)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10"
                                onClick={() => {
                                  setPendingDeleteId(payment.id);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <Button
                onClick={startAdd}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 shadow-lg shadow-orange-500/20"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Payment Record
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={markPaidConfirmOpen} onOpenChange={setMarkPaidConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
              <Check className="h-5 w-5" />
              Mark as Paid?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2 w-full">
                <p>
                  Confirm payment receipt for this client.
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed border-border/40 text-left w-full">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-semibold text-foreground truncate ml-2">{customerName || customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-emerald-600">LKR {pendingPaidPayment?.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-border/40 mt-1.5">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium text-foreground">
                      {pendingPaidPayment?.createdAt ? (
                        <>
                          {new Date(pendingPaidPayment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {" • "}
                          {new Date(pendingPaidPayment.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </>
                      ) : "—"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  This will update the transaction status immediately.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pendingPaidPayment) handleMarkAsPaid(pendingPaidPayment);
                setMarkPaidConfirmOpen(false);
              }}
              disabled={loading || paidCountdown > 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] transition-all rounded-md"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : paidCountdown > 0 ? (
                `Confirm (${paidCountdown}s)`
              ) : (
                "Confirm Payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Record?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2 w-full">
                <p>
                  Are you sure you want to delete this payment record?
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed border-border/40 text-left w-full">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-destructive">
                      LKR {payments.find(p => p.id === pendingDeleteId)?.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold">{payments.find(p => p.id === pendingDeleteId)?.status}</span>
                  </div>
                </div>
                <p className="text-xs text-destructive/80 font-medium pt-1">
                  This action cannot be undone and will remove the record forever.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pendingDeleteId) handleDeletePayment(pendingDeleteId);
                setDeleteConfirmOpen(false);
              }}
              disabled={loading || deleteCountdown > 0}
              className="bg-destructive text-white hover:bg-destructive/90 min-w-[140px] transition-all rounded-md"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : deleteCountdown > 0 ? (
                `Delete (${deleteCountdown}s)`
              ) : (
                "Confirm Deletion"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* NEW: Payment Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="p-5 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingPayment ? <Pencil className="h-5 w-5 text-orange-500" /> : <Plus className="h-5 w-5 text-orange-500" />}
              {editingPayment ? "Edit Payment" : "New Payment"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Amount (LKR)</Label>
              <Input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0"
                className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10 text-sm font-semibold"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Notes</Label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Optional notes..."
                rows={3}
                className="resize-none bg-muted/40 border-border/40 focus:ring-orange-500/10 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={loading} className="h-9">
              Cancel
            </Button>
            <Button
              onClick={handleSavePayment}
              disabled={loading || !formAmount}
              className="bg-orange-500 hover:bg-orange-600 text-white h-9"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPayment ? "Update Record" : "Create Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

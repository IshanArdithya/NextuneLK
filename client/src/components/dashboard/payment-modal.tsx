"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
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
  customerEmail: string;
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
  customerEmail,
  inboundId,
  onClose,
}: PaymentModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [formAmount, setFormAmount] = useState("");
  const [formStatus, setFormStatus] = useState("UNPAID");
  const [formNotes, setFormNotes] = useState("");

  const fetchPayments = async () => {
    if (!customerEmail) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/payments/${customerEmail}`);
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
    if (open && customerEmail) {
      fetchPayments();
      setShowAddForm(false);
      setEditingId(null);
    }
  }, [open, customerEmail]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleUpdatePayment = async (id: string) => {
    try {
      await api.put(`/admin/payments/${id}`, {
        amountPaid: parseFloat(formAmount) || 0,
        status: formStatus,
        notes: formNotes,
      });
      toast({ title: "Success", description: "Payment updated" });
      setEditingId(null);
      fetchPayments();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
    }
  };

  const handleAddPayment = async () => {
    try {
      await api.post(`/admin/payments`, {
        customerEmail,
        inboundId,
        amountPaid: parseFloat(formAmount) || 0,
        status: formStatus,
        notes: formNotes,
      });
      toast({ title: "Success", description: "Payment record created" });
      setShowAddForm(false);
      setFormAmount("");
      setFormStatus("UNPAID");
      setFormNotes("");
      fetchPayments();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create payment",
        variant: "destructive",
      });
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
    setEditingId(payment.id);
    setFormAmount(payment.amountPaid.toString());
    setFormStatus(payment.status);
    setFormNotes(payment.notes || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payments
            <Badge variant="secondary" className="text-xs font-normal">
              {customerEmail}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {payments.length === 0 && !showAddForm ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">No payment records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[11px]">Date</TableHead>
                      <TableHead className="text-[11px]">Amount</TableHead>
                      <TableHead className="text-[11px]">Status</TableHead>
                      <TableHead className="text-[11px]">Notes</TableHead>
                      <TableHead className="text-[11px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) =>
                      editingId === payment.id ? (
                        <TableRow key={payment.id}>
                          <TableCell colSpan={5}>
                            <div className="space-y-2 py-1">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <Label className="text-[10px]">Amount</Label>
                                  <Input
                                    type="number"
                                    value={formAmount}
                                    onChange={(e) =>
                                      setFormAmount(e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">Status</Label>
                                  <Select
                                    value={formStatus}
                                    onValueChange={setFormStatus}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="UNPAID">
                                        Unpaid
                                      </SelectItem>
                                      <SelectItem value="PAID">Paid</SelectItem>
                                      <SelectItem value="REFUNDED">
                                        Refunded
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px]">Notes</Label>
                                  <Input
                                    value={formNotes}
                                    onChange={(e) =>
                                      setFormNotes(e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                  className="h-7 text-xs"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdatePayment(payment.id)
                                  }
                                  className="h-7 text-xs"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow key={payment.id}>
                          <TableCell className="text-xs">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            {payment.amountPaid > 0
                              ? `LKR ${payment.amountPaid.toLocaleString()}`
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                            {payment.notes || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {payment.status === "UNPAID" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkAsPaid(payment)}
                                  title="Mark as Paid"
                                >
                                  <Check className="h-3.5 w-3.5 text-orange-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => startEdit(payment)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  handleDeletePayment(payment.id)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Add Payment Form */}
            {showAddForm && (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Payment Record
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Amount (LKR)</Label>
                    <Input
                      type="number"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select value={formStatus} onValueChange={setFormStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Notes</Label>
                  <Textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Optional notes..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddPayment}>
                    Create Record
                  </Button>
                </div>
              </div>
            )}

            {!showAddForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormAmount("");
                  setFormStatus("UNPAID");
                  setFormNotes("");
                  setShowAddForm(true);
                }}
                className="w-full"
              >
                <Plus className="mr-1 h-3 w-3" /> Add Payment Record
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

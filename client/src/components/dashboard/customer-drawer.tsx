"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
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
  User,
  Mail,
  Server,
  CreditCard,
  Pencil,
  Save,
  X,
  Loader2,
  Trash2,
  History,
  Calendar,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface LinkedService {
  id: string;
  xuiId: string;
  xuiEmail: string;
  inboundId: number;
  status: string;
}

interface Payment {
  id: string;
  amountPaid: number;
  currency: string;
  status: string;
  createdAt: string;
  notes: string | null;
}

interface Customer {
  id: string;
  email: string | null;
  name: string | null;
  status: string;
  createdAt: string;
  totalPayments: number;
  totalPaid: number;
  unpaidCount?: number;
  linkedServices: LinkedService[];
  notes?: string | null;
}

interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onUpdate: () => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerDrawer({
  open,
  onClose,
  customer,
  onUpdate,
  onDelete,
}: CustomerDrawerProps) {
  const [mode, setMode] = useState<"VIEW" | "EDIT" | "HISTORY">("VIEW");
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [localCustomer, setLocalCustomer] = useState<Customer | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    if (customer && open) {
      setLocalCustomer(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        status: customer.status || "ACTIVE",
        notes: customer.notes || "",
      });
      setMode("VIEW");
      fetchPayments();
    }
  }, [customer, open]);

  const fetchPayments = async () => {
    if (!customer) return;
    setPaymentsLoading(true);
    try {
      const res = await api.get(`/admin/payments/${customer.id}`);
      if (res.data.success) {
        setPayments(res.data.obj);
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setIsHolding(false);
            onDelete(localCustomer!);
            return 0;
          }
          return prev + 1.5; // ~1.3s hold
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, localCustomer, onDelete]);

  const handleSave = async () => {
    if (!localCustomer) return;
    setLoading(true);
    try {
      const res = await api.put(`/admin/customers/${localCustomer.id}`, formData);
      if (res.data.success) {
        setLocalCustomer(res.data.obj);
        toast({
          title: "Profile Updated",
          description: "Customer information has been saved successfully.",
        });
        setMode("VIEW");
        onUpdate();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!customer || !localCustomer) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="w-full sm:max-w-[480px] p-0 flex flex-col h-full border-l border-border/40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl [&>button]:opacity-0 gap-0"
      >
        {/* Header Section */}
        <SheetHeader className="px-4 sm:px-6 py-5 sm:py-7 flex flex-row items-center justify-between space-y-0 border-b border-border/40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-10">
          <div className="flex flex-col gap-0.5">
            <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {mode === "EDIT" ? "Edit Profile" : mode === "HISTORY" ? "Payment History" : "Customer Profile"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {mode === "HISTORY" ? "Full transaction logs for this customer." : "View and manage customer details, services, and payment history."}
            </SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 space-y-6 sm:space-y-8">
          {/* Identity & Quick Actions Card */}
          {mode !== "HISTORY" && (
            <div className="bg-muted/40 border border-border/40 p-4 sm:p-5 rounded-2xl relative overflow-hidden group">

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 pr-12 sm:pr-16">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight truncate text-slate-900 dark:text-zinc-100">
                    {localCustomer.name || "Unnamed Customer"}
                    {localCustomer.status === "ARCHIVED" && (
                      <Badge variant="outline" className="ml-2 text-[9px] bg-muted/50 text-muted-foreground border-border/40 uppercase font-bold tracking-widest">Archived</Badge>
                    )}
                  </h2>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3 w-3 opacity-60" /> {localCustomer.email || "No email linked"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === "VIEW" ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 border border-border/40 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</span>
                  <p className="text-lg font-black text-slate-900 dark:text-zinc-100 mt-1">
                    LKR {(localCustomer.totalPaid ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-muted/40 border border-border/40 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transactions</span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-black text-slate-900 dark:text-zinc-100">
                      {localCustomer.totalPayments ?? 0}
                    </p>
                    {localCustomer.unpaidCount ? (
                      <Badge variant="destructive" className="text-[10px] h-4.5 px-1.5 animate-pulse">
                        {localCustomer.unpaidCount} UNPAID
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Services Module */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Linked Services</span>
                  <Badge variant="outline" className="text-[9px] border-border/40 font-mono">
                    {localCustomer.linkedServices?.length ?? 0} ACTIVE
                  </Badge>
                </div>
                <div className="space-y-2">
                  {(localCustomer.linkedServices?.length ?? 0) > 0 ? (
                    localCustomer.linkedServices?.map((svc) => (
                      <div key={svc.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Server className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{svc.xuiEmail}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none h-5">
                          {svc.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed border-border/40">
                      <p className="text-xs text-muted-foreground italic">No linked services</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Payments Module */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Activity</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("HISTORY")}
                    className="h-6 text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 hover:bg-orange-500/5 gap-1 px-2"
                  >
                    View All <ExternalLink className="h-2.5 w-2.5" />
                  </Button>
                </div>
                {paymentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="border border-border/40 rounded-xl overflow-hidden bg-card">
                    <Table>
                      <TableBody>
                        {(payments?.length ?? 0) > 0 ? (
                          payments.slice(0, 5).map((payment) => (
                            <TableRow key={payment.id} className="hover:bg-muted/20 transition-colors border-border/40 last:border-0">
                              <TableCell className="py-2.5 px-3 sm:px-4">
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                    {format(new Date(payment.createdAt), "MMM d, yyyy")}
                                  </p>
                                  <p className="text-sm font-bold text-foreground">
                                    {payment.currency} {(payment.amountPaid ?? 0).toLocaleString()}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-2.5 px-3 sm:px-4">
                                <Badge
                                  className={`text-[9px] h-5 border-none px-1.5 ${payment.status === "PAID"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-amber-500/10 text-amber-600"
                                    }`}
                                >
                                  {payment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="text-center py-8 text-xs text-muted-foreground italic">
                              No payment history found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Administrative Notes</span>
                <div className="p-4 rounded-xl border border-border/40 bg-amber-500/5 min-h-[80px]">
                  {localCustomer.notes ? (
                    <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed italic">
                      "{localCustomer.notes}"
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center mt-4">No notes available.</p>
                  )}
                </div>
              </div>
            </>
          ) : mode === "EDIT" ? (
            /* EDIT MODE */
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                    className="pl-9 h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="h-9 bg-muted/40 border-border/40 focus:ring-orange-500/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Internal Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Private administrative context..."
                  className="bg-muted/40 border-border/40 focus:ring-orange-500/10 text-sm min-h-[120px] resize-none"
                />
                <p className="text-[9px] text-muted-foreground italic ml-1 mt-1">
                  Only admins can see these notes.
                </p>
              </div>
            </div>
          ) : (
            /* HISTORY MODE */
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/20">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{localCustomer.name || "Unnamed Customer"}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{localCustomer.email || "No email"}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-[9px] font-mono border-orange-500/20 text-orange-600 bg-orange-500/5">
                  HISTORY
                </Badge>
              </div>

              <div className="flex flex-col gap-1 ml-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Complete History</span>
                <p className="text-xs text-muted-foreground">Every recorded transaction for this entity.</p>
              </div>

              {paymentsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="border border-border/40 rounded-2xl overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40">
                        <TableHead className="text-[10px] uppercase font-bold py-3 px-3 sm:px-4">Transaction</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold py-3 px-3 sm:px-4 text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(payments?.length ?? 0) > 0 ? (
                        payments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-muted/20 transition-colors border-border/40 last:border-0">
                            <TableCell className="py-3 sm:py-4 px-3 sm:px-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-foreground">
                                    {payment.currency} {(payment.amountPaid ?? 0).toLocaleString()}
                                  </span>
                                  {payment.notes && (
                                    <Badge variant="outline" className="text-[8px] h-3.5 px-1 uppercase opacity-60">
                                      Note
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                  <Calendar className="h-3 w-3 opacity-60" />
                                  {format(new Date(payment.createdAt), "MMMM d, yyyy • HH:mm")}
                                </div>
                                {payment.notes && (
                                  <p className="text-[10px] italic text-muted-foreground mt-1 max-w-[200px] leading-tight">
                                    {payment.notes}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <Badge
                                className={`text-[10px] h-6 border-none px-2 font-bold uppercase tracking-tighter ${payment.status === "PAID"
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : "bg-amber-500/15 text-amber-600"
                                  }`}
                              >
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-12 text-sm text-muted-foreground italic">
                            No payment records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <SheetFooter className="p-4 sm:p-6 border-t border-border/40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-10 mt-0 flex flex-col gap-3">
          {mode === "VIEW" ? (
            <>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="h-10 text-xs font-bold uppercase tracking-wider gap-2 border-border/40"
                  onClick={() => setMode("EDIT")}
                  disabled={localCustomer.status === "ARCHIVED"}
                >
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-10 text-xs font-bold uppercase tracking-wider gap-2 border-border/40"
                  onClick={() => setMode("HISTORY")}
                >
                  <History className="h-4 w-4" /> Payment History
                </Button>
              </div>
              <Button
                variant="destructive"
                className="h-10 w-full text-xs font-bold uppercase tracking-wider gap-2 shadow-lg shadow-destructive/10 relative overflow-hidden group transition-all active:scale-95"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                disabled={localCustomer.status === "ARCHIVED"}
              >
                {/* Progress Overlay */}
                <div 
                  className="absolute left-0 top-0 h-full bg-white/20 transition-all duration-75 ease-linear pointer-events-none"
                  style={{ width: `${holdProgress}%` }}
                />
                <Trash2 className={`h-4 w-4 relative z-10 ${isHolding ? "animate-pulse" : ""}`} /> 
                <span className="relative z-10">
                  {isHolding ? "Release to Cancel" : (localCustomer.totalPayments > 0 ? "Hold to Archive" : "Hold to Delete")}
                </span>
              </Button>
            </>
          ) : mode === "EDIT" ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                className="h-10 text-xs font-bold uppercase tracking-wider border-border/40"
                onClick={() => setMode("VIEW")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="h-10 text-xs font-bold uppercase tracking-wider gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          ) : (
            /* HISTORY MODE FOOTER */
            <div className="flex justify-end w-full">
              <Button
                variant="outline"
                className="h-10 text-xs font-bold uppercase tracking-wider gap-2 border-border/40 px-8"
                onClick={() => setMode("VIEW")}
              >
                <User className="h-4 w-4" /> Back to Profile
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

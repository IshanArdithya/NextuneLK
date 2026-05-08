"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Banknote,
  Wallet,
  Receipt,
  MoreVertical,
  Trash2,
  Check,
  RefreshCw,
  Loader2,
  CreditCard,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/components/ui/use-toast";
import { format, startOfMonth, subDays, endOfDay, startOfDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface Transaction {
  id: string;
  customerEmail: string | null;
  inboundId: number;
  amountPaid: number;
  currency?: string;
  status: string;
  createdAt: string;
  notes: string | null;
  isNewClient: boolean;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportRange, setExportRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [exportStatus, setExportStatus] = useState("ALL");
  const [selectedQuickRange, setSelectedQuickRange] = useState<string>("THIS_MONTH");
  const [isExporting, setIsExporting] = useState(false);

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get("/admin/payments/all", {
        params: {
          status: statusFilter,
          email: search,
          sortBy,
          limit: 100
        }
      });
      if (res.data.success) {
        setTransactions(res.data.obj);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, sortBy, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deleteConfirmOpen && deleteCountdown > 0) {
      timer = setInterval(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deleteConfirmOpen, deleteCountdown]);

  const handleMarkAsPaid = async (payment: Transaction) => {
    try {
      await api.put(`/admin/payments/${payment.id}`, {
        status: "PAID",
        amountPaid: payment.amountPaid,
      });
      toast({ title: "Success", description: "Payment marked as paid" });
      fetchTransactions(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
    }
  };

  const initiateDelete = (transaction: Transaction) => {
    setPendingDelete(transaction);
    setDeleteCountdown(3);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/payments/${pendingDelete.id}`);
      toast({ title: "Success", description: "Transaction deleted" });
      setDeleteConfirmOpen(false);
      fetchTransactions(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await api.get("/admin/payments/all", {
        params: {
          status: exportStatus,
          startDate: exportRange.from ? startOfDay(exportRange.from).toISOString() : undefined,
          endDate: exportRange.to ? endOfDay(exportRange.to).toISOString() : undefined,
          limit: 1000,
        },
      });

      if (res.data.success) {
        const data = res.data.obj;
        if (data.length === 0) {
          toast({ title: "No Data", description: "No transactions found for the selected range." });
          return;
        }

        // Generate CSV
        const headers = ["ID", "Email", "Amount", "Status", "Date", "Notes", "Is New Client"];
        const rows = data.map((t: any) => [
          t.id,
          t.customerEmail || "N/A",
          t.amountPaid,
          t.status,
          format(new Date(t.createdAt), "yyyy-MM-dd HH:mm:ss"),
          t.notes || "",
          t.isNewClient ? "Yes" : "No",
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((r: any[]) => r.map(val => `"${val}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `nextune-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Success", description: `Downloaded ${data.length} records.` });
        setExportModalOpen(false);
      }
    } catch (err) {
      toast({ title: "Export Failed", description: "Could not generate CSV report.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const stats = {
    total: transactions.reduce((acc, t) => acc + t.amountPaid, 0),
    paid: transactions
      .filter((t) => t.status === "PAID")
      .reduce((acc, t) => acc + t.amountPaid, 0),
    unpaidCount: transactions.filter((t) => t.status === "UNPAID").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Transactions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track all client payments and invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
            className="h-9"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-xs h-9 px-4"
            onClick={() => setExportModalOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Total Revenue
                </p>
                <p className="text-lg font-bold">LKR {stats.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Collected
                </p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">LKR {stats.paid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Pending
                </p>
                <p className="text-lg font-bold">{stats.unpaidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden py-0 gap-0 border border-border/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:shadow-md rounded-2xl">
        <CardContent className="p-0">
          {/* Unified Toolbar */}
          <div className="p-4 sm:px-6 border-b border-border/40 flex flex-col gap-4 bg-muted/5">
            <div className="grid grid-cols-1 lg:flex lg:flex-row items-end gap-3 w-full">
              {/* Search */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Search</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search email or ID..."
                    className="pl-9 h-9 bg-background/50 border-border/40 focus:border-orange-500/50 focus:ring-orange-500/10 transition-all text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Status</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 w-full lg:w-[130px] bg-background/50 border-border/40 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Payments</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Sort By</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 w-full lg:w-[130px] bg-background/50 border-border/40 text-xs">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3" />
                        <SelectValue placeholder="Sort By" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
                      <SelectItem value="amount_asc">Amount (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Syncing ledger...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <CreditCard className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-lg font-medium text-zinc-400">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                {search || statusFilter !== "ALL"
                  ? "No payment records match your search or filter criteria."
                  : "All client payments and invoices will appear here."}
              </p>
              {(search || statusFilter !== "ALL") && (
                <Button variant="link" size="sm" className="mt-2 text-orange-600" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
                  Reset all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto px-4 py-4 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="w-[80%] sm:w-auto">Transaction</TableHead>
                    <TableHead className="hidden md:table-cell">Client Email</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Date & Time</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence initial={false}>
                    {transactions.map((t) => (
                      <TableRow key={t.id} className="group hover:bg-muted/20 transition-colors border-border/40">
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-3">
                            {/* Primary Info */}
                            <div className="flex flex-col">
                              <span className="font-mono text-[9px] text-muted-foreground uppercase leading-tight tracking-tighter">
                                #{t.id.slice(-8)}
                              </span>
                              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                                {t.notes || (t.isNewClient ? "New Activation" : "Service Renewal")}
                              </span>
                            </div>

                            {/* mobile secondary info stack */}
                            <div className="flex flex-col gap-2.5 sm:hidden border-l-2 border-orange-500/10 pl-3 ml-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground/60" />
                                <span className="text-[11px] font-medium truncate max-w-[200px] text-foreground/80">
                                  {t.customerEmail || "Unknown Client"}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <CalendarIcon className="h-3 w-3 text-muted-foreground/60" />
                                  <span className="text-[11px] font-semibold text-foreground/80">
                                    {format(new Date(t.createdAt), "MMM d")}
                                    <span className="text-[9px] text-muted-foreground font-medium ml-1">
                                      {format(new Date(t.createdAt), "hh:mm a")}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge
                                    className={`text-[9px] px-1.5 py-0 font-bold ${t.status === "PAID" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                      }`}
                                    variant="outline"
                                  >
                                    {t.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-dashed border-border/40">
                                <Banknote className="h-3.5 w-3.5 text-orange-600/70" />
                                <span className="text-sm font-black text-slate-900 dark:text-zinc-100">
                                  LKR {t.amountPaid.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Desktop-only Columns */}
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-600 border border-orange-500/10 shrink-0">
                              {(t.customerEmail?.[0] || "U").toUpperCase()}
                            </div>
                            <span className="font-medium truncate max-w-[150px]">
                              {t.customerEmail || "Unknown Client"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-center">
                          <div className="flex flex-col items-center leading-tight">
                            <span className="font-semibold text-slate-900 dark:text-zinc-100">
                              {format(new Date(t.createdAt), "MMM d, yyyy")}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 uppercase font-medium">
                              {format(new Date(t.createdAt), "hh:mm a")}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-center font-bold text-slate-900 dark:text-zinc-100">
                          LKR {t.amountPaid.toLocaleString()}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-center">
                          <Badge
                            className={`text-[10px] gap-1 font-bold ${t.status === "PAID" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}
                            variant="outline"
                          >
                            {t.status === "PAID" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {t.status === "UNPAID" && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsPaid(t)}
                                  className="cursor-pointer"
                                >
                                  <Check className="mr-2 h-4 w-4 text-orange-500" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => initiateDelete(t)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Record?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2 text-center space-y-2">
                <p>
                  Are you sure you want to delete transaction <strong>#{pendingDelete?.id.slice(-8)}</strong>?
                </p>
                <div className="bg-muted/50 p-3 rounded-lg text-[13px] border border-dashed text-left w-full">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-semibold truncate ml-2 text-foreground">{pendingDelete?.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold text-foreground">
                      {pendingDelete?.createdAt ? format(new Date(pendingDelete.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-border/40 mt-1.5">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-black text-orange-600 text-[14px]">
                      {pendingDelete?.currency || "LKR"} {pendingDelete?.amountPaid.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-destructive/80 font-medium pt-1">
                  This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 min-w-[140px] transition-all"
              disabled={deleteCountdown > 0 || isDeleting}
              onClick={(e) => {
                e.preventDefault();
                executeDelete();
              }}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : deleteCountdown > 0 ? (
                `Confirm (${deleteCountdown}s)`
              ) : (
                "Confirm Deletion"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden rounded-2xl border border-border/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="space-y-3 pb-4">
            <div className="mx-auto bg-orange-500/10 p-3 rounded-2xl w-fit">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-xl font-bold tracking-tight">Export Transactions</DialogTitle>
              <DialogDescription>
                Download a CSV report of your payment history.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Quick Ranges */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                Quick Ranges
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedQuickRange === "THIS_MONTH" ? "default" : "outline"}
                  size="sm"
                  className={`text-[10px] h-8 rounded-md transition-all duration-300 ${selectedQuickRange === "THIS_MONTH" ? "bg-orange-600 hover:bg-orange-700 shadow-sm text-white" : "bg-muted/40 border-border/40"
                    }`}
                  onClick={() => {
                    setExportRange({ from: startOfMonth(new Date()), to: new Date() });
                    setSelectedQuickRange("THIS_MONTH");
                  }}
                >
                  This Month
                </Button>
                <Button
                  variant={selectedQuickRange === "LAST_30" ? "default" : "outline"}
                  size="sm"
                  className={`text-[10px] h-8 rounded-md transition-all duration-300 ${selectedQuickRange === "LAST_30" ? "bg-orange-600 hover:bg-orange-700 shadow-sm text-white" : "bg-muted/40 border-border/40"
                    }`}
                  onClick={() => {
                    setExportRange({ from: subDays(new Date(), 30), to: new Date() });
                    setSelectedQuickRange("LAST_30");
                  }}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant={selectedQuickRange === "ALL_TIME" ? "default" : "outline"}
                  size="sm"
                  className={`text-[10px] h-8 rounded-md transition-all duration-300 ${selectedQuickRange === "ALL_TIME" ? "bg-orange-600 hover:bg-orange-700 shadow-sm text-white" : "bg-muted/40 border-border/40"
                    }`}
                  onClick={() => {
                    setExportRange({ from: undefined, to: undefined });
                    setSelectedQuickRange("ALL_TIME");
                  }}
                >
                  All Time
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                Payment Status
              </Label>
              <Select value={exportStatus} onValueChange={setExportStatus}>
                <SelectTrigger className="h-9 rounded-md bg-muted/40 border-border/40 text-xs shadow-none">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">All Payments</SelectItem>
                  <SelectItem value="PAID">Only Paid</SelectItem>
                  <SelectItem value="UNPAID">Only Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Range */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                Custom Date Range
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 rounded-md text-xs justify-start px-3 bg-muted/40 border-border/40 shadow-none font-normal">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {exportRange.from ? format(exportRange.from, "MMM d, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={exportRange.from}
                      onSelect={(date) => {
                        setExportRange(prev => ({ ...prev, from: date }));
                        setSelectedQuickRange("CUSTOM");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 rounded-md text-xs justify-start px-3 bg-muted/40 border-border/40 shadow-none font-normal">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      {exportRange.to ? format(exportRange.to, "MMM d, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="end">
                    <Calendar
                      mode="single"
                      selected={exportRange.to}
                      onSelect={(date) => {
                        setExportRange(prev => ({ ...prev, to: date }));
                        setSelectedQuickRange("CUSTOM");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-4 border-t border-border/40 bg-muted/5 sm:flex sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              className="rounded-md text-xs font-semibold"
              onClick={() => setExportModalOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm text-xs font-bold"
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Generating..." : "Generate CSV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

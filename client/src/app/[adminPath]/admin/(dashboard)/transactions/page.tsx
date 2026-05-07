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
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Transaction {
  id: string;
  customerEmail: string | null;
  inboundId: number;
  amountPaid: number;
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
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction record?"))
      return;
    try {
      await api.delete(`/admin/payments/${id}`);
      toast({ title: "Success", description: "Transaction deleted" });
      fetchTransactions(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
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
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-xs h-9 px-4">
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
          <div className="p-4 sm:px-6 border-b border-border/40 flex flex-col lg:flex-row gap-4 items-center justify-between bg-muted/5">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search email or ID..."
                className="pl-9 h-9 bg-background/50 border-border/40 focus:border-orange-500/50 focus:ring-orange-500/10 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px] bg-background/50 border-border/40 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Payments</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort By</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-[130px] bg-background/50 border-border/40 text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3 w-3" />
                      <SelectValue placeholder="Sort By" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="amount">Highest Amount</SelectItem>
                  </SelectContent>
                </Select>
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
                    <TableHead>Transaction</TableHead>
                    <TableHead>Client Email</TableHead>
                    <TableHead className="text-center">Date & Time</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence initial={false}>
                    {transactions.map((t) => (
                      <TableRow key={t.id} className="group hover:bg-muted/20 transition-colors border-border/40">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-muted-foreground uppercase leading-tight">
                              #{t.id.slice(-8)}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-zinc-100">
                              {t.notes || (t.isNewClient ? "New Activation" : "Service Renewal")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-600 border border-orange-500/10 shrink-0">
                              {(t.customerEmail?.[0] || "U").toUpperCase()}
                            </div>
                            <span className="font-medium truncate max-w-[150px]">
                              {t.customerEmail || "Unknown Client"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center leading-tight">
                            <span className="font-semibold text-slate-900 dark:text-zinc-100">
                              {format(new Date(t.createdAt), "MMM d, yyyy")}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 uppercase font-medium">
                              {format(new Date(t.createdAt), "hh:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-900 dark:text-zinc-100">
                          LKR {t.amountPaid.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
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
                                onClick={() => handleDelete(t.id)}
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
    </div>
  );
}

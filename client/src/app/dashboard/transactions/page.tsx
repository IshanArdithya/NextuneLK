"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  clientEmail: string;
  inboundId: number;
  amountPaid: number;
  status: string;
  createdAt: string;
  notes: string | null;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const res = await api.get("/dashboard/payments/all");
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
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleMarkAsPaid = async (payment: Transaction) => {
    try {
      await api.put(`/dashboard/payments/${payment.id}`, {
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
      await api.delete(`/dashboard/payments/${id}`);
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

  const filteredTransactions = transactions.filter(
    (t) =>
      t.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-headline)] tracking-tight">
            Transactions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track all clients payments and invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 text-xs h-9 px-4">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Total Revenue
                </p>
                <p className="text-lg font-bold">LKR {stats.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Collected Funds
                </p>
                <p className="text-lg font-bold">LKR {stats.paid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Pending Invoices
                </p>
                <p className="text-lg font-bold">{stats.unpaidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-white/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchTransactions(true)} 
            size="sm" 
            className="h-10 bg-background/50 border-white/10"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-10 bg-background/50 border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Clean Table Card - MATCHING DASHBOARD INBOUND STYLE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden py-0 gap-0 border border-border/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:shadow-md rounded-2xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-sm text-muted-foreground">Syncing ledger...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-semibold">No Transactions Found</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  We couldn&apos;t find any payment records matching your search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto px-4 py-4 sm:px-6">
                <Table className="text-[13px]">
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="font-bold text-foreground py-3">Transaction</TableHead>
                      <TableHead className="font-bold text-foreground py-3">Client Email</TableHead>
                      <TableHead className="font-bold text-foreground py-3 text-center">Date & Time</TableHead>
                      <TableHead className="font-bold text-foreground py-3 text-center">Amount</TableHead>
                      <TableHead className="font-bold text-foreground py-3 text-center">Status</TableHead>
                      <TableHead className="py-3"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((t) => (
                      <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors border-border/40">
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-muted-foreground uppercase leading-tight">
                              #{t.id.slice(-8)}
                            </span>
                            <span className="font-medium text-foreground">
                              Manual Payment
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] font-bold text-violet-600 border border-violet-500/10">
                              {t.clientEmail[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{t.clientEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <div className="flex flex-col items-center leading-tight">
                            <span className="font-medium">
                              {new Date(t.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 uppercase">
                              {new Date(t.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-center font-bold text-foreground">
                          LKR {t.amountPaid.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <Badge
                            className={`text-[10px] gap-1 font-normal ${
                              t.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
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
                        <TableCell className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {t.status === "UNPAID" && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsPaid(t)}
                                >
                                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-muted-foreground">
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
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
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

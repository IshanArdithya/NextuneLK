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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Calendar,
  MoreVertical,
  Trash2,
  Check,
  RefreshCw,
  Loader2,
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
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
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
      fetchTransactions();
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
      fetchTransactions();
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-headline)] mb-1">
            Financial Ledger
          </h1>
          <p className="text-muted-foreground">
            Track all client payments, invoices, and revenue history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchTransactions} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-bold">
              LKR {stats.total.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              All time history
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Collected Funds</CardDescription>
            <CardTitle className="text-2xl font-bold">
              LKR {stats.paid.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-500 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified payments
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Pending Invoices</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {stats.unpaidCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-amber-500 font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Awaiting client payment
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-white/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-semibold">Transaction</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold text-center">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => (
                    <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">
                            #{t.id.slice(-8)}
                          </span>
                          <span className="text-xs font-medium">
                            Manual Payment
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] font-bold text-violet-600">
                            {t.clientEmail[0].toUpperCase()}
                          </div>
                          <span className="text-sm">{t.clientEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(t.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold">
                          LKR {t.amountPaid.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            t.status === "PAID"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                          variant="outline"
                        >
                          {t.status === "PAID" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
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
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
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
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  CreditCard,
  Server,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Trash2,
  ArrowUpDown,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface LinkedService {
  id: string;
  xuiId: string;
  xuiEmail: string;
  inboundId: number;
  status: string;
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
}

interface DeletionStats {
  activeServices: number;
  unpaidPayments: number;
  totalOwed: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState<string | null>(null);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Customer | null>(null);
  const [deletionStats, setDeletionStats] = useState<DeletionStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/admin/customers", {
        params: {
          search,
          status: statusFilter,
          sortBy,
          limit: 100
        },
      });
      if (res.data.success) {
        setCustomers(res.data.obj);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const initiateDelete = async (customer: Customer) => {
    setSelectedForDelete(customer);
    try {
      const res = await api.get(`/admin/customers/${customer.id}/deletion-stats`);
      if (res.data.success) {
        setDeletionStats(res.data.obj);
        setShowDeleteAlert(true);
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch deletion stats", variant: "destructive" });
    }
  };

  const executeDelete = async () => {
    if (!selectedForDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/customers/${selectedForDelete.id}`);
      toast({ title: "Success", description: "Customer deleted successfully" });
      setShowDeleteAlert(false);
      fetchCustomers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete customer",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your billing entities and their linked VPN services
          </p>
        </div>
        <Button
          onClick={() => {
            setRefreshing(true);
            fetchCustomers();
          }}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="h-9"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden py-0 gap-0 border border-border/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:shadow-md rounded-2xl">
        <CardContent className="p-0">
          {/* Unified Toolbar - Always Visible */}
          <div className="p-4 sm:px-6 border-b border-border/40 flex flex-col lg:flex-row gap-4 items-center justify-between bg-muted/5">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                className="pl-9 h-9 bg-background/50 border-border/40 focus:border-orange-500/50 focus:ring-orange-500/10 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[120px] bg-background/50 border-border/40 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="email">Email (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Conditional Content inside the Card */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <AlertCircle className="h-10 w-10 text-destructive mb-4 opacity-80" />
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchCustomers}>
                Try Again
              </Button>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-lg font-medium text-zinc-400">No customers found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                {search || statusFilter !== "ALL"
                  ? "No customers match your current search query or filter."
                  : "Add a notification email when creating a client to see them here."}
              </p>
              {(search || statusFilter !== "ALL") && (
                <Button variant="link" size="sm" className="mt-2 text-orange-500" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
                  Reset all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto px-4 py-4 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead>Customer</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Payments</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence initial={false}>
                    {customers.map((customer) => (
                      <TableRow key={customer.id} className="group hover:bg-muted/20 transition-colors border-border/40">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{customer.name || "Unnamed"}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{customer.email || "No email"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {customer.linkedServices.length > 0 ? (
                              customer.linkedServices.map((svc) => (
                                <TooltipProvider key={svc.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-[10px] bg-background/50 flex items-center gap-1 font-mono">
                                        <Server className="h-2.5 w-2.5 opacity-60" />
                                        {svc.xuiEmail}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-[10px]">Inbound #{svc.inboundId} | Status: {svc.status}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground italic">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                LKR {customer.totalPaid.toLocaleString()}
                              </p>
                              {customer.unpaidCount ? (
                                <Badge variant="destructive" className="text-[9px] px-1 h-3.5 animate-pulse">
                                  {customer.unpaidCount} unpaid
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                              {customer.totalPayments} transactions
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(customer.createdAt), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <CreditCard className="mr-2 h-4 w-4" /> Payment History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => initiateDelete(customer)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
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

      {/* Deletion Alert Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Safety Verification
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-2">
              <div className="text-foreground font-medium">
                You are about to delete <strong>{selectedForDelete?.name || selectedForDelete?.email}</strong>.
              </div>

              {(deletionStats?.activeServices || 0) > 0 || (deletionStats?.unpaidPayments || 0) > 0 ? (
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 space-y-2">
                  <p className="text-xs font-bold text-destructive uppercase tracking-wider">Critical Warnings:</p>
                  <ul className="text-sm space-y-1 text-destructive/90 list-disc pl-4">
                    {deletionStats!.activeServices > 0 && (
                      <li>Has <strong>{deletionStats!.activeServices} active VPN service(s)</strong>. They will become orphaned.</li>
                    )}
                    {deletionStats!.unpaidPayments > 0 && (
                      <li>Has <strong>{deletionStats!.unpaidPayments} unpaid payment(s)</strong> totaling <strong>LKR {deletionStats!.totalOwed.toLocaleString()}</strong>.</li>
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-sm">
                  This action cannot be undone. All payment history for this customer will be permanently removed from the database.
                </p>
              )}

              <p className="text-[11px] text-muted-foreground italic">
                Tip: Consider "Unlinking" services or "Marking as Paid" before deletion for cleaner records.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                executeDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

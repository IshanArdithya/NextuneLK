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
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface LinkedService {
  id: string;
  xuiId: string;
  xuiEmail: string;
  inboundId: number;
  status: string;
}

interface Customer {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  totalPayments: number;
  totalPaid: number;
  linkedServices: LinkedService[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/dashboard/customers", {
        params: { search, limit: 100 },
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
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? All their payment history will be lost.")) return;
    try {
      await api.delete(`/dashboard/customers/${id}`);
      toast({ title: "Success", description: "Customer deleted successfully" });
      fetchCustomers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-headline)] tracking-tight">
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
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="border-border/40 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-muted-foreground">Loading customers...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-medium text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchCustomers}>
            Try Again
          </Button>
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/10 border-dashed">
          <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No customers found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add a notification email when creating a client to see them here.
          </p>
        </div>
      ) : (
        <Card className="border-border/40 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Customer</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Services</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Payments</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{customer.email}</p>
                        <Badge
                          variant={customer.status === "ACTIVE" ? "outline" : "secondary"}
                          className={`text-[10px] px-1.5 py-0 mt-0.5 ${
                            customer.status === "ACTIVE" 
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                              : ""
                          }`}
                        >
                          {customer.status}
                        </Badge>
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
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        LKR {customer.totalPaid.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
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
                          onClick={() => handleDelete(customer.id)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

// tooltip fallback
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Plus,
  RefreshCw,
  Server,
  Users,
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import ClientTable from "./client-table";
import AddClientModal from "./add-client-modal";
import EditClientModal from "./edit-client-modal";
import QRCodeModal from "./qr-code-modal";
import PaymentModal from "./payment-modal";
import ResetCycleModal from "./reset-cycle-modal";
import DeleteClientDialog from "./delete-client-dialog";
import LinkCustomerModal from "./link-customer-modal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface TrafficInfo {
  up: number;
  down: number;
  totalUsed: number;
  upFormatted: string;
  downFormatted: string;
  totalUsedFormatted: string;
  totalLimit: number;
  totalLimitFormatted: string;
  percentUsed: number;
}

interface ExpiryInfo {
  type: string;
  date?: string;
  isExpired?: boolean;
  remainingDays?: number;
  durationDays?: number;
  durationMs?: number;
}

export interface ClientData {
  id: string;
  xuiId: string;
  serviceId: string | null;
  inboundId: number;
  email: string; // xuiEmail
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  enable: boolean;
  flow: string;
  limitIp: number;
  subId: string;
  comment: string;
  reset: number;
  tgId: number;
  totalGB: number;
  expiryTime: number;
  expiry: ExpiryInfo;
  traffic: TrafficInfo;
  isOnline: boolean;
  statsEnabled: boolean;
}

export interface InboundData {
  id: number;
  remark: string;
  protocol: string;
  streamSettings: any;
  port: number;
  enable: boolean;
  up: number;
  down: number;
  total: number;
  upFormatted: string;
  downFormatted: string;
  totalFormatted: string;
  clients: ClientData[];
  clientCount: number;
}

export default function AdminDashboard() {
  const [inbounds, setInbounds] = useState<InboundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openInbounds, setOpenInbounds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const [addClientModal, setAddClientModal] = useState<{
    open: boolean;
    inboundId: number | null;
    protocol: string;
  }>({ open: false, inboundId: null, protocol: "" });
  const [editClientModal, setEditClientModal] = useState<{
    open: boolean;
    client: ClientData | null;
    inboundId: number | null;
  }>({ open: false, client: null, inboundId: null });
  const [qrModal, setQrModal] = useState<{
    open: boolean;
    client: ClientData | null;
    inboundRemark: string;
    inboundProtocol: string;
    inboundPort: number;
    streamSettings: any;
  }>({ open: false, client: null, inboundRemark: "", inboundProtocol: "", inboundPort: 0, streamSettings: null });
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    customerId: string;
    customerName: string;
    customerEmail: string;
    inboundId: number | null;
  }>({ open: false, customerId: "", customerName: "", customerEmail: "", inboundId: null });
  const [resetCycleModal, setResetCycleModal] = useState<{
    open: boolean;
    client: ClientData | null;
    inboundId: number | null;
  }>({ open: false, client: null, inboundId: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    client: ClientData | null;
    inboundId: number | null;
  }>({ open: false, client: null, inboundId: null });
  const [linkCustomerModal, setLinkCustomerModal] = useState<{
    open: boolean;
    client: ClientData | null;
  }>({ open: false, client: null });

  const fetchInbounds = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/admin/inbounds");
      if (res.data.success) {
        setInbounds(res.data.obj);

        // auto-open first inbound on initial load
        if (res.data.obj.length > 0 && openInbounds.size === 0) {
          setOpenInbounds(new Set([res.data.obj[0].id]));
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch inbounds";
      setError(msg);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast, openInbounds.size]);

  useEffect(() => {
    fetchInbounds();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInbounds();
  };

  const toggleInbound = (id: number) => {
    setOpenInbounds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalClients = inbounds.reduce((sum, ib) => sum + ib.clientCount, 0);
  const onlineClients = inbounds.reduce(
    (sum, ib) => sum + ib.clients.filter((c) => c.isOnline).length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </motion.div>
      </div>
    );
  }

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
            Inbounds & Clients
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your inbounds, and clients
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="shrink-0"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Server className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Total Inbounds
                </p>
                <p className="text-lg font-bold">{inbounds.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Total Clients
                </p>
                <p className="text-lg font-bold">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Online Now
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{onlineClients}</p>
                  {onlineClients > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inbounds List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {inbounds.map((inbound, index) => (
            <motion.div
              key={inbound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Collapsible
                open={openInbounds.has(inbound.id)}
                onOpenChange={() => toggleInbound(inbound.id)}
              >
                <Card className={`overflow-hidden py-0 gap-0 border transition-all duration-300 ${openInbounds.has(inbound.id) ? "border-orange-500/30 shadow-lg shadow-orange-500/5" : "hover:border-foreground/20 hover:shadow-md"}`}>
                  <CollapsibleTrigger asChild>
                    <button className={`w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer group transition-colors ${openInbounds.has(inbound.id) ? "bg-muted/30 dark:bg-muted/10" : "hover:bg-muted/30 dark:hover:bg-muted/10"}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`h-2 w-2 rounded-full shrink-0 transition-all duration-300 ${inbound.enable ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-red-500"
                            }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <h3 className="font-semibold text-base sm:text-lg tracking-tight truncate">
                              {inbound.remark}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 uppercase font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                            >
                              {inbound.protocol}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono border-foreground/10 text-muted-foreground">
                              :{inbound.port}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5 bg-background rounded-full px-2 py-0.5 border">
                              <Users className="h-3 w-3" />
                              {inbound.clientCount} clients
                            </span>
                            <span className="flex items-center gap-1">↑ <span className="text-foreground/80">{inbound.upFormatted}</span></span>
                            <span className="flex items-center gap-1">↓ <span className="text-foreground/80">{inbound.downFormatted}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={true}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddClientModal({
                              open: true,
                              inboundId: inbound.id,
                              protocol: inbound.protocol,
                            });
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${openInbounds.has(inbound.id) ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t px-4 py-4 sm:px-6">
                      {inbound.clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <WifiOff className="h-8 w-8 mb-2 opacity-40" />
                          <p className="text-sm">No clients in this inbound</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            disabled={true}
                            onClick={() =>
                              setAddClientModal({
                                open: true,
                                inboundId: inbound.id,
                                protocol: inbound.protocol,
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" /> Add Client
                          </Button>
                        </div>
                      ) : (
                        <ClientTable
                          clients={inbound.clients}
                          inboundId={inbound.id}
                          inboundRemark={inbound.remark}
                          onEdit={(client) => { }}
                          onQR={(client) =>
                            setQrModal({
                              open: true,
                              client,
                              inboundRemark: inbound.remark,
                              inboundProtocol: inbound.protocol,
                              inboundPort: inbound.port,
                              streamSettings: inbound.streamSettings,
                            })
                          }
                          onPayments={(client) =>
                            setPaymentModal({
                              open: true,
                              customerId: client.customerId || "",
                              customerName: client.customerName || "",
                              customerEmail: client.customerEmail || "",
                              inboundId: inbound.id,
                            })
                          }
                          onResetCycle={(client) =>
                            setResetCycleModal({
                              open: true,
                              client,
                              inboundId: inbound.id,
                            })
                          }
                          onDelete={(client) =>
                            setDeleteDialog({
                              open: true,
                              client,
                              inboundId: inbound.id,
                            })
                          }
                          onLink={(client: ClientData) =>
                            setLinkCustomerModal({
                              open: true,
                              client,
                            })
                          }
                        />
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AddClientModal
        open={addClientModal.open}
        inboundId={addClientModal.inboundId}
        protocol={addClientModal.protocol}
        onClose={() =>
          setAddClientModal({ open: false, inboundId: null, protocol: "" })
        }
        onSuccess={fetchInbounds}
      />
      <EditClientModal
        open={editClientModal.open}
        client={editClientModal.client}
        inboundId={editClientModal.inboundId}
        onClose={() =>
          setEditClientModal({ open: false, client: null, inboundId: null })
        }
        onSuccess={fetchInbounds}
      />
      <QRCodeModal
        open={qrModal.open}
        client={qrModal.client}
        inboundRemark={qrModal.inboundRemark}
        inboundProtocol={qrModal.inboundProtocol}
        inboundPort={qrModal.inboundPort}
        streamSettings={qrModal.streamSettings}
        onClose={() =>
          setQrModal({ open: false, client: null, inboundRemark: "", inboundProtocol: "", inboundPort: 0, streamSettings: null })
        }
      />
      <PaymentModal
        open={paymentModal.open}
        customerId={paymentModal.customerId}
        customerName={paymentModal.customerName}
        customerEmail={paymentModal.customerEmail}
        inboundId={paymentModal.inboundId}
        onClose={() =>
          setPaymentModal({ open: false, customerId: "", customerName: "", customerEmail: "", inboundId: null })
        }
      />
      <ResetCycleModal
        open={resetCycleModal.open}
        client={resetCycleModal.client}
        inboundId={resetCycleModal.inboundId}
        onClose={() =>
          setResetCycleModal({ open: false, client: null, inboundId: null })
        }
        onSuccess={fetchInbounds}
      />
      <DeleteClientDialog
        open={deleteDialog.open}
        client={deleteDialog.client}
        inboundId={deleteDialog.inboundId}
        onClose={() =>
          setDeleteDialog({ open: false, client: null, inboundId: null })
        }
        onSuccess={fetchInbounds}
      />
      <LinkCustomerModal
        open={linkCustomerModal.open}
        client={linkCustomerModal.client}
        onClose={() => setLinkCustomerModal({ open: false, client: null })}
        onSuccess={fetchInbounds}
      />
    </div>
  );
}


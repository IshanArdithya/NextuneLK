"use client";

import React from "react";
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreVertical,
  QrCode,
  Pencil,
  CreditCard,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Link as LinkIcon,
  Clock,
  Hourglass,
  Infinity,
  Loader2,
} from "lucide-react";
import { ClientData } from "./admin-dashboard";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface ClientTableProps {
  clients: ClientData[];
  inboundId: number;
  inboundRemark: string;
  onEdit: (client: ClientData) => void;
  onQR: (client: ClientData) => void;
  onPayments: (client: ClientData) => void;
  onResetCycle: (client: ClientData) => void;
  onDelete: (client: ClientData) => void;
  onLink: (client: ClientData) => void;
}

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!id) return <span className="text-xs text-muted-foreground">—</span>;

  const truncated = id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <span>{truncated}</span>
            {copied ? (
              <Check className="h-3 w-3 text-orange-500" />
            ) : (
              <Copy className="h-3 w-3 opacity-50" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{id}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TrafficBar({ traffic }: { traffic: ClientData["traffic"] }) {
  const percent = Number(traffic.percentUsed) || 0;
  let barColor = "from-orange-400 to-orange-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
  if (percent > 90) barColor = "from-red-400 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
  else if (percent > 75) barColor = "from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]";

  return (
    <div className="space-y-1.5 min-w-[130px]">
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span className="text-foreground/80">{traffic.totalUsedFormatted}</span>
        <span>{traffic.totalLimitFormatted}</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden border border-border/50">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}

function ExpiryBadge({ expiry }: { expiry: ClientData["expiry"] }) {
  if (expiry.type === "unlimited") {
    return (
      <Badge variant="outline" className="text-[10px] gap-1 font-normal">
        <Infinity className="h-3 w-3" />
        Unlimited
      </Badge>
    );
  }

  if (expiry.type === "after_first_use") {
    return (
      <Badge variant="secondary" className="text-[10px] gap-1 font-normal bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
        <Hourglass className="h-3 w-3" />
        {expiry.durationDays}d after use
      </Badge>
    );
  }

  if (expiry.isExpired) {
    return (
      <Badge variant="destructive" className="text-[10px] gap-1 font-normal">
        <Clock className="h-3 w-3" />
        Expired
      </Badge>
    );
  }

  const days = expiry.remainingDays || 0;
  const variant = days <= 3 ? "destructive" : days <= 7 ? "secondary" : "outline";

  return (
    <Badge variant={variant as "default"} className={`text-[10px] gap-1 font-normal ${days <= 7 && days > 3 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : ""}`}>
      <Clock className="h-3 w-3" />
      {days}d left
    </Badge>
  );
}

function StatusDot({ client }: { client: ClientData }) {
  const isEnded = client.expiry.isExpired || (client.traffic.totalLimit > 0 && client.traffic.totalUsed >= client.traffic.totalLimit);
  const isEnabled = client.enable;
  const isOnline = client.isOnline;

  if (!isEnabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px]">Manually Disabled</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isEnded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] shrink-0" />
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px]">Service Ended (Expired/Limited)</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="relative flex h-2 w-2 shrink-0">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </span>
        </TooltipTrigger>
        <TooltipContent><p className="text-[10px]">{isOnline ? "Online & Active" : "Active (Offline)"}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ClientTable({
  clients,
  inboundId,
  inboundRemark,
  onEdit,
  onQR,
  onPayments,
  onResetCycle,
  onDelete,
  onLink,
}: ClientTableProps) {
  const { toast } = useToast();
  const [statusConfirmOpen, setStatusConfirmOpen] = React.useState(false);
  const [pendingStatusClient, setPendingStatusClient] = React.useState<ClientData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  React.useEffect(() => {
    if (statusConfirmOpen) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [statusConfirmOpen]);

  const handleToggleEnable = async (client: ClientData) => {
    setLoading(true);
    try {
      await api.put("/admin/client/update", {
        inboundId: inboundId.toString(),
        clientId: client.id,
        xuiEmail: client.email,
        totalGB: client.totalGB / 1073741824,
        expiryTime: client.expiryTime > 0 ? new Date(client.expiryTime).getTime() : 0,
        enable: !client.enable,
        limitIp: client.limitIp,
        flow: client.flow,
        comment: client.comment,
        subId: client.subId,
        tgId: client.tgId,
        reset: client.reset,
      });
      toast({
        title: "Success",
        description: `Client ${!client.enable ? "enabled" : "disabled"} successfully`,
      });
      // Trigger parent refresh
      window.dispatchEvent(new CustomEvent("refresh-dashboard"));
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle client status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px] px-2 text-[10px] uppercase font-bold">Status</TableHead>
            <TableHead className="text-[10px] uppercase font-bold px-2">Client</TableHead>
            <TableHead className="text-[10px] uppercase font-bold hidden sm:table-cell">ID</TableHead>
            <TableHead className="text-[10px] uppercase font-bold px-2 sm:px-4">Usage</TableHead>
            <TableHead className="text-[10px] uppercase font-bold hidden sm:table-cell">Duration</TableHead>
            <TableHead className="text-[10px] uppercase font-bold text-right px-2">Act</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={client.id || `${client.email}-${index}`} className="group hover:bg-muted/30 transition-colors border-b-border/40">
              <TableCell className="px-2">
                <div className="flex items-center justify-center">
                  <Switch
                    checked={client.enable}
                    onCheckedChange={() => {
                      setPendingStatusClient(client);
                      setStatusConfirmOpen(true);
                    }}
                    className="scale-75 shadow-sm data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </TableCell>
              <TableCell className="px-2 max-w-[120px] sm:max-w-none">
                <div className="flex items-center gap-2">
                  <StatusDot client={client} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate sm:text-sm">{client.email}</p>
                    <div className="flex flex-col gap-0">
                      {(client.customerEmail || client.customerName) && (
                        <p className="text-[9px] text-orange-500/90 font-medium truncate">
                          {client.customerName || client.customerEmail}
                        </p>
                      )}
                      {client.comment && (
                        <p className="text-[9px] text-muted-foreground truncate hidden sm:block">
                          {client.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell px-4">
                <CopyableId id={client.id} />
              </TableCell>
              <TableCell className="px-2 sm:px-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 sm:hidden">
                     <span className="text-[10px] font-bold text-foreground/80">{client.traffic.totalUsedFormatted}</span>
                     <span className="text-[9px] text-muted-foreground">/ {client.traffic.totalLimitFormatted}</span>
                  </div>
                  <div className="hidden sm:block">
                    <TrafficBar traffic={client.traffic} />
                  </div>
                  <div className="sm:hidden mt-0.5 scale-90 origin-left">
                    <ExpiryBadge expiry={client.expiry} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell px-4">
                <ExpiryBadge expiry={client.expiry} />
              </TableCell>
              <TableCell className="text-right px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onQR(client)}>
                      <QrCode className="mr-2 h-4 w-4" />
                      QR Code / Links
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(client)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLink?.(client)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Link to Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPayments(client)}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payments
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <DropdownMenuItem 
                              onClick={() => onResetCycle(client)}
                              disabled={!client.customerId}
                              className={!client.customerId ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reset Cycle
                            </DropdownMenuItem>
                          </div>
                        </TooltipTrigger>
                        {!client.customerId && (
                          <TooltipContent side="left">
                            <p>Link a customer to enable cycle reset</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(client)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-center">
              {pendingStatusClient?.enable ? "Disable Client?" : "Enable Client?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="pt-2">
                Are you sure you want to {pendingStatusClient?.enable ? "disable" : "enable"} service for <strong>{pendingStatusClient?.email}</strong>? 
                {pendingStatusClient?.enable ? " They will lose connection immediately." : " This will restore their connection."}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={loading} className="w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pendingStatusClient) handleToggleEnable(pendingStatusClient);
                setStatusConfirmOpen(false);
              }}
              disabled={loading || countdown > 0}
              className={`w-full sm:w-auto min-w-[120px] ${pendingStatusClient?.enable ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white`}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                <span>{pendingStatusClient?.enable ? "Disable" : "Enable"} ({countdown}s)</span>
              ) : (
                <span>{pendingStatusClient?.enable ? "Disable Now" : "Enable Now"}</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
  Clock,
  Hourglass,
  Infinity,
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
              <Check className="h-3 w-3 text-emerald-500" />
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
  let barColor = "from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
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
      <Badge variant="secondary" className="text-[10px] gap-1 font-normal bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
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

export default function ClientTable({
  clients,
  inboundId,
  inboundRemark,
  onEdit,
  onQR,
  onPayments,
  onResetCycle,
  onDelete,
}: ClientTableProps) {
  const { toast } = useToast();

  const handleToggleEnable = async (client: ClientData) => {
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
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px] text-[11px]">Status</TableHead>
            <TableHead className="text-[11px]">Email</TableHead>
            <TableHead className="text-[11px] hidden sm:table-cell">ID</TableHead>
            <TableHead className="text-[11px]">Traffic</TableHead>
            <TableHead className="text-[11px]">Duration</TableHead>
            <TableHead className="text-[11px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={client.id || `${client.email}-${index}`} className="group hover:bg-muted/30 transition-colors border-b-border/40">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={client.enable}
                    onCheckedChange={() => handleToggleEnable(client)}
                    className="scale-75 shadow-sm"
                  />
                  {client.isOnline && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{client.email}</p>
                  <div className="flex flex-col gap-0.5">
                    {client.customerEmail && (
                      <p className="text-[10px] text-violet-500/80 font-medium">
                        {client.customerEmail}
                      </p>
                    )}
                    {client.comment && (
                      <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {client.comment}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <CopyableId id={client.id} />
              </TableCell>
              <TableCell>
                <TrafficBar traffic={client.traffic} />
              </TableCell>
              <TableCell>
                <ExpiryBadge expiry={client.expiry} />
              </TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuItem onClick={() => onPayments(client)}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payments
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onResetCycle(client)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Cycle (New Client)
                    </DropdownMenuItem>
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
    </div>
  );
}

"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ClientData } from "./admin-dashboard";

interface QRCodeModalProps {
  open: boolean;
  client: ClientData | null;
  inboundRemark: string;
  inboundProtocol: string;
  inboundPort: number;
  streamSettings: any;
  onClose: () => void;
}

function CopyableLink({
  label,
  link,
  variant = "green",
  showQR = true,
}: {
  label: string;
  link: string;
  variant?: "green" | "purple";
  showQR?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const colors =
    variant === "purple"
      ? "border-orange-500/30 bg-orange-500/5"
      : "border-orange-500/30 bg-orange-500/5";

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${colors} border-border/40`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-[10px] gap-1 font-bold uppercase tracking-tight hover:bg-orange-500/10 text-orange-600"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* QR Code */}
      {showQR && (
        <div
          className="flex justify-center cursor-pointer group"
          onClick={handleCopy}
          title="Click to copy link"
        >
          <div className="relative bg-white p-3 rounded-lg shadow-sm border border-border/10 transition-transform group-hover:scale-[1.02] group-active:scale-95">
            <QRCodeSVG
              value={link}
              size={180}
              level="M"
              bgColor="white"
              fgColor="black"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                Copy URL
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Link preview */}
      <div className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-2 py-1.5">
        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
        <p className="text-[10px] text-muted-foreground break-all font-mono leading-tight">
          {link}
        </p>
      </div>
    </div>
  );
}

export default function QRCodeModal({
  open,
  client,
  inboundRemark,
  inboundProtocol,
  inboundPort,
  streamSettings,
  onClose,
}: QRCodeModalProps) {
  if (!client) return null;

  // extract host from external proxy destination
  const vlessHost = streamSettings?.externalProxy?.[0]?.dest;

  // extract settings from XUI streamSettings
  const network = streamSettings?.network;
  const security = streamSettings?.security;
  const tlsSettings = streamSettings?.tlsSettings || streamSettings?.xtlsSettings || streamSettings?.realitySettings || {};
  const sni = tlsSettings?.serverName || tlsSettings?.sni || "";
  const fp = tlsSettings?.fingerprint || tlsSettings?.fp || tlsSettings?.settings?.fingerprint || tlsSettings?.settings?.fp || "";
  const alpn = tlsSettings?.alpn
    ? encodeURIComponent(Array.isArray(tlsSettings.alpn) ? tlsSettings.alpn.join(",") : tlsSettings.alpn)
    : "";

  // constructing link
  let vlessLink = `${inboundProtocol}://${client.id}@${vlessHost}:${inboundPort}`;
  const queryParts = [];
  if (network) queryParts.push(`type=${network}`);
  if (inboundProtocol === "vless") queryParts.push(`encryption=none`);
  if (security) queryParts.push(`security=${security}`);
  if (fp) queryParts.push(`fp=${fp}`);
  if (alpn) queryParts.push(`alpn=${alpn}`);
  if (sni) queryParts.push(`sni=${sni}`);
  if (client.flow && client.flow !== "none") queryParts.push(`flow=${client.flow}`);

  if (queryParts.length > 0) {
    vlessLink += `?${queryParts.join("&")}`;
  }

  vlessLink += `#${inboundRemark}-${client.email}`;

  // Construct Usage Link (Deep Link)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const usageLink = `${baseUrl}/usage?u=${client.email}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Client Links & QR
            <Badge variant="secondary" className="text-[10px] font-normal">
              {client.email}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {vlessHost ? (
            <>
              <div className="grid gap-4">
                <CopyableLink
                  label="Direct VLESS URL"
                  link={vlessLink}
                  variant="purple"
                />
                
                <CopyableLink
                  label="Usage Dashboard URL"
                  link={usageLink}
                  variant="green"
                  showQR={false}
                />
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Share the <strong>Usage Link</strong> with the client so they can track their data without logging in.
                </p>
              </div>
            </>
          ) : (
            <div className="p-6 border border-dashed border-orange-500/30 bg-orange-500/5 rounded-xl text-center space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">External Proxy Required</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Please configure an <strong>External Proxy</strong> destination in your X-UI inbound settings to generate direct connection links.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

const SUB_URI = process.env.NEXT_PUBLIC_SUB_URI || "";

interface QRCodeModalProps {
  open: boolean;
  client: ClientData | null;
  inboundRemark: string;
  onClose: () => void;
}

function CopyableLink({
  label,
  link,
  variant = "green",
}: {
  label: string;
  link: string;
  variant?: "green" | "purple";
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
      ? "border-violet-500/30 bg-violet-500/5"
      : "border-emerald-500/30 bg-emerald-500/5";

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${colors}`}>
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`text-[10px] ${variant === "purple"
            ? "border-violet-500/40 text-violet-600 dark:text-violet-400"
            : "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
            }`}
        >
          {label}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs gap-1"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* QR Code */}
      <div
        className="flex justify-center cursor-pointer group"
        onClick={handleCopy}
        title="Click to copy link"
      >
        <div className="relative bg-white p-3 rounded-lg shadow-sm transition-transform group-hover:scale-[1.02] group-active:scale-95">
          <QRCodeSVG
            value={link}
            size={200}
            level="L"
            bgColor="white"
            fgColor="black"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs font-medium text-gray-700">
              Click to copy
            </p>
          </div>
        </div>
      </div>

      {/* Link preview */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
        <p className="text-[10px] text-muted-foreground truncate font-mono">
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
  onClose,
}: QRCodeModalProps) {
  if (!client) return null;

  const subLink = SUB_URI && client.subId ? `${SUB_URI}${client.subId}` : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            QR Codes
            <Badge variant="secondary" className="text-[10px] font-normal">
              {client.email}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {subLink && (
            <CopyableLink
              label="Subscription"
              link={subLink}
              variant="purple"
            />
          )}

          {!subLink && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm text-center">
                Configure <code className="text-xs bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUB_URI</code> in your environment to enable QR codes.
              </p>
              <p className="text-xs mt-2 text-center">
                Example: <code className="bg-muted px-1 py-0.5 rounded">https://yourdomain.com/sub/</code>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Toaster, ToastBar, Toast } from "react-hot-toast";
import { Clock, UserX, CheckCircle2, AlertCircle } from "lucide-react";

export const CustomToaster = () => {
  const getToastIcon = (toast: Toast) => {
    if (toast.icon) return toast.icon;

    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return toast.icon === "⏳" ? (
          <Clock className="h-4 w-4 text-amber-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        );
      default:
        return null;
    }
  };

  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        className: "!bg-background !text-foreground !border !border-border",
        duration: 5000,
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg shadow-lg 
              ${
                t.type === "success"
                  ? "bg-green-500/10 border-green-500/20"
                  : ""
              }
              ${t.type === "error" ? "bg-red-500/10 border-red-500/20" : ""}`}
            >
              <div className="mt-0.5">{getToastIcon(t)}</div>
              <div className="flex-1 text-sm">
                {message}
                {t.type === "error" && (t as any).retryAfter && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Try again in {(t as any).retryAfter}s
                  </div>
                )}
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

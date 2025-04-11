"use client";

import { Toaster, ToastBar, Toast } from "react-hot-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ReactNode } from "react";

type CustomToast = Toast & {
  icon?: ReactNode | string;
};

const ToastIconWrapper = ({ children }: { children: ReactNode }) => (
  <div className="h-4 w-4 flex items-center justify-center">{children}</div>
);

const getDefaultIcon = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="text-current" />;
    case "error":
      return <AlertCircle className="text-current" />;
    default:
      return null;
  }
};

const renderToastIcon = (toast: CustomToast) => {
  if (toast.icon) {
    if (typeof toast.icon === "string") {
      return <ToastIconWrapper>{toast.icon}</ToastIconWrapper>;
    }
    return <ToastIconWrapper>{toast.icon}</ToastIconWrapper>;
  }

  return <ToastIconWrapper>{getDefaultIcon(toast.type)}</ToastIconWrapper>;
};

const getToastStyles = (type: Toast["type"]) => {
  const baseStyles = "flex items-start gap-1 p-4 rounded-lg shadow-lg border";

  switch (type) {
    case "success":
      return `${baseStyles} bg-green-500/10 border-green-500/20 text-green-500`;
    case "error":
      return `${baseStyles} bg-red-500/10 border-red-500/20 text-red-500`;
    case "loading":
      return `${baseStyles} bg-blue-500/10 border-blue-500/20 text-blue-500`;
    default:
      return baseStyles;
  }
};

export const CustomToaster = () => (
  <Toaster
    position="top-center"
    gutter={8}
    toastOptions={{
      duration: 3000,
      className: "",
      style: {
        border: "none",
        padding: "0",
        color: "transparent",
        background: "transparent",
      },
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ message }) => (
          <div className={getToastStyles(t.type)}>
            <div className="flex m-auto">
              {renderToastIcon(t as CustomToast)}
            </div>
            <div className="flex-1 text-sm">{message}</div>
          </div>
        )}
      </ToastBar>
    )}
  </Toaster>
);

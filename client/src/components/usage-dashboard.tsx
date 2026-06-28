"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Loader2,
  Infinity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Database,
  Calendar,
  User,
  Wifi,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Types ───────────────────────────────────────────────────────────────────

type UserStatus =
  | "Active"
  | "Inactive - Quota Exceeded"
  | "Expired"
  | "Disabled"
  | "Unknown";

interface DashboardData {
  username: string;
  status: UserStatus;
  download: number;
  upload: number;
  remaining: number | null;
  total: number | null;
  used: number;
  expiry_date: string | null;
  expiry_remaining: string | null;
  expiry_pending_duration: string | null;
  server_status: "Online" | "Issues Detected" | "Offline" | "Maintenance";
  last_checked: string;
  is_online: boolean;
  last_online: number | null;
}

interface ErrorModal {
  type: "not_found" | "server_error" | "rate_limit" | null;
  visible: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatLastChecked = (secondsAgo: number): string => {
  if (secondsAgo < 60) return "just now";
  const m = Math.floor(secondsAgo / 60);
  if (m === 1) return "1 min ago";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h === 1) return "1 hr ago";
  return `${h} hrs ago`;
};

const formatLastOnline = (timestamp: number | null): string => {
  if (!timestamp || timestamp <= 0) return "Never";
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 60_000) return "just now";
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(diff / 86_400_000);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getStatusStyles = (status: UserStatus) => {
  if (status === "Active")
    return { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" };
  if (status === "Inactive - Quota Exceeded" || status === "Expired")
    return { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" };
  if (status === "Disabled")
    return { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" };
  return { dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted" };
};

const getServerStatusStyles = (status: string) => {
  switch (status) {
    case "Online":
      return { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ping: true };
    case "Issues Detected":
      return { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", ping: false };
    case "Offline":
      return { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", ping: false };
    default:
      return { dot: "bg-muted-foreground", text: "text-muted-foreground", ping: false };
  }
};

// ─── Circular Progress Ring ──────────────────────────────────────────────────

function UsageRing({
  used,
  total,
  isUnlimited,
  isExceeded,
  animatedUsed,
}: {
  used: number;
  total: number | null;
  isUnlimited: boolean;
  isExceeded: boolean;
  animatedUsed: number;
}) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const percent = !isUnlimited && total ? Math.min((animatedUsed / total) * 100, 100) : 0;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-[#e2e4f0]"
        />
        {/* Progress */}
        {!isUnlimited && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={isExceeded ? "stroke-destructive" : "stroke-primary"}
            style={{ transition: "stroke-dashoffset 0.08s linear" }}
          />
        )}
        {isUnlimited && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="8 12"
            className="stroke-primary/30"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={`text-4xl font-extrabold tracking-tight sm:text-[42px] ${isExceeded ? "text-destructive" : "text-[#020418]"}`}>
          {animatedUsed.toFixed(1)}
          <span className="ml-1 text-[16px] font-medium text-[#6d6d88]">GB</span>
        </p>
        {isUnlimited ? (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-primary shadow-sm">
            <Infinity size={14} /> Unlimited
          </span>
        ) : total ? (
          <p className="mt-1 text-[14px] font-medium text-[#6d6d88]">
            of {total} GB
          </p>
        ) : null}
        {isExceeded && (
          <span className="mt-2 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-destructive shadow-sm">
            Limit exceeded
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DashboardSkeleton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col items-center justify-center rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-8 lg:col-span-2">
          <div className={`relative h-56 w-56 rounded-full border-[10px] border-[#f4f5f8] sm:h-64 sm:w-64 ${isLoading ? "animate-pulse" : "opacity-50"}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="h-8 w-24 rounded-md bg-slate-100 animate-pulse" />
              <div className="mt-2 h-4 w-16 rounded-md bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-6 sm:p-8">
            <div className="mb-4 h-4 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="mb-6 h-3 w-full rounded-full bg-slate-100 animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-[16px] bg-[#f8f9fc] border border-[#e2e4f0] p-4">
                  <div className="mb-3 h-3 w-16 rounded bg-slate-200 animate-pulse" />
                  <div className="h-6 w-20 rounded bg-slate-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-6 sm:p-8">
                <div className="mb-4 h-4 w-24 rounded bg-slate-100 animate-pulse" />
                <div className="h-6 w-32 rounded bg-slate-100 animate-pulse" />
                <div className="mt-3 h-3 w-20 rounded bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UsageDashboard() {
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorModal, setErrorModal] = useState<ErrorModal>({ type: null, visible: false });
  const [displayData, setDisplayData] = useState<DashboardData | null>(null);
  const [secondsSinceCheck, setSecondsSinceCheck] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState<number | null>(null);
  const [displayedUsed, setDisplayedUsed] = useState(0);
  const [, setPreviousUsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isSubmitted || !lastCheckedTime) return;
    setSecondsSinceCheck(Math.floor((Date.now() - lastCheckedTime) / 1000));
    const interval = setInterval(() => {
      setSecondsSinceCheck(Math.floor((Date.now() - lastCheckedTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, lastCheckedTime]);

  useEffect(() => {
    // 1. Check for deep-link params first (?u=... or ?user=...)
    const queryUser = searchParams.get("u") || searchParams.get("user");
    
    if (queryUser && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      const cleanUser = queryUser.trim();
      setUsername(cleanUser);
      checkUsage(cleanUser);
      
      // Clean up the URL so the name isn't stored in the address bar
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
      return;
    }

    // 2. Fallback to localStorage
    const stored = localStorage.getItem("nextune_username");
    if (stored && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setUsername(stored);
      checkUsage(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => { if (animationRef.current) clearInterval(animationRef.current); };
  }, []);

  const shakeInput = () => {
    inputRef.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 350, easing: "ease-in-out" }
    );
  };

  const checkUsage = async (inputUsername?: string) => {
    const target = (inputUsername || username).trim().toLowerCase();
    if (!target) { setHasError(true); shakeInput(); return; }

    setHasError(false);
    setIsLoadingCheck(true);

    try {
      const res = await api.get(`/external/getUsage/${encodeURIComponent(target)}`);
      const data = res.data;

      if (!data.success || !data.user) {
        setIsLoadingCheck(false);
        setErrorModal({ type: "not_found", visible: true });
        return;
      }

      const apiUser = data.user;
      const isExpired = apiUser.expiry.remaining === "Expired";
      const isLimitExceeded =
        apiUser.quota.total !== null &&
        Number(apiUser.quota.totalUsed) >= Number(apiUser.quota.total);
      const derivedStatus = isExpired || isLimitExceeded ? "Inactive" : apiUser.status;

      const dashboardData: DashboardData = {
        username: apiUser.name,
        status: derivedStatus,
        download: Number(apiUser.quota.download),
        upload: Number(apiUser.quota.upload),
        remaining: apiUser.quota.total === null ? null : Number(apiUser.quota.total) - Number(apiUser.quota.totalUsed),
        total: apiUser.quota.total === null ? null : Number(apiUser.quota.total),
        used: Number(apiUser.quota.totalUsed),
        expiry_date: apiUser.expiry.date,
        expiry_remaining: apiUser.expiry.remaining,
        expiry_pending_duration: apiUser.expiry.pending_duration,
        server_status: data.serverStatus,
        last_checked: "just now",
        is_online: apiUser.isOnline === true,
        last_online: apiUser.lastOnline || null,
      };

      setDisplayData(dashboardData);
      setIsSubmitted(true);
      setSecondsSinceCheck(0);
      setLastCheckedTime(Date.now());
      setDisplayedUsed(0);
      setPreviousUsed(0);
      setIsLoadingCheck(false);
      toast({ title: "Loaded", description: `Usage data for ${apiUser.name}` });
      localStorage.setItem("nextune_username", apiUser.name);
      animateCounter(Number(apiUser.quota.totalUsed));
    } catch (error: unknown) {
      setIsLoadingCheck(false);
      const err = error as any;
      if (err.response?.status === 404) setErrorModal({ type: "not_found", visible: true });
      else if (err.response?.status === 429) setErrorModal({ type: "rate_limit", visible: true });
      else setErrorModal({ type: "server_error", visible: true });
    }
  };

  const animateCounter = (target: number) => {
    setIsAnimating(true);
    const steps = 55;
    const stepDuration = 1100 / steps;
    let step = 0;
    if (animationRef.current) clearInterval(animationRef.current);
    animationRef.current = setInterval(() => {
      step++;
      const p = step / steps;
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplayedUsed(parseFloat((target * ease).toFixed(1)));
      if (step >= steps) {
        setDisplayedUsed(target);
        setPreviousUsed(target);
        setIsAnimating(false);
        if (animationRef.current) clearInterval(animationRef.current);
      }
    }, stepDuration);
  };

  // Derived
  const isUnlimited = displayData?.total === null;
  const isValidData = displayData && !isUnlimited && displayData.total! > 0 && displayData.used >= 0;
  const isLimitExceeded = isValidData ? displayData.used > displayData.total! : false;
  const calcPercent = (v: number) => displayData?.total ? (v / displayData.total) * 100 : 0;
  const isRefreshing = displayData && displayData.username.toLowerCase() === username.trim().toLowerCase();

  return (
    <section className="mx-auto max-w-5xl px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
          Usage Dashboard
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Check your usage
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
          Enter your username to view real-time data consumption, plan status, and connection health.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-12"
      >
        <div className="mx-auto max-w-lg">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-muted-foreground/70">
                HelloWorld-
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === "Enter" && checkUsage()}
                className="h-11 w-full rounded-xl border border-[#e2e4f0] bg-white shadow-sm pl-[98px] pr-4 text-[14px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => checkUsage()}
              disabled={isAnimating || isLoadingCheck}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 sm:w-[140px] text-[13px] font-medium text-white transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${isRefreshing ? "bg-[#020418] hover:shadow-black/20" : "bg-primary hover:shadow-primary/20"
                }`}
            >
              {isLoadingCheck ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isRefreshing ? (
                <RefreshCw size={15} className="transition-transform group-hover:rotate-45" />
              ) : (
                <Search size={15} />
              )}
              <span className="hidden sm:inline">
                {isLoadingCheck ? (isRefreshing ? "Refreshing..." : "Checking...") : isRefreshing ? "Refresh" : "Check"}
              </span>
            </button>
          </div>
          {hasError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-destructive">
              Please enter a username
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Error Modal */}
      <AnimatePresence>
        {errorModal.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setErrorModal({ type: null, visible: false })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle size={22} className="text-destructive" />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">
                {errorModal.type === "not_found" ? "User not found" : errorModal.type === "rate_limit" ? "Too many requests" : "Connection error"}
              </h3>
              <p className="mb-6 text-[14px] leading-relaxed text-muted-foreground">
                {errorModal.type === "not_found"
                  ? "We couldn't find an account with that name. Double-check your username and try again."
                  : errorModal.type === "rate_limit"
                    ? "You're checking too frequently. Please wait a few minutes before trying again."
                    : "Unable to reach the server. Please check your connection and try again."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setErrorModal({ type: null, visible: false });
                    if (errorModal.type === "not_found") { setUsername(""); setIsSubmitted(false); setDisplayData(null); }
                    else checkUsage();
                  }}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
                >
                  {errorModal.type === "not_found" ? "Try again" : "Retry"}
                </button>
                <button
                  onClick={() => setErrorModal({ type: null, visible: false })}
                  className="flex-1 rounded-lg border border-border py-2.5 text-[13px] font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard */}
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DashboardSkeleton isLoading={isLoadingCheck} />
          </motion.div>
        ) : displayData ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Account header card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#f4f5f8]">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[18px] font-bold leading-tight text-[#020418]">{displayData.username}</p>
                  <div className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#f4f5f8] ${getStatusStyles(displayData.status).text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${getStatusStyles(displayData.status).dot}`} />
                    {displayData.status}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {displayData.is_online && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      )}
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${displayData.is_online ? "bg-emerald-500" : "bg-slate-400"}`} />
                    </span>
                    <span className={`text-[13px] font-bold ${displayData.is_online ? "text-emerald-600" : "text-slate-500"}`}>
                      {displayData.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                  {!displayData.is_online && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button className="flex items-center gap-1 text-[#6d6d88] cursor-help hover:text-[#020418] transition-colors">
                          <Clock size={12} />
                          <span className="text-[12px]">{formatLastOnline(displayData.last_online)}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={0} className="bg-[#020418] text-white border-none text-[12px] font-medium px-3 py-1.5 shadow-xl">
                        {displayData.last_online && displayData.last_online > 0 ? new Date(displayData.last_online).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true }) : "Never"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            {/* Main content: Ring + Breakdown */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Ring card */}
              <div className="flex flex-col items-center justify-center rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-8 lg:col-span-2">
                <UsageRing
                  used={displayData.used}
                  total={displayData.total}
                  isUnlimited={isUnlimited}
                  isExceeded={isLimitExceeded}
                  animatedUsed={displayedUsed}
                />
                {/* Percentage badge below ring */}
                {!isUnlimited && isValidData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`mt-6 rounded-full px-4 py-1.5 text-[13px] font-bold ${isLimitExceeded
                      ? "bg-[#f4f5f8] text-destructive"
                      : "bg-[#f4f5f8] text-primary"
                      }`}
                  >
                    {Math.min((displayData.used / displayData.total!) * 100, 100).toFixed(1)}% used
                  </motion.div>
                )}
              </div>

              {/* Right side: data breakdown + stats */}
              <div className="space-y-6 lg:col-span-3">
                {/* Data breakdown card */}
                <div className="rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-6 sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f4f5f8]">
                      <Database size={14} className="text-primary" />
                    </div>
                    <h2 className="text-[20px] font-bold tracking-tight text-[#020418]">Data Breakdown</h2>
                  </div>

                  {/* Stacked bar */}
                  <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-[#f4f5f8] shadow-inner">
                    <div className="flex h-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isUnlimited ? `${displayData.download / (displayData.download + displayData.upload) * 100}%` : `${calcPercent(displayData.download)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-primary"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isUnlimited ? `${displayData.upload / (displayData.download + displayData.upload) * 100}%` : `${calcPercent(displayData.upload)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                        className="bg-amber-400 dark:bg-amber-500"
                      />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-[16px] bg-[#f8f9fc] border border-[#e2e4f0] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                          <ArrowDownToLine size={12} className="text-primary" />
                        </div>
                        <span className="text-[12px] font-medium text-[#6d6d88]">Download</span>
                      </div>
                      <p className="text-[18px] font-bold text-[#020418]">{displayData.download.toFixed(1)}<span className="ml-1 text-[12px] font-medium text-[#6d6d88]">GB</span></p>
                    </div>
                    <div className="rounded-[16px] bg-[#f8f9fc] border border-[#e2e4f0] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
                          <ArrowUpFromLine size={12} className="text-amber-500" />
                        </div>
                        <span className="text-[12px] font-medium text-[#6d6d88]">Upload</span>
                      </div>
                      <p className="text-[18px] font-bold text-[#020418]">{displayData.upload.toFixed(1)}<span className="ml-1 text-[12px] font-medium text-[#6d6d88]">GB</span></p>
                    </div>
                    <div className="rounded-[16px] bg-[#f8f9fc] border border-[#e2e4f0] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                          <Infinity size={12} className="text-slate-500" />
                        </div>
                        <span className="text-[12px] font-medium text-[#6d6d88]">Remaining</span>
                      </div>
                      <p className="text-[18px] font-bold text-[#020418]">
                        {isUnlimited ? <span className="text-primary">&#8734;</span> : <>{(displayData.remaining ?? 0).toFixed(1)}<span className="ml-1 text-[12px] font-medium text-[#6d6d88]">GB</span></>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan + Connection row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Plan expiry */}
                  <div className="rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f4f5f8]">
                        <Calendar size={14} className="text-primary" />
                      </div>
                      <h2 className="text-[18px] font-bold tracking-tight text-[#020418]">Plan Expiry</h2>
                    </div>
                    {displayData.expiry_date ? (
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[18px] font-bold text-[#020418] whitespace-nowrap">
                          {new Date(displayData.expiry_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="text-[13px] font-medium text-[#6d6d88] whitespace-nowrap">
                          {new Date(displayData.expiry_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                        </span>
                      </div>
                    ) : displayData.expiry_pending_duration ? (
                      <p className="text-[18px] font-bold text-[#020418]">
                        {displayData.expiry_pending_duration}
                        <span className="ml-1.5 text-[12px] font-medium text-[#6d6d88] block mt-1">(after first use)</span>
                      </p>
                    ) : (
                      <p className="text-[18px] font-bold text-[#020418]">Never expires</p>
                    )}
                    {displayData.expiry_pending_duration ? null : displayData.expiry_remaining === null || displayData.expiry_remaining === "N/A" ? (
                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f4f5f8] px-3 py-1 text-[12px] font-bold text-primary">
                        <Infinity size={12} /> No expiry
                      </span>
                    ) : (
                      <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-bold ${displayData.expiry_remaining === "Expired" ? "bg-[#f4f5f8] text-destructive" : "bg-[#f4f5f8] text-primary"
                        }`}>
                        {displayData.expiry_remaining}{displayData.expiry_remaining !== "Expired" && " left"}
                      </span>
                    )}
                  </div>

                  {/* Connection */}
                  <div className="rounded-[24px] bg-white border border-[#e2e4f0] shadow-sm p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f4f5f8]">
                        <Wifi size={14} className="text-primary" />
                      </div>
                      <h2 className="text-[18px] font-bold tracking-tight text-[#020418]">Connection</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[12px] font-medium text-[#6d6d88] block mb-1">Server Health</span>
                        <div className="flex items-center gap-2 min-h-[24px]">
                          <span className="relative flex h-2.5 w-2.5">
                            {getServerStatusStyles(displayData.server_status).ping && (
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${getServerStatusStyles(displayData.server_status).dot}`} />
                            )}
                            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${getServerStatusStyles(displayData.server_status).dot}`} />
                          </span>
                          <span className={`text-[15px] font-bold ${getServerStatusStyles(displayData.server_status).text} leading-none`}>
                            {displayData.server_status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[12px] font-medium text-[#6d6d88] block mb-1">Last Checked</span>
                        <div className="flex items-center min-h-[24px]">
                          <span className="text-[15px] font-bold text-[#020418] leading-none">{formatLastChecked(secondsSinceCheck)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Loader, Infinity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { usageContent } from "@/constants/usage";

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
  server_status: "Online" | "Issues Detected" | "Offline" | "Maintenance";
  last_checked: string;
}

interface ErrorModal {
  type: "not_found" | "server_error" | null;
  visible: boolean;
}

const formatLastChecked = (secondsAgo: number): string => {
  if (secondsAgo < 60) return "just now";
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo === 1) return "1 minute ago";
  if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo === 1) return "1 hour ago";
  return `${hoursAgo} hours ago`;
};

const getServerStatusStyles = (
  status: "Online" | "Issues Detected" | "Offline" | "Maintenance"
) => {
  switch (status) {
    case "Online":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        dotColor: "bg-green-500",
        animationType: "pulse",
      };
    case "Issues Detected":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        dotColor: "bg-amber-500",
        animationType: "flicker",
      };
    case "Offline":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        dotColor: "bg-red-500",
        animationType: "double-blink",
      };
    case "Maintenance":
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        dotColor: "bg-gray-500",
        animationType: "fade",
      };
    default:
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        dotColor: "bg-green-500",
        animationType: "pulse",
      };
  }
};

const ServerStatusIndicator = ({ status }: { status: string }) => {
  const styles = getServerStatusStyles(
    status as "Online" | "Issues Detected" | "Offline" | "Maintenance"
  );

  const dotAnimationVariants = {
    pulse: {
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
        ease: "easeInOut",
      },
    },
    flicker: {
      opacity: [1, 0.4, 1],
      backgroundColor: [
        "rgb(251, 146, 60)",
        "rgb(217, 119, 6)",
        "rgb(251, 146, 60)",
      ],
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
        ease: "easeInOut",
      },
    },
    "double-blink": {
      scale: [1, 0.8, 1, 0.8, 1],
      opacity: [1, 0.3, 1, 0.3, 1],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 4,
        ease: "easeInOut",
      },
    },
    fade: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${styles.bg}`}
    >
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${styles.dotColor}`}
        animate={
          dotAnimationVariants[
            styles.animationType as keyof typeof dotAnimationVariants
          ]
        }
      />
      <span className={`${styles.text} text-sm font-medium`}>{status}</span>
    </div>
  );
};

const LockedPlaceholder = ({ isLoading }: { isLoading: boolean }) => {
  const pulseVariants = {
    animate: isLoading
      ? {
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            "0 0 0 0 rgba(249, 115, 22, 0.1)",
            "0 4px 6px -1px rgba(249, 115, 22, 0.15)",
            "0 0 0 0 rgba(249, 115, 22, 0.1)",
          ],
        }
      : {
          opacity: 0.6,
        },
    transition: isLoading
      ? {
          duration: 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }
      : {
          duration: 0,
        },
  };

  return (
    <div className="flex flex-col gap-8">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
            />
            <p className="text-foreground/60 font-medium">
              {usageContent.fetchMessage}
            </p>
          </div>
        </motion.div>
      )}

      {/* placeholder cards grid */}
      <div className="grid md:grid-cols-2 gap-8 items-end">
        {/* left col: circular progress + connection insights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-start"
        >
          {/* circular progress meter skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="relative w-64 h-64 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-300 dark:text-gray-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-foreground/40 text-center italic">
                {usageContent.placeholder}
              </p>
            </div>
          </motion.div>

          {/* connection insights skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="w-full mt-8 p-6 rounded-2xl bg-gray-200 dark:bg-gray-800"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* right col: acc details & data breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-6"
        >
          {/* acc name card skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-800 h-24"
          >
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </motion.div>

          {/* plan exp card skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-800 h-24"
          >
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </motion.div>

          {/* data breakdown card skeleton */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-1"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default function UsageDashboard() {
  const [username, setUsername] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorModal, setErrorModal] = useState<ErrorModal>({
    type: null,
    visible: false,
  });
  const [displayData, setDisplayData] = useState<DashboardData | null>(null);
  const [secondsSinceCheck, setSecondsSinceCheck] = useState(0);
  const [serverStatus, setServerStatus] = useState<
    "Online" | "Issues Detected" | "Offline" | "Maintenance"
  >("Online");
  const [displayedUsed, setDisplayedUsed] = useState(0);
  const [previousUsed, setPreviousUsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);
  const { toast } = useToast();
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const minuteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isSubmitted) return;

    const updateInterval = setInterval(() => {
      setSecondsSinceCheck((prev) => prev + 60);
    }, 60000);

    return () => clearInterval(updateInterval);
  }, [isSubmitted]);

  const shakeInput = () => {
    if (inputRef.current) {
      inputRef.current.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 400,
          easing: "ease-in-out",
        }
      );
    }
  };

  const handleCheckUsage = async () => {
    if (!username.trim()) {
      setHasError(true);
      shakeInput();
      return;
    }

    setHasError(false);
    setIsLoadingCheck(true);

    try {
      const res = await api.get(
        `/external/getUsage/${encodeURIComponent(username.trim())}`
      );
      const data = await res.data;
      console.log(data);

      if (!data.success || !data.user) {
        setIsLoadingCheck(false);
        setErrorModal({ type: "not_found", visible: true });
        return;
      }

      // res ok and user exists
      const apiUser = data.user;

      const dashboardData: DashboardData = {
        username: apiUser.name,
        status: apiUser.status,
        download: Number(apiUser.quota.download),
        upload: Number(apiUser.quota.upload),
        remaining:
          apiUser.quota.total === null
            ? null
            : Number(apiUser.quota.total) - Number(apiUser.quota.totalUsed),
        total:
          apiUser.quota.total === null ? null : Number(apiUser.quota.total),
        used: Number(apiUser.quota.totalUsed),
        expiry_date: apiUser.expiry.date,
        expiry_remaining: apiUser.expiry.remaining,
        server_status: data.serverStatus,
        last_checked: "just now",
      };

      setDisplayData(dashboardData);
      setIsSubmitted(true);
      setSecondsSinceCheck(0);
      setDisplayedUsed(0);
      setPreviousUsed(0);
      setIsLoadingCheck(false);

      toast({
        title: "Success!",
        description: `Usage data loaded for ${apiUser.name}.`,
      });

      animateUsageCounter(Number(apiUser.quota.totalUsed));
    } catch (error) {
      setIsLoadingCheck(false);
      setErrorModal({ type: "server_error", visible: true });
    }
  };

  const animateUsageCounter = (targetValue: number) => {
    setIsAnimating(true);
    const startValue = 0;
    const difference = targetValue;
    const duration = 1.2;
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    let currentStep = 0;

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    animationRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      const currentValue = startValue + difference * easeProgress;
      setDisplayedUsed(Number.parseFloat(currentValue.toFixed(1)));

      if (currentStep >= steps) {
        setDisplayedUsed(targetValue);
        setPreviousUsed(targetValue);
        setIsAnimating(false);
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      }
    }, stepDuration);
  };

  const handleRetry = () => {
    setErrorModal({ type: null, visible: false });
    if (errorModal.type === "server_error") {
      handleCheckUsage();
    }
  };

  const handleTryAgain = () => {
    setErrorModal({ type: null, visible: false });
    setUsername("");
    setIsSubmitted(false);
    setDisplayData(null);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      if (minuteIntervalRef.current) {
        clearInterval(minuteIntervalRef.current);
      }
    };
  }, []);

  const getStatusColor = (status: UserStatus) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Inactive - Quota Exceeded")
      return "bg-orange-100 text-orange-700";
    if (status === "Expired") return "bg-orange-100 text-orange-700";
    if (status === "Disabled") return "bg-gray-100 text-gray-700";
    if (status === "Unknown") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const isUnlimited = displayData?.total === null;
  const isValidData =
    displayData &&
    !isUnlimited &&
    displayData.total > 0 &&
    displayData.used >= 0;
  const isLimitExceeded = isValidData && displayData.used > displayData.total;
  const calculatePercentage = (value: number) =>
    displayData ? (value / displayData.total) * 100 : 0;
  const progressPercentage = isValidData
    ? Math.min((displayedUsed / displayData.total) * 100, 100)
    : 0;
  const actualPercentage = isValidData
    ? (displayedUsed / displayData.total) * 100
    : 0;

  // --------------------

  const unlimitedTotal = displayData
    ? displayData.download + displayData.upload
    : 0;

  const unlimitedDownloadPercent = displayData
    ? (displayData.download / unlimitedTotal) * 100
    : 0;

  const unlimitedUploadPercent = displayData
    ? (displayData.upload / unlimitedTotal) * 100
    : 0;

  return (
    <section
      id="usage"
      className="py-20 px-4 bg-gradient-to-b from-background to-background/50"
    >
      <div className="max-w-6xl mx-auto">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {usageContent.sectionTitle}
          </h2>
          <p className="text-lg text-foreground/60">
            {usageContent.sectionDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center px-6 py-3 rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
              <span
                className={`font-medium pr-1 whitespace-nowrap transition-colors duration-200 ${
                  inputFocused ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {usageContent.inputPrefix}
              </span>
              <motion.input
                ref={inputRef}
                type="text"
                placeholder={usageContent.emptyMessage}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheckUsage()}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`flex-1 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none transition-all`}
              />
            </div>

            <motion.button
              onClick={handleCheckUsage}
              disabled={isAnimating || isLoadingCheck}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group whitespace-nowrap ${
                isAnimating || isLoadingCheck
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoadingCheck ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Loader size={18} />
                </motion.div>
              ) : (
                <Search size={18} />
              )}
              {isLoadingCheck
                ? `${usageContent.checkingLabel}`
                : `${usageContent.checkButtonLabel}`}
            </motion.button>
          </div>
          {hasError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {usageContent.errorMessages.emptyInput}
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence>
          {errorModal.visible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setErrorModal({ type: null, visible: false })}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {errorModal.type === "not_found" ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">
                      {usageContent.errorMessages.notFoundTitle}
                    </h3>
                    <p className="text-foreground/60 mb-6">
                      {usageContent.errorMessages.notFoundDesc}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleTryAgain}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() =>
                          setErrorModal({ type: null, visible: false })
                        }
                        className="flex-1 px-4 py-2 bg-border text-foreground rounded-lg hover:bg-border/80 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">
                      {usageContent.errorMessages.serverErrorTitle}
                    </h3>
                    <p className="text-foreground/60 mb-6">
                      {usageContent.errorMessages.serverErrorDesc}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRetry}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                      >
                        Retry
                      </button>
                      <button
                        onClick={() =>
                          setErrorModal({ type: null, visible: false })
                        }
                        className="flex-1 px-4 py-2 bg-border text-foreground rounded-lg hover:bg-border/80 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <LockedPlaceholder key="locked" isLoading={isLoadingCheck} />
          ) : displayData ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-8 items-end"
            >
              {/* left col: circular progress + connection insights */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-start"
              >
                {/* circular progress meter */}
                <div className="relative w-64 h-64">
                  {/* unlimited */}
                  {isUnlimited ? (
                    <svg
                      className="w-full h-full transform -rotate-90 opacity-40"
                      viewBox="0 0 200 200"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border/50"
                      />
                    </svg>
                  ) : /* limited */
                  isValidData ? (
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 200 200"
                    >
                      {/* bg */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border/50"
                      />

                      {/* progress */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={`url(#gradient${
                          isLimitExceeded ? "Warning" : ""
                        })`}
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 90}
                        strokeDashoffset={
                          2 * Math.PI * 90 * (1 - progressPercentage / 100)
                        }
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.05s linear" }}
                      />

                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="rgb(249,115,22)" />
                          <stop offset="100%" stopColor="rgb(255,59,48)" />
                        </linearGradient>

                        <linearGradient
                          id="gradientWarning"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="rgb(255,107,61)" />
                          <stop offset="100%" stopColor="rgb(255,59,48)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ) : (
                    /* fallback when not unlimited & no data */
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 200 200"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-300"
                      />
                    </svg>
                  )}

                  {/* center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isUnlimited ? (
                      <>
                        <p className="text-5xl font-bold text-orange-500">
                          {displayedUsed.toFixed(1)} GB
                        </p>

                        <p className="text-sm text-foreground/60 mt-1">
                          of Unlimited
                        </p>

                        <span className="mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 flex items-center gap-1">
                          <Infinity size={14} />
                        </span>
                      </>
                    ) : isValidData ? (
                      <>
                        <p
                          className={`text-5xl font-bold ${
                            isLimitExceeded ? "text-red-500" : "text-orange-500"
                          }`}
                        >
                          {displayedUsed.toFixed(1)} GB
                        </p>

                        <p className="text-sm text-foreground/60 mt-1">
                          of {displayData.total} GB
                        </p>

                        <span
                          className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold ${
                            isLimitExceeded
                              ? "bg-red-500/10 text-red-600"
                              : "bg-orange-500/10 text-orange-500"
                          }`}
                        >
                          {actualPercentage.toFixed(1)}% used
                        </span>

                        {isLimitExceeded && (
                          <span className="mt-3 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            Limit Exceeded
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-foreground/50 text-sm">
                        Data unavailable
                      </p>
                    )}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-full mt-8 p-6 rounded-2xl border border-border/50 bg-card shadow-lg hover:border-orange-500/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Connection Insights
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                        SERVER STATUS
                      </p>
                      <ServerStatusIndicator status={serverStatus} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                        LAST CHECKED
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-500" />
                        <p className="font-semibold text-gray-800 text-sm">
                          {formatLastChecked(secondsSinceCheck)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* right col: acc details & data breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col space-y-6"
              >
                <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-lg hover:border-orange-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">
                        Account Name
                      </p>
                      <p className="text-2xl font-bold">
                        {displayData.username}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                        displayData.status
                      )}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span className="text-xs font-semibold">
                        {displayData.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-lg hover:border-orange-500/30 transition-all">
                  <p className="text-sm text-foreground/60 mb-2">
                    Plan Expires
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    {displayData.expiry_date === null ? (
                      <p className="text-lg font-bold">Never Expires</p>
                    ) : (
                      <p className="text-lg font-bold">
                        {new Date(displayData.expiry_date).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </p>
                    )}

                    {displayData.expiry_remaining === null ? (
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold whitespace-nowrap">
                        <Infinity size={15} />
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold whitespace-nowrap">
                        {displayData.expiry_remaining} left
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-lg hover:border-orange-500/30 transition-all">
                  <p className="text-sm text-foreground/60 mb-4 font-semibold">
                    Data Breakdown
                  </p>

                  {isUnlimited ? (
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-6 bg-gray-200">
                      {/* download */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${unlimitedDownloadPercent}%` }}
                        transition={{ duration: 1 }}
                        className="bg-orange-500"
                      />

                      {/* upload */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${unlimitedUploadPercent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-amber-400"
                      />

                      {/* no remaining bar in unlimited */}
                    </div>
                  ) : (
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-6 bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${calculatePercentage(
                            displayData.download
                          )}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="bg-orange-500"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${calculatePercentage(displayData.upload)}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-amber-400"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${calculatePercentage(
                            displayData.remaining!
                          )}%`,
                        }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="bg-gray-300"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* download */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-foreground/70">
                          Download
                        </span>
                      </div>

                      {isUnlimited ? (
                        <span className="font-semibold text-foreground">
                          {displayData.download.toFixed(1)} GB
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {displayData.download.toFixed(1)} GB (
                          {calculatePercentage(displayData.download).toFixed(1)}
                          %)
                        </span>
                      )}
                    </div>

                    {/* upload */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <span className="text-sm text-foreground/70">
                          Upload
                        </span>
                      </div>

                      {isUnlimited ? (
                        <span className="font-semibold text-foreground">
                          {displayData.upload.toFixed(1)} GB
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {displayData.upload.toFixed(1)} GB (
                          {calculatePercentage(displayData.upload).toFixed(1)}%)
                        </span>
                      )}
                    </div>

                    {/* remaining */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className="text-sm text-foreground/70">
                          Remaining
                        </span>
                      </div>

                      {isUnlimited ? (
                        <span className="font-semibold text-foreground">
                          Unlimited
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {displayData.remaining.toFixed(1)} GB (
                          {calculatePercentage(displayData.remaining).toFixed(
                            1
                          )}
                          %)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

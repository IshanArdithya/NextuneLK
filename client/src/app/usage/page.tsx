"use client";

import Cookies from "js-cookie";

import {
  Calendar,
  CheckCircle2,
  Hourglass,
  Infinity,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  FetchError,
  isRateLimitError,
  isUserNotFoundError,
  RateLimitError,
  UserNotFoundError,
} from "@/types/errors";
import { toast } from "react-hot-toast";

const cookiesExpiration = Number(process.env.COOKIES_EXP);

const UsageChecker = () => {
  const [usage, setUsage] = useState({
    name: "",
    status: false,
    totalUsed: 0.0,
    download: 0.0,
    upload: 0.0,
    totalAvailable: 0.0,
    expiry: "",
  });

  const [name, setName] = useState(() => {
    return Cookies.get("username") || "";
  });

  const [animatedTotalGB, setAnimatedTotalGB] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<FetchError | undefined>();

  const fetchUsageData = async (username: string): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/usage/${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 429) {
          toast.error(errorData.message || "Too many requests", {
            icon: <Hourglass />,
            duration: errorData.retryAfter * 1000,
          });
          throw {
            isRateLimit: true,
            message: errorData.message,
            retryAfter: errorData.retryAfter,
          } as RateLimitError;
        } else if (errorData.error === "user_not_found") {
          toast.error(errorData.message || "User not found", {
            icon: <UserX />,
          });
          throw {
            isUserNotFound: true,
            message: errorData.message || "User not found",
          } as UserNotFoundError;
        } else {
          toast.error(errorData.message || "Failed to fetch data");
          throw new Error(errorData.message || "Failed to fetch data");
        }
      }
      const data = await response.json();
      setUsage(data);

      Cookies.set("username", username, {
        expires: cookiesExpiration,
        secure: true,
        sameSite: "strict",
        path: "/usage",
      });

      toast.success("Usage data loaded successfully", {
        icon: <CheckCircle2 />,
      });
    } catch (error: unknown) {
      if (isRateLimitError(error)) {
        setError(error);
      } else if (isUserNotFoundError(error)) {
        setError(error);
      } else if (error instanceof Error) {
        setError(error);
        toast.error(error.message);
      } else {
        const unknownError = new Error("An unknown error occurred");
        setError(unknownError);
        toast.error(unknownError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUsername = Cookies.get("username");
    if (savedUsername && savedUsername.trim()) {
      setName(savedUsername);
      fetchUsageData(savedUsername);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const timer = setTimeout(() => {
      if (!usage.totalAvailable || usage.totalAvailable <= 0) {
        const targetTotalGB = usage.totalUsed || 0;
        let progressTotalGB = 0;
        const steps = 100;
        const incrementTotalGB = targetTotalGB / steps;
        const intervalTime = 20;

        const interval = setInterval(() => {
          progressTotalGB += incrementTotalGB;
          const roundedTotalGB = Math.round(progressTotalGB * 10) / 10;

          setAnimatedTotalGB(roundedTotalGB);

          if (roundedTotalGB >= targetTotalGB) {
            setAnimatedTotalGB(targetTotalGB);
            clearInterval(interval);
          }
        }, intervalTime);

        return () => clearInterval(interval);
      }

      const targetTotalGB = usage.totalUsed;
      const targetPercentage = (usage.totalUsed / usage.totalAvailable) * 100;

      let progressTotalGB = 0;
      let progressPercentage = 0;
      const steps = 100;
      const incrementTotalGB = targetTotalGB / steps;
      const incrementPercentage = targetPercentage / steps;
      const intervalTime = 20;

      const interval = setInterval(() => {
        progressTotalGB += incrementTotalGB;
        progressPercentage += incrementPercentage;

        const roundedTotalGB = Math.round(progressTotalGB * 10) / 10;
        const roundedPercentage = Math.round(progressPercentage * 10) / 10;

        setAnimatedTotalGB(roundedTotalGB);
        setAnimatedPercentage(roundedPercentage);

        if (roundedTotalGB >= targetTotalGB) {
          setAnimatedTotalGB(targetTotalGB);
          setAnimatedPercentage(targetPercentage);
          clearInterval(interval);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [usage.totalUsed, usage.totalAvailable]);

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  const handleCheckUsage = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      fetchUsageData(trimmedName);
    }
  };

  const formatDataAmount = (gb: number) => {
    return gb.toFixed(1);
  };

  const getStatusText = (
    status: boolean,
    expiry: string,
    totalUsed: number,
    totalAvailable: number
  ): string => {
    if (status) return "Active";

    const now = new Date();
    const isExpired = new Date(expiry).getTime() < now.getTime();
    const isQuotaExceeded = totalUsed >= totalAvailable;

    if (isExpired) return "Inactive (Expired)";
    if (isQuotaExceeded) return "Inactive (Quota Exceeded)";
    return "Inactive";
  };

  const expirationDate = new Date(usage.expiry);
  const now = new Date();
  const timeDiff = expirationDate.getTime() - now.getTime();
  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor(timeDiff / (1000 * 60));
  const secondsLeft = Math.floor(timeDiff / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div
        className={`relative bg-slate-900 backdrop-blur-lg rounded-3xl p-8 w-full max-w-5xl border border-gray-700/50 shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-5"
        }`}
      >
        {/* loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* decorative elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr opacity-20 rounded-full blur-3xl" />

        {/* Hero */}
        <div
          className={`mb-6 relative z-10 transition-opacity duration-300 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1
            className={`text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r ${theme.light} mb-5`}
          >
            Summary
          </h1>

          <div className="flex items-center justify-center space-x-3 text-sm sm:text-base">
            <span className="text-gray-300 whitespace-nowrap">HelloWorld-</span>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                onKeyPress={(e) => e.key === "Enter" && handleCheckUsage()}
              />
            </div>
            <button
              onClick={handleCheckUsage}
              disabled={isLoading}
              className={`${theme.accent} text-white px-5 py-3 rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <span className="hidden sm:inline">Checking...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Check Usage</span>
                  <span className="sm:hidden">Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* divider */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-6 transition-all duration-800 ${
            isVisible ? "w-full" : "w-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        />

        {/* main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* left col - usage progress bar */}
          <div className="flex flex-col items-center justify-between space-y-6">
            <h2 className="text-2xl font-bold text-white">Total Usage</h2>

            <div className="relative aspect-square w-full max-w-[15rem] mx-auto">
              {/* glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-md" />

              {/* responsive SVG container */}
              <svg
                className="w-full h-full"
                viewBox="0 0 240 240"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      className="text-amber-400"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      className="text-emerald-400"
                    />
                  </linearGradient>
                </defs>

                {/* background track */}
                <circle
                  cx="120"
                  cy="120"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="9"
                  fill="transparent"
                  className="text-gray-700/30"
                />

                {/* progress indicator */}
                <circle
                  cx="120"
                  cy="120"
                  r="110"
                  stroke="url(#progressGradient)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: "rotate(-90deg)",
                    transformOrigin: "center",
                  }}
                />

                {/* center content - now using percentagebased positioning */}
                <foreignObject x="0" y="0" width="240" height="240">
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="text-center">
                      <div
                        className="text-4xl md:text-4xl font-bold text-white font-[Poppins] leading-none"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "none" : "translateY(8px)",
                          transition: "all 0.5s ease-out 0.3s",
                        }}
                      >
                        {animatedTotalGB.toFixed(1)} GB
                      </div>
                      <div
                        className="text-sm text-gray-400 mt-1 font-[Poppins]"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "none" : "translateY(8px)",
                          transition: "all 0.5s ease-out 0.4s",
                        }}
                      >
                        of{" "}
                        {usage.totalAvailable > 0
                          ? `${usage.totalAvailable} GB`
                          : `Unlimited`}
                      </div>
                      <div
                        className={`mt-2 px-3 py-1 rounded-full inline-block text-sm font-semibold font-[Poppins] ${
                          animatedPercentage <= 75
                            ? "bg-emerald-500/20 text-emerald-400"
                            : animatedPercentage <= 90
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "none" : "translateY(8px)",
                          transition: "all 0.5s ease-out 0.5s",
                        }}
                      >
                        {usage.totalAvailable > 0 ? (
                          `${animatedPercentage.toFixed(1)}% used`
                        ) : (
                          <Infinity className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </svg>

              {/* pulsing effect - outer circle */}
              {isVisible && (
                <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse pointer-events-none" />
              )}
            </div>

            <div
              className={`w-full bg-gradient-to-r ${theme.primary}/10 p-3 rounded-xl border border-gray-600/50 hover:${theme.border} transition-all group opacity-0`}
              style={{
                animation: isVisible
                  ? "fadeIn 0.5s ease-out 0.6s forwards"
                  : "none",
              }}
            >
              <div
                className="flex items-center justify-between opacity-0"
                style={{
                  animation: isVisible
                    ? "fadeInSlideX 0.5s ease-out 0.3s forwards"
                    : "none",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Expires on</p>
                    <p className="text-white text-sm font-medium">
                      {!usage.expiry
                        ? "Never"
                        : new Date(usage.expiry).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    !usage.expiry || usage.expiry === "0"
                      ? "bg-white/10 text-white"
                      : daysLeft <= 7
                      ? "bg-red-500/20 text-red-300"
                      : "bg-white/10 text-white"
                  } transition-all group-hover:scale-105 flex items-center gap-1`}
                >
                  {!usage.expiry || usage.expiry === "0" ? (
                    <>
                      <Infinity className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      {daysLeft > 1
                        ? `${daysLeft} days left`
                        : daysLeft === 1
                        ? "1 day left"
                        : hoursLeft >= 1
                        ? `${hoursLeft} ${
                            hoursLeft === 1 ? "hour" : "hours"
                          } left`
                        : minutesLeft >= 1
                        ? `${minutesLeft} ${
                            minutesLeft === 1 ? "minute" : "minutes"
                          } left`
                        : secondsLeft > 0
                        ? "Less than 1 minute left"
                        : "Expired"}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* right col - overview, stats, text */}
          <div className="flex flex-col justify-between space-y-6">
            {/* overview */}
            <div
              className={`bg-gray-700/50 p-5 rounded-xl border border-gray-600/50 hover:${theme.border} transition-all mb-6 opacity-0`}
              style={{
                animation: isVisible
                  ? "fadeInSlideX 0.5s ease-out 0.3s forwards"
                  : "none",
              }}
            >
              <div>
                <h3 className="text-md font-semibold text-white">
                  Account Overview
                </h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-sm mt-2">
                    <span className="text-gray-300 mr-2">Name:</span>
                    <span className="text-white font-medium">
                      {usage.name || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {/* <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        status === "Active"
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div> */}
                    <span className="text-gray-300 mr-2">Status:</span>
                    <span
                      className={`font-medium ${
                        usage.status === true
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {getStatusText(
                        usage.status,
                        usage.expiry,
                        usage.totalUsed,
                        usage.totalAvailable
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* stats cards */}
            <div className="space-y-4">
              <div
                className={`bg-gray-700/50 p-5 rounded-xl border border-gray-600/50 hover:${theme.border} transition-all group transform opacity-0`}
                style={{
                  animation: isVisible
                    ? "fadeInSlideX 0.5s ease-out 0.3s forwards"
                    : "none",
                }}
              >
                {/* responsive label container */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                      <span className="text-gray-300 text-sm">Download</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                      <span className="text-gray-300 text-sm">Upload</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-gray-300 text-sm">Remaining</span>
                    </div>
                  </div>
                </div>

                {/* combined progress bar */}
                <div className="w-full bg-gray-600/50 rounded-full h-3 mt-2 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-800"
                    style={{
                      width: isVisible
                        ? `${(usage.download / usage.totalAvailable) * 100}%`
                        : "0%",
                      transitionDelay: "0.7s",
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-full bg-teal-500 transition-all duration-800"
                    style={{
                      width: isVisible
                        ? `${(usage.upload / usage.totalAvailable) * 100}%`
                        : "0%",
                      left: isVisible
                        ? `${(usage.download / usage.totalAvailable) * 100}%`
                        : "0%",
                      transitionDelay: "0.9s",
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-full bg-gray-500 transition-all duration-800"
                    style={{
                      width: isVisible
                        ? `${
                            ((usage.totalAvailable -
                              usage.download -
                              usage.upload) /
                              usage.totalAvailable) *
                            100
                          }%`
                        : "0%",
                      left: isVisible
                        ? `${
                            ((usage.download + usage.upload) /
                              usage.totalAvailable) *
                            100
                          }%`
                        : "0%",
                      transitionDelay: "1.1s",
                    }}
                  />
                </div>

                {/* responsive breakdown - stacks on small screens */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 mt-4 text-sm">
                  <div className="flex xs:flex-col justify-between xs:justify-start">
                    <span className="text-gray-400 xs:mb-1">Download:</span>
                    <div>
                      <span className="text-indigo-400 font-medium">
                        {formatDataAmount(usage.download)}GB
                      </span>
                      {!usage.totalAvailable ? (
                        <></>
                      ) : (
                        <>
                          <span className="text-gray-400 ml-2 xs:ml-0 xs:block">
                            {(
                              (usage.download / usage.totalAvailable) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex xs:flex-col justify-between xs:justify-start">
                    <span className="text-gray-400 xs:mb-1">Upload:</span>
                    <div>
                      <span className="text-teal-400 font-medium">
                        {formatDataAmount(usage.upload)}GB
                      </span>
                      {!usage.totalAvailable ? (
                        <></>
                      ) : (
                        <>
                          <span className="text-gray-400 ml-2 xs:ml-0 xs:block">
                            {(
                              (usage.upload / usage.totalAvailable) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex xs:flex-col justify-between xs:justify-start">
                    <span className="text-gray-400 xs:mb-1">Remaining:</span>
                    <div>
                      {!usage.totalAvailable ? (
                        <>
                          <span>Unlimited</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-300 font-medium">
                            {formatDataAmount(
                              usage.totalAvailable -
                                usage.download -
                                usage.upload
                            )}
                            GB
                          </span>
                          <span className="text-gray-400 ml-2 xs:ml-0 xs:block">
                            {(
                              ((usage.totalAvailable -
                                usage.download -
                                usage.upload) /
                                usage.totalAvailable) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* text */}
            <div
              className={`bg-gray-700/50 p-4 rounded-xl border border-gray-600/50 hover:${theme.border} transition-all opacity-0`}
              style={{
                animation: isVisible
                  ? "fadeInSlideX 0.5s ease-out 0.3s forwards"
                  : "none",
              }}
            >
              <p className="text-sm text-gray-300 text-center">
                Not working?{" "}
                <a
                  href="#"
                  className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInSlideX {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInSlideXRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInSlideY {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default UsageChecker;

"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const UsageChecker = () => {
  const [usage, setUsage] = useState({
    name: "",
    status: false,
    total: 0.0,
    download: 0.0,
    upload: 0.0,
    totalAvailable: 0.0,
    expiration: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  const [name, setName] = useState("");
  const [animatedTotalGB, setAnimatedTotalGB] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("teal");
  const [isVisible, setIsVisible] = useState(false);

  const themes = {
    indigo: {
      primary: "from-indigo-500 to-violet-600",
      light: "from-indigo-400 to-violet-400",
      accent: "bg-indigo-600 hover:bg-indigo-700",
      border: "border-indigo-500/30",
      ring: "ring-indigo-500",
      text: "text-indigo-400",
      icon: "text-indigo-400",
      iconBg: "bg-indigo-500/20",
    },
    teal: {
      primary: "from-teal-500 to-emerald-600",
      light: "from-teal-400 to-emerald-400",
      accent: "bg-teal-600 hover:bg-teal-700",
      border: "border-teal-500/30",
      ring: "ring-teal-500",
      text: "text-teal-400",
      icon: "text-teal-400",
      iconBg: "bg-teal-500/20",
    },
    purple: {
      primary: "from-purple-500 to-pink-600",
      light: "from-purple-400 to-pink-400",
      accent: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-500/30",
      ring: "ring-purple-500",
      text: "text-purple-400",
      icon: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
  };

  const theme = themes[selectedTheme];

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/external/getUsage/${username}`);
        if (!response.ok) throw new Error("Failed to fetch usage data");
        const data = await response.json();

        setUsage({
          name: data.name,
          status: data.status,
          download: parseFloat(data.download),
          upload: parseFloat(data.upload),
          total: parseFloat(data.total),
          expiry: data.expiry,
        });

        setIsVisible(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUsageData();
    }
  }, [username]);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const timer = setTimeout(() => {
      if (usage.totalAvailable <= 0) {
        setAnimatedTotalGB(0);
        setAnimatedPercentage(0);
        return;
      }

      const targetTotalGB = usage.total;
      const targetPercentage = (usage.total / usage.totalAvailable) * 100;

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
  }, [usage.total, usage.totalAvailable]);

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  const handleCheckUsage = () => {
    if (name.trim()) {
      // API call
      console.log(`Checking usage for: ${name}`);
    }
  };

  const formatDataAmount = (gb) => {
    return gb.toFixed(1);
  };

  const daysLeft = Math.ceil(
    (new Date(usage.expiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div
        className={`relative bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 w-full max-w-5xl border border-gray-700/50 shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-5"
        }`}
      >
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
            className={`text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r ${theme.light} mb-3`}
          >
            Summary
          </h1>

          <div className="flex items-center justify-center space-x-3">
            <span className="text-gray-300 text-lg whitespace-nowrap">
              HelloWorld-
            </span>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
              />
            </div>
            <button
              onClick={handleCheckUsage}
              className={`${theme.accent} text-white px-5 py-3 rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg hover:scale-105 active:scale-95`}
            >
              Check
            </button>
            {/* <button
              className={`py-3 px-5 ${theme.accent} rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-102 active:scale-98`}
            >
              <RefreshCw className="h-5 w-5" />
            </button> */}
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
                        of {usage.totalAvailable}GB
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
                        {animatedPercentage.toFixed(1)}% used
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
                      {new Date(usage.expiration).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    daysLeft <= 7
                      ? "bg-red-500/20 text-red-300"
                      : "bg-white/10 text-white"
                  } transition-all group-hover:scale-105`}
                >
                  {daysLeft} days left
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
                      {usage.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional additional info - uncomment if needed */}
              {/* <div className="mt-4 pt-4 border-t border-gray-600/50">
    <div className="text-sm text-gray-400">
      Last active: {lastActive || "Never"}
    </div>
  </div> */}
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
                      <span className="text-gray-400 ml-2 xs:ml-0 xs:block">
                        {(
                          (usage.download / usage.totalAvailable) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex xs:flex-col justify-between xs:justify-start">
                    <span className="text-gray-400 xs:mb-1">Upload:</span>
                    <div>
                      <span className="text-teal-400 font-medium">
                        {formatDataAmount(usage.upload)}GB
                      </span>
                      <span className="text-gray-400 ml-2 xs:ml-0 xs:block">
                        {((usage.upload / usage.totalAvailable) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex xs:flex-col justify-between xs:justify-start">
                    <span className="text-gray-400 xs:mb-1">Remaining:</span>
                    <div>
                      <span className="text-gray-300 font-medium">
                        {formatDataAmount(
                          usage.totalAvailable - usage.download - usage.upload
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

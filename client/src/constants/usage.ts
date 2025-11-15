export const usageContent = {
  sectionTitle: "Monitor Your Data in Real-Time",
  sectionDescription:
    "Track your data usage, plan details, and expiry from one clean dashboard.",
  inputPrefix: "HelloWorld–",
  placeholder: "Enter your username or ID...",
  checkButtonLabel: "Check Usage",
  checkingLabel: "Checking...",
  fetchMessage: "Fetching your tunnel data...",
  emptyMessage: "Enter your username to check usage.",
  errorMessages: {
    emptyInput: "Please enter a username",
    notFoundTitle: "User Not Found",
    notFoundDesc:
      "We couldn't find an account with that name. Please check and try again.",
    serverErrorTitle: "Server Connection Error",
    serverErrorDesc: "Server connection error. Please try again later.",
  },
};

export const MOCK_USERS = [
  {
    username: "heo",
    total_gb: 100,
    used_gb: 65,
    expiry_date: "2025-11-25T18:00:00Z",
    download_gb: 52.9,
    upload_gb: 8.1,
  },
  {
    username: "nsc",
    total_gb: 100,
    used_gb: 110,
    expiry_date: "2025-11-27T09:00:00Z",
    download_gb: 85.5,
    upload_gb: 24.5,
  },
  {
    username: "reale",
    total_gb: 100,
    used_gb: 60,
    expiry_date: "2025-10-20T14:00:00Z",
    download_gb: 45.2,
    upload_gb: 14.8,
  },
];

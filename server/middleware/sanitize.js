export const sanitizeData = (req, res, next) => {
  const hasForbiddenKeys = (obj) => {
    if (!obj || typeof obj !== "object") return false;
    
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        return true;
      }
      if (typeof obj[key] === "object" && hasForbiddenKeys(obj[key])) {
        return true;
      }
    }
    return false;
  };

  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  if (req.query && hasForbiddenKeys(req.query)) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters detected.",
    });
  }

  next();
};

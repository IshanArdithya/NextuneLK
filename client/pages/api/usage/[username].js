const backendUrl = process.env.BACKEND_URL;

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Valid username required" });
  }

  const normalizedUsername = username.toLowerCase().trim();

  const safeParse = (value) => {
    try {
      if (value === 0) return 0;
      if (!value) return 0;
      if (typeof value === "number") return value;

      const numericValue =
        typeof value === "string"
          ? parseFloat(value.split(" ")[0] || value)
          : parseFloat(value);

      return isNaN(numericValue) ? 0 : numericValue;
    } catch {
      return 0;
    }
  };

  try {
    const backendResponse = await fetch(
      `${backendUrl}/api/external/getUsage/${encodeURIComponent(
        normalizedUsername
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
      }
    );

    if (!backendResponse.ok) {
      if (backendResponse.status === 429) {
        const errorData = await backendResponse.json();
        return res.status(429).json({
          error: "rate_limit",
          message: errorData.message || "Too many requests",
          retryAfter: errorData.retryAfter || 60,
        });
      }

      if (backendResponse.status === 404) {
        const errorData = await backendResponse.json();
        return res.status(404).json({
          error: "user_not_found",
          message: errorData.message || "The specified user was not found",
        });
      }

      const errorText = await backendResponse.text();
      throw new Error(
        `Backend error: ${backendResponse.status} - ${errorText}`
      );
    }

    const data = await backendResponse.json();
    const download = safeParse(data.download);
    const upload = safeParse(data.upload);
    const total = safeParse(data.total);

    res.status(200).json({
      ...data,
      download,
      upload,
      totalUsed: parseFloat((download + upload).toFixed(2)),
      totalAvailable: total,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch usage data",
      details: error.message,
    });
  }
}

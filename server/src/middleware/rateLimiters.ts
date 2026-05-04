import { rateLimit, MemoryStore } from "express-rate-limit";

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: "rate_limit_exceeded",
            message: "Too many requests, please try again later",
        });
    },
    store: new MemoryStore(),
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: "auth_rate_limit_exceeded",
            message: "Too many authentication attempts. Please try again after 15 minutes.",
        });
    },
    store: new MemoryStore(),
});
